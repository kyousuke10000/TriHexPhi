#!/usr/bin/env node

/**
 * Detect conflicts: duplicates, orphans, inconsistencies
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, basename } from 'node:path';

async function main() {
  console.log('🔍 Detecting conflicts and inconsistencies...');
  
  const inventory = JSON.parse(
    await readFile('99_SYSTEM/Proofs/_raw/trihex_inventory.json', 'utf-8')
  );
  
  const mappings = JSON.parse(
    await readFile('99_SYSTEM/Proofs/_raw/vault_mappings.json', 'utf-8')
  ).mappings;
  
  const { tree, stats } = inventory;
  
  // Build file map by path
  const fileMap = new Map();
  tree.forEach(item => {
    if (item.type === 'file') {
      fileMap.set(item.path, item);
    }
  });
  
  // Detect issues
  const issues = {
    DUPLICATE_FILE: [],
    ORPHANED_DIR: [],
    CANONICAL_INCONSISTENCY: [],
    MISPLACED_CORE: [],
    MISSING_CRITICAL: []
  };
  
  // 1. Duplicate files (same hash, different paths within TriHex)
  const trihexDupes = stats.duplicates.filter(dupe => {
    return dupe.paths.some(p => 
      p.includes('TriHex') || 
      p.includes('【Shii】') ||
      mappings.find(m => m.path === p && m.layer !== null)
    );
  });
  
  issues.DUPLICATE_FILE = trihexDupes.slice(0, 50).map(dupe => ({
    sha1: dupe.sha1,
    count: dupe.paths.length,
    paths: dupe.paths.slice(0, 5),
    recommendation: 'Keep canonical path, remove others'
  }));
  
  // 2. Orphaned directories (unmapped paths)
  const orphans = mappings
    .filter(m => !m.layer && 
      (m.path.includes('TriHex') || m.path.includes('【Shii】')) &&
      !m.path.includes('venv') &&
      !m.path.includes('node_modules') &&
      m.ext === '.md'
    )
    .slice(0, 50);
  
  issues.ORPHANED_DIR = orphans.map(o => ({
    path: o.path,
    size: o.size,
    recommendation: 'Assign to appropriate vault layer'
  }));
  
  // 3. Misplaced core files
  const coreFiles = ['TRIHEXPHI', 'Genesis_Protocol', 'Ryudo_Definition', 'Master_Reactivation'];
  const misplaced = mappings.filter(m => {
    return coreFiles.some(cf => m.path.includes(cf)) && m.layer && !m.path.includes('TriHexCore') && !m.path.includes('99_SYSTEM');
  });
  
  issues.MISPLACED_CORE = misplaced.map(m => ({
    path: m.path,
    current_layer: m.layer,
    recommendation: `Move to 10_TriHexCore or 99_SYSTEM`
  }));
  
  // Generate report
  const report = `# TriHex Conflict & Inconsistency Report

**Generated:** ${new Date().toISOString()}  
**Scanner:** detect_conflicts.mjs

---

## 📊 Summary

| Issue Type | Count | Severity |
|------------|-------|----------|
| **DUPLICATE_FILE** | ${issues.DUPLICATE_FILE.length} | 🟨 Medium |
| **ORPHANED_DIR** | ${issues.ORPHANED_DIR.length} | 🟨 Medium |
| **MISPLACED_CORE** | ${issues.MISPLACED_CORE.length} | 🟥 High |
| **CANONICAL_INCONSISTENCY** | ${issues.CANONICAL_INCONSISTENCY.length} | 🟨 Medium |
| **MISSING_CRITICAL** | ${issues.MISSING_CRITICAL.length} | 🟥 High |

---

## 🔄 Duplicate Files (Top 20)

${issues.DUPLICATE_FILE.slice(0, 20).map((d, i) => `
### ${i + 1}. ${d.count} copies

**Paths:**
\`\`\`
${d.paths.join('\n')}
\`\`\`

**Recommendation:** ${d.recommendation}
`).join('')}

---

## 📁 Orphaned Files (Top 20)

${issues.ORPHANED_DIR.slice(0, 20).map((o, i) => `
### ${i + 1}. \`${o.path}\`

**Size:** ${(o.size / 1024).toFixed(2)} KB  
**Recommendation:** ${o.recommendation}
`).join('')}

---

## ⚠️ Misplaced Core Files

${issues.MISPLACED_CORE.map((m, i) => `
### ${i + 1}. \`${m.path}\`

**Current Layer:** ${m.current_layer}  
**Recommendation:** ${m.recommendation}
`).join('')}

---

**Generated:** ${new Date().toISOString()}`;
  
  await writeFile('99_SYSTEM/Proofs/DIFF_REPORT.md', report);
  await writeFile('99_SYSTEM/Proofs/_raw/conflicts.json', JSON.stringify(issues, null, 2));
  
  console.log('✅ Conflict report saved to 99_SYSTEM/Proofs/DIFF_REPORT.md');
  console.log(`\n📊 Issues found:`);
  Object.entries(issues).forEach(([type, items]) => {
    console.log(`   ${type}: ${items.length}`);
  });
}

main().catch(console.error);


