#!/usr/bin/env node

/**
 * Generate human-readable summary from inventory
 */

import { readFile } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';

async function main() {
  const inventory = JSON.parse(
    await readFile('99_SYSTEM/Proofs/_raw/trihex_inventory.json', 'utf-8')
  );
  
  const { tree, stats } = inventory;
  
  // Top 10 largest files
  const largeFiles = tree
    .filter(i => i.type === 'file')
    .sort((a, b) => b.size_bytes - a.size_bytes)
    .slice(0, 10)
    .map(i => ({
      path: i.path,
      size: (i.size_bytes / 1024 / 1024).toFixed(2) + ' MB'
    }));
  
  // Top 10 most duplicates
  const topDuplicates = stats.duplicates
    .sort((a, b) => b.paths.length - a.paths.length)
    .slice(0, 10);
  
  // By extension summary
  const extSummary = stats.by_ext
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  // Generate markdown
  const summary = `# TriHex Inventory Summary

**Generated:** ${new Date().toISOString()}  
**Scanner:** inventory_scan.mjs

---

## 📊 Overall Stats

| Metric | Count |
|--------|-------|
| **Total Files** | ${stats.files_total} |
| **Total Directories** | ${stats.dirs_total} |
| **Duplicate Groups** | ${stats.duplicates.length} |
| **Oversized Files (>1GB)** | ${stats.oversized} |
| **Errors** | ${stats.errors} |

---

## 📁 Top 10 Largest Files

| Path | Size |
|------|------|
${largeFiles.map(f => `| \`${f.path}\` | ${f.size} |`).join('\n')}

---

## 🔄 Top 10 Duplicate Groups

${topDuplicates.map((d, i) => `
### ${i + 1}. ${d.paths.length} copies
\`\`\`
${d.paths.slice(0, 3).join('\n')}
${d.paths.length > 3 ? `... and ${d.paths.length - 3} more` : ''}
\`\`\`
`).join('')}

---

## 📄 Files by Extension (Top 20)

| Extension | Count |
|-----------|-------|
${extSummary.map(e => `| ${e.ext || '(none)'} | ${e.count} |`).join('\n')}

---

**Generated:** ${new Date().toISOString()}`;
  
  await writeFile('99_SYSTEM/Proofs/INVENTORY_SUMMARY.md', summary);
  console.log('✅ Summary saved to 99_SYSTEM/Proofs/INVENTORY_SUMMARY.md');
}

main().catch(console.error);


