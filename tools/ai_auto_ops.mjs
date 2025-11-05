import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const sh = (cmd, opts={}) => {
  try {
    const out = execSync(cmd, { stdio: ["ignore","pipe","pipe"], ...opts });
    return out.toString().trim();
  } catch (e) {
    const msg = e.stderr?.toString() || e.message;
    throw new Error(`CMD FAIL: ${cmd}\n${msg}`);
  }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

const REPO = process.env.REPO || sh(`git config --get remote.origin.url | sed -E 's#.*/([^/]+/[^/.]+)(\\.git)?$#\\1#'`);
const PR = process.env.PR || process.env.PR_NUM || "34";
const WORKFLOW = process.env.WORKFLOW || "mirror_gate.yml";
const DRY_WAIT = parseInt(process.env.DRY_WAIT || "10", 10);

function log(s){ console.log(`[auto-ops] ${s}`); }

function ghJson(cmd){
  const out = sh(`${cmd} --json state,mergeStateStatus,isDraft,reviewDecision,statusCheckRollup,headRefName,number`);
  return JSON.parse(out);
}

async function pollRun(workflowFile){
  // 最新のRunを拾って完了まで待つ
  for(;;){
    const js = sh(`gh run list --workflow '${workflowFile}' --limit 1 --json databaseId,headBranch,displayTitle,conclusion,status`);
    const arr = JSON.parse(js);
    if(!arr.length){ log("no runs yet"); await sleep(DRY_WAIT*1000); continue; }
    const run = arr[0];
    log(`run status=${run.status} conclusion=${run.conclusion || "n/a"} title="${run.displayTitle}"`);
    if(run.status === "completed") return run.conclusion || "success";
    await sleep(DRY_WAIT*1000);
  }
}

async function main(){
  log(`repo=${REPO} pr=#${PR} wf=${WORKFLOW}`);

  // 0) 事前チェック（Secretsが無いと公開pushは失敗するので警告だけ）
  try {
    sh(`gh secret list -R ${REPO} | grep -E 'MIRROR_(REPO|TOKEN)'`);
    log("Secrets(MIRROR_REPO/MIRROR_TOKEN) detected.");
  } catch {
    log("WARN: MIRROR_* secrets not visible via gh (権限やスコープの都合)。このまま続行します。");
  }

  // 1) PRの状態確認 → マージ可能なら自動Squash Merge
  log("check PR mergeability …");
  const pr = ghJson(`gh pr view ${PR} -R ${REPO}`);
  log(`PR state=${pr.state} draft=${pr.isDraft} mergeState=${pr.mergeStateStatus} reviews=${pr.reviewDecision || "n/a"}`);

  if(pr.state === "OPEN" && pr.isDraft === false && (pr.mergeStateStatus === "CLEAN" || pr.mergeStateStatus === "HAS_SUCCESSFUL_CHECKS")){
    log("merging PR (squash) …");
    sh(`gh pr merge ${PR} -R ${REPO} --squash --admin --delete-branch`);
  } else if(pr.state === "OPEN") {
    log("PR is open but not mergeable yet. Continue without merging.");
  } else {
    log("PR already merged/closed. Continue.");
  }

  // 2) Mirror Gate dry-run 実行
  log("trigger Mirror Gate (dry_run=true) …");
  sh(`gh workflow run '${WORKFLOW}' -R ${REPO} -f dry_run=true`);

  const dryConclusion = await pollRun(WORKFLOW);
  if(dryConclusion !== "success"){
    throw new Error(`dry-run failed: conclusion=${dryConclusion}`);
  }
  log("dry-run success ✔");

  // 3) 本番 push 実行
  log("trigger Mirror Gate (dry_run=false) …");
  sh(`gh workflow run '${WORKFLOW}' -R ${REPO} -f dry_run=false`);

  const prodConclusion = await pollRun(WORKFLOW);
  if(prodConclusion !== "success"){
    throw new Error(`mirror push failed: conclusion=${prodConclusion}`);
  }
  log("mirror push success ✔");

  // 4) Proof 追記
  const now = new Date().toISOString().replace(/[:.]/g,'-');
  const proof = [
    `# AutoOps Run ${now}`,
    `repo: ${REPO}`,
    `pr: ${PR}`,
    `workflow: ${WORKFLOW}`,
    `dry_run: success`,
    `push: success`,
    `generated: ${new Date().toISOString()}`,
    ``
  ].join('\n');
  const p = path.join("99_SYSTEM","Proofs",`AutoOps_Run_${now}.md`);
  fs.writeFileSync(p, proof);
  sh(`git add '${p}' && git commit -m "chore(proof): ${path.basename(p)}" && git push`);
  log(`wrote proof: ${p}`);
}

main().catch(e => {
  console.error(e.message || e);
  process.exit(1);
});
