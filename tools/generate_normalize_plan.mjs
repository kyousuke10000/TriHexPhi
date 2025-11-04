#!/usr/bin/env node

/**
 * Generate normalization plan (dry-run proposals)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { basename, dirname } from 'node:path';

async function main() {
  console.log('📋 Generating normalization plan...');
  
  const conflicts = JSON.parse(
    await readFile('99_SYSTEM/Proofs/_raw/conflicts.json', 'utf-8')
  );
  
  const inventory = JSON.parse(
    await readFile('99_SYSTEM/Proofs/_raw/trihex_inventory.json', 'utf-8')
  );
  
  const plan = {
    operations: [],
    summary: {}
  };
  
  // 1. Remove duplicate files (keep canonical)
  conflicts.DUPLICATE_FILE.slice(0, 10).forEach(dupe => {
    // Keep first path, remove others
    const canonical = dupe.paths[0];
    const toRemove = dupe.paths.slice(1);
    
    toRemove.forEach(path => {
      plan.operations.push({
        type: 'REMOVE',
        action: 'Delete duplicate file',
        path,
        canonical,
        command: `rm "${path}" # Keeping canonical: ${canonical}`
      });
    });
  });
  
  // 2. Move orphaned files to appropriate vault
  conflicts.ORPHANED_DIR.slice(0, 20).forEach(orphan => {
    const filename = basename(orphan.path);
    const targetLayer = inferTargetLayer(filename, orphan.path);
    
    if (targetLayer) {
      plan.operations.push({
        type: 'MOVE',
        action: `Move orphaned file to ${targetLayer}`,
        path: orphan.path,
        target: targetLayer,
        command: `mv "${orphan.path}" "${targetLayer}/${filename}"`
      });
    }
  });
  
  // 3. Fix misplaced core files
  conflicts.MISPLACED_CORE.slice(0, 20).forEach(misplaced => {
    const filename = basename(misplaced.path);
    const target = misplaced.path.includes('Master_Reactivation') 
      ? '99_SYSTEM'
      : '10_TriHexCore/00_CORE';
    
    plan.operations.push({
      type: 'MOVE',
      action: `Move core file to ${target}`,
      path: misplaced.path,
      target,
      command: `mv "${misplaced.path}" "${target}/${filename}"`
    });
  });
  
  // Generate summary
  plan.summary = {
    total_operations: plan.operations.length,
    by_type: {
      REMOVE: plan.operations.filter(o => o.type === 'REMOVE').length,
      MOVE: plan.operations.filter(o => o.type === 'MOVE').length
    }
  };
  
  // Save plan
  await writeFile('99_SYSTEM/Proofs/_raw/normalize_plan.json', JSON.stringify(plan, null, 2));
  
  // Generate markdown
  const report = `# TriHex Normalization Plan (Dry-Run)

**Generated:** ${new Date().toISOString()}  
**Status:** 🔄 **PROPOSAL - Not Executed**

---

## ⚠️ IMPORTANT

**This is a DRY-RUN plan. No files will be moved or deleted until approved.**

Review each operation carefully before execution.

---

## 📊 Summary

| Metric | Count |
|--------|-------|
| **Total Operations** | ${plan.summary.total_operations} |
| **Removals** | ${plan.summary.by_type.REMOVE} |
| **Moves** | ${plan.summary.by_type.MOVE} |

---

## 📋 Proposed Operations

${plan.operations.slice(0, 50).map((op, i) => `
### ${i + 1}. ${op.action}

**Operation:** \`${op.type}\`  
**Path:** \`${op.path}\`${op.target ? `  
**Target:** \`${op.target}\`` : ''}

**Command:**
\`\`\`bash
${op.command}
\`\`\`
`).join('')}

---

## 🎯 Execution Instructions

To apply this plan:

1. **Review** all operations above
2. **Approve** by running: \`node tools/apply_normalize.mjs\`
3. **Verify** with: \`node tools/inventory_scan.mjs\`

**Caution:** Backup recommended before execution.

---

**Generated:** ${new Date().toISOString()}`;
  
  await writeFile('99_SYSTEM/Proofs/NORMALIZE_PLAN.md', report);
  
  console.log('✅ Normalization plan saved to 99_SYSTEM/Proofs/NORMALIZE_PLAN.md');
  console.log(`\n📊 Operations: ${plan.summary.total_operations} (${plan.summary.by_type.REMOVE} removals, ${plan.summary.by_type.MOVE} moves)`);
}

function inferTargetLayer(filename, path) {
  if (filename.includes('Proof') || filename.includes('KYOEN')) {
    return '99_SYSTEM/Proofs';
  }
  if (filename.includes('Genesis') || filename.includes('TRIHEXPHI') || filename.includes('Ryudo')) {
    return '10_TriHexCore';
  }
  if (filename.includes('Harmonia') || filename.includes('Round')) {
    return '00_HarmoniaCouncil';
  }
  if (filename.endsWith('.md') && path.includes('Obsidian')) {
    return '20_TriHex-Obsidian';
  }
  return null;
}

main().catch(console.error);


