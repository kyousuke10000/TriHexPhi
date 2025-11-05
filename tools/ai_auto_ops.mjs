#!/usr/bin/env node

import { execSync as x } from "node:child_process";

const arg = (k,d=null)=>{const i=process.argv.indexOf(`--${k}`);return i>-1?process.argv[i+1]:d};

const PR = arg("pr","34");

const WF = arg("workflow",".github/workflows/mirror_gate.yml");

const DRY = arg("dry","true");

const OUT = `99_SYSTEM/Proofs/AUTO_OPS_${Date.now()}.log`;

function run(cmd){return x(cmd,{stdio:"pipe"}).toString().trim()}

const lines=[];

const log=(s)=>{lines.push(s);console.log(s);}

log(`# AUTO_OPS start pr=${PR} wf=${WF} dry=${DRY}`);

try{

  // Workflow存在確認

  run(`test -f ${WF}`);

  // まず dry-run で Mirror Gate を起動

  log("## dispatch: mirror gate (dry)");

  log(run(`gh workflow run ${WF} -f dry_run=${DRY}`));

  // 直近ジョブをウォッチ（失敗しても続行）

  try{ log(run(`gh run watch --exit-status || true`)); }catch(e){}

} catch(e){ log(`ERR ${e.message||e}`); }

await (await import('node:fs/promises')).writeFile(OUT, lines.join("\n"));

console.log(`WROTE ${OUT}`);
