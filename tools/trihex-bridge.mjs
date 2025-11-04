import {execSync as $} from "child_process";
import fs from "fs"; import path from "path";
const planPath = process.argv[2];
const plan = planPath ? fs.readFileSync(planPath,"utf8") : fs.readFileSync(0,"utf8");
const CWD = process.env.WORKTREE || process.cwd();
const lines = plan.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).filter(l=>!l.startsWith("#"));
const safePath = rel => { const p = path.resolve(CWD, rel); if(!p.startsWith(path.resolve(CWD))) throw new Error(`Path escape blocked: ${rel}`); return p; };
const log=[]; for(const step of lines){
  if(step.startsWith("MKDIR ")){ const p=safePath(step.slice(6)); fs.mkdirSync(p,{recursive:true}); log.push(`mkdir ${path.relative(CWD,p)}`); continue; }
  if(step.startsWith("WRITE ")){ const [_,rel,...rest]=step.split(" "); const body=rest.join(" ").replaceAll("\\n","\n"); const p=safePath(rel); fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p, body, {flag:"wx"}); log.push(`write ${rel} (${Buffer.byteLength(body)}B)`); continue; }
  if(step.startsWith("MOVE ")){ const [_,a,b]=step.split(" "); fs.renameSync(safePath(a), safePath(b)); log.push(`mv ${a} ${b}`); continue; }
  if(step.startsWith("RUN ")){ const cmd=step.slice(4); log.push(`$ ${cmd}`); $(cmd,{stdio:"inherit",cwd:CWD}); continue; }
  throw new Error(`Unknown step: ${step}`);
}
fs.mkdirSync("99_SYSTEM/Proofs",{recursive:true});
fs.writeFileSync(`99_SYSTEM/Proofs/BRIDGE_${Date.now()}.log`, log.join("\n")+"\n");
console.log("✅ bridge done");
