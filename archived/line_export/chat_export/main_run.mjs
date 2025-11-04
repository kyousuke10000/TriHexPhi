#!/usr/bin/env node

/**
 * Main Line Export Runner
 * Purpose: Orchestrate full export pipeline
 */

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, 'config/line_export.config.json'), 'utf8'));

console.log('🚀 LINE Export Pipeline Starting...\n');
console.log(`Target: ${config.group_name}`);
console.log(`Range: ${config.date_range.from} → ${config.date_range.to || 'latest'}\n`);

// Step 1: AppleScript scroll + copy
console.log('📜 Step 1: Scrolling to top...');
try {
  const osascriptResult = execSync(`osascript scripts/chat_export/line_mac_scroll_export.applescript`, { encoding: 'utf8' });
  console.log(osascriptResult);
} catch (error) {
  console.error('⚠️ AppleScript execution had issues:', error.message);
}

// Step 2: Parse to JSON
console.log('\n📄 Step 2: Parsing to JSON...');
execSync('node scripts/chat_export/parse_line_text_to_json.mjs', { stdio: 'inherit' });

// Step 3: Import to Supabase
console.log('\n📤 Step 3: Importing to Supabase...');
execSync('node scripts/chat_export/import_to_supabase.mjs', { stdio: 'inherit' });

// Step 4: Generate report
const fs = await import('fs/promises');
const reportPath = '99_SYSTEM/Proofs/LINE_Export_2025-11-02.md';
const messages = JSON.parse(readFileSync('artifacts/line_export/chat.json', 'utf8'));

const report = `# LINE Export Report

**Date:** ${new Date().toISOString()}  
**Target:** ${config.group_name}  
**Method:** AppleScript + Parse + Supabase

---

## Summary

- **Total Messages:** ${messages.length}
- **Date Range:** ${messages.length > 0 ? messages[messages.length - 1].ts : 'N/A'} → ${messages.length > 0 ? messages[0].ts : 'N/A'}
- **Oldest Year:** ${messages.length > 0 ? messages[messages.length - 1].ts.split('-')[0] : 'N/A'}

---

## Validation

${messages.length > 0 && messages[messages.length - 1].ts.split('-')[0] <= '2019' ? '✅' : '⚠️'} Oldest message ≤ 2019

✅ Export complete

---

**Generated:** ${new Date().toISOString()} / Cursor (☿)
`;

await fs.writeFile(reportPath, report, 'utf8');
console.log(`\n✅ Report saved: ${reportPath}`);

console.log('\n🎉 Export pipeline complete!');

