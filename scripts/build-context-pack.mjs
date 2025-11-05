#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const LIST = [
  "99_SYSTEM/Proofs/Public_Mirror_Entry_Points_2025-11-05.md",
  "Genesis_Protocol_v3.1.md",
  "Memory_Contract_v1.md",
  "specs/architecture.yml",
  "specs/roadmap.yml",
  "index.md"
];
const DEC_GLOB = "00_RYUDO/Council/Decisions";

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe' }).toString().trim();
  } catch (e) {
    return '';
  }
}

function collect() {
  let blocks = [];
  
  for (const p of LIST) {
    try {
      blocks.push(`\n\n# >>> ${p}\n\n${readFileSync(p, 'utf-8')}`);
    } catch (e) {
      // File not found, skip
    }
  }
  
  // approved DEC だけ
  try {
    const decs = sh(`ls ${DEC_GLOB}/*.md 2>/dev/null || true`).split('\n').filter(Boolean);
    for (const d of decs) {
      try {
        const body = readFileSync(d, 'utf-8');
        if (body.includes('decision: approved')) {
          blocks.push(`\n\n# >>> ${d}\n\n${body}`);
        }
      } catch (e) {
        // Skip if can't read
      }
    }
  } catch (e) {
    // Skip if directory doesn't exist
  }
  
  return blocks.join('\n');
}

const md = `# TriHexΦ Context Pack
Generated: ${new Date().toISOString()}
${collect()}`;

writeFileSync('context/context_pack.md', md);

const truncated = md.slice(0, 16000);
writeFileSync('context/bootstrap.md',
  `You are participating in TriHexΦ Council.
Read and internalize the context before any judgement.
---
${truncated}
... (truncated) ...
`);

const hash = sh(`shasum -a 256 context/context_pack.md 2>/dev/null | awk '{print $1}' || echo "unknown"`);
writeFileSync('context/context_pack.json', JSON.stringify({
  generatedAt: new Date().toISOString(),
  hash
}, null, 2));

writeFileSync('context/VERSION', `${hash}\n`);

console.log("Context-Hash:", hash);

