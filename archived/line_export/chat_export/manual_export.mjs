#!/usr/bin/env node

/**
 * Manual Export Helper
 * Purpose: Guide manual copy-paste workflow
 */

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

console.log('✅ Clipboard captured!');

async function main() {
  // Save clipboard to file
  const clipboard = execSync('pbpaste', { encoding: 'utf8' });
  await mkdir('artifacts/line_export', { recursive: true });
  await writeFile('artifacts/line_export/chat_raw.txt', clipboard, 'utf8');
  
  console.log('📄 Saved to artifacts/line_export/chat_raw.txt');
  console.log('📊 Proceeding to parse...\n');
  
  // Continue with parse + import
  execSync('node scripts/chat_export/parse_line_text_to_json.mjs', { stdio: 'inherit' });
  execSync('node scripts/chat_export/import_to_supabase.mjs', { stdio: 'inherit' });
  
  console.log('\n✅ Manual export complete!');
}

main().catch(console.error);

