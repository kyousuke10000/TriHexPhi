#!/usr/bin/env node

/**
 * Apply normalization plan (execution)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'child_process';
import { existsSync } from 'node:fs';

async function main() {
  console.log('🚀 Applying normalization plan...');
  console.log('⚠️  This will MOVE and REMOVE files!');
  
  const plan = JSON.parse(
    await readFile('99_SYSTEM/Proofs/_raw/normalize_plan.json', 'utf-8')
  );
  
  const log = {
    started_at: new Date().toISOString(),
    operations: [],
    summary: {
      total: plan.operations.length,
      success: 0,
      failed: 0,
      skipped: 0
    }
  };
  
  for (const op of plan.operations) {
    console.log(`\n${op.type}: ${op.path}`);
    
    try {
      // Check if file exists
      if (!existsSync(op.path)) {
        console.log('  ⏭️  Skipped (not found)');
        log.operations.push({
          ...op,
          status: 'skipped',
          reason: 'file_not_found'
        });
        log.summary.skipped++;
        continue;
      }
      
      // Execute operation
      if (op.type === 'REMOVE') {
        execSync(`rm "${op.path}"`, { stdio: 'inherit' });
        console.log('  ✅ Removed');
        log.operations.push({
          ...op,
          status: 'success'
        });
        log.summary.success++;
      } else if (op.type === 'MOVE') {
        // Ensure target directory exists
        execSync(`mkdir -p "${op.target}"`, { stdio: 'pipe' });
        const filename = op.path.split('/').pop();
        execSync(`mv "${op.path}" "${op.target}/${filename}"`, { stdio: 'inherit' });
        console.log('  ✅ Moved');
        log.operations.push({
          ...op,
          status: 'success'
        });
        log.summary.success++;
      }
    } catch (err) {
      console.log(`  ❌ Failed: ${err.message}`);
      log.operations.push({
        ...op,
        status: 'failed',
        error: err.message
      });
      log.summary.failed++;
    }
  }
  
  log.ended_at = new Date().toISOString();
  
  // Save execution log
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await writeFile(
    `99_SYSTEM/Proofs/NORMALIZE_APPLIED_${timestamp}.md`,
    JSON.stringify(log, null, 2)
  );
  
  console.log('\n✅ Execution complete!');
  console.log(`\n📊 Results:`);
  console.log(`   Total: ${log.summary.total}`);
  console.log(`   Success: ${log.summary.success}`);
  console.log(`   Failed: ${log.summary.failed}`);
  console.log(`   Skipped: ${log.summary.skipped}`);
}

main().catch(console.error);


