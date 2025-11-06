import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

function sh(cmd){ return execSync(cmd,{encoding:'utf8'}).trim(); }

const repo = sh('basename -s .git "$(git config --get remote.origin.url | sed -E \'s#.*/##\')"');
const now = new Date();
const stamp = now.toISOString().slice(0,19).replace(/[:T]/g,'-');
const outDir = '99_SYSTEM/Proofs';
mkdirSync(outDir, { recursive: true });

const json = sh('gh pr list --state all --limit 200 --json number,title,author,headRefName,baseRefName,state,mergeable,mergedAt,createdAt,updatedAt,url');
const items = JSON.parse(json).sort((a,b)=> new Date(b.updatedAt)-new Date(a.updatedAt));

const top = items.slice(0,20);
const lines = [];

lines.push(`# PR Ledger — ${repo}`);
lines.push(`**Generated:** ${now.toISOString()}`);
lines.push('');

lines.push('## Quick Summary (latest 20)');
lines.push('');

for (const p of top) {
  const badge = p.state === 'MERGED' ? '🟣 merged' : p.state === 'OPEN' ? '🟢 open' : '⚫️ closed';
  lines.push(`- ${badge}  **#${p.number}** ${p.title}  ·  ${p.headRefName}→${p.baseRefName}  ·  [link](${p.url})`);
}

lines.push('');
lines.push('---');
lines.push('');
lines.push('## Full Ledger');
lines.push('');
lines.push('| # | title | state | branch | updated | author | link |');
lines.push('|---:|---|---|---|---|---|---|');

for (const p of items) {
  const upd = p.updatedAt?.slice(0,10) ?? '';
  const branch = `${p.headRefName}→${p.baseRefName}`;
  lines.push(`| ${p.number} | ${p.title.replace(/\|/g,'／')} | ${p.state.toLowerCase()} | ${branch} | ${upd} | ${p.author?.login ?? ''} | [open](${p.url}) |`);
}

const outFile = `${outDir}/PR_Ledger_${stamp}.md`;
writeFileSync(outFile, lines.join('\n'), 'utf8');

// 入口ファイルを更新（常に最新へのポインタ）
writeFileSync(`${outDir}/PR_Ledger_LATEST.md`,
  `<!-- auto-generated pointer -->\n\nSee: **${outFile}**\n\n`,'utf8');

console.log('Wrote:', outFile);

