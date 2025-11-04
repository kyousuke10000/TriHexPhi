import fs from "fs";
import path from "path";

const ROOT = ".";
const REPORT = "99_SYSTEM/Proofs/Proof_Duplicates_Audit_" + new Date().toISOString().slice(0,10) + ".md";

const canonicalPrefixes = [
  "🜇_Shiryu_Studio","00_HarmoniaCouncil","00_RYUDO",
  "10_CAPTURE_MIZUKAGAMI","20_CRYSTALLIZATION_KOKUYOU","30_MEMORY_SHINSEN",
  "40_HARMONIA","45_ATHANOR","50_CHL","60_Operations","99_SYSTEM"
];

const legacyPrefixes = [
  "10_TriHexCore","20_TriHex-Obsidian","30_ObsidianSync","50_SYSTEM","40_Archive","TriHex_Master_Reactivation"
];

let results = [];

function walk(dir){
  try {
    for(const f of fs.readdirSync(dir)){
      if(f.startsWith('.') && f !== '.git') continue; // Skip hidden dirs except .git
      const p = path.join(dir,f);
      try {
        const s = fs.statSync(p);
        if(s.isDirectory()) {
          if(f === 'node_modules' || f === '.git') continue;
          walk(p);
        }
        else results.push(p);
      } catch(e) {
        // Skip symlinks or inaccessible files
      }
    }
  } catch(e) {
    // Skip inaccessible directories
  }
}

walk(ROOT);

function classify(p){
  let canonical = canonicalPrefixes.find(pre=>p.startsWith(pre) || p.includes(`/${pre}/`));
  let legacy = legacyPrefixes.find(pre=>p.startsWith(pre) || p.includes(`/${pre}/`));
  if(legacy) return {p, type:"legacy", match:legacy};
  const match = p.match(/^([0-9]{2})_/);
  if(match && !canonicalPrefixes.some(pre=>pre.startsWith(match[1]))) return {p,type:"number_conflict",match:match[1]};
  return null;
}

const findings = results.map(classify).filter(Boolean);
const summary = {
  total: results.length,
  findings: findings.length,
  byType: Object.fromEntries(Object.entries(findings.reduce((a,f)=>{
    a[f.type]=(a[f.type]||0)+1; return a;
  },{})))
};

let md = `# Proof: Duplicate Audit – Structural Shadow Sweep

**Date:** ${new Date().toISOString().slice(0,10)}
**Mode:** Audit (no modification)
**Total Files Scanned:** ${summary.total}
**Findings:** ${summary.findings}

---

## 🔍 Summary by Type

`;

for(const [k,v] of Object.entries(summary.byType)) md += `- **${k}:** ${v}\n`;

md += `\n---

## 📂 Detailed Findings

`;

for(const f of findings){
  md += `- [${f.type}] ${f.p} (match: ${f.match})\n`;
}

fs.mkdirSync(path.dirname(REPORT),{recursive:true});
fs.writeFileSync(REPORT,md);
console.log("✅ Duplicate audit complete →",REPORT);
