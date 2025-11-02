#!/usr/bin/env node

/**
 * MIZUKAGAMI Ingest CLI
 * Creates session markdown from template
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const [,, ai, date, nnn] = process.argv;

if (!ai || !date || !nnn) {
  console.error('Usage: ingest-cli.mjs <AI> <YYYY-MM-DD> <NNN>');
  process.exit(1);
}

const dir = `10_CAPTURE_MIZUKAGAMI/${ai}`;
const out = path.join(dir, `${date}_${ai}_Session_${nnn}.md`);
const tplPath = '10_CAPTURE_MIZUKAGAMI/_templates/SESSION_TEMPLATE.md';

try {
  const tpl = await fs.readFile(tplPath, 'utf8');
  const md = tpl
    .replaceAll('{{AI}}', ai)
    .replaceAll('{{DATE}}', date)
    .replaceAll('{{NNN}}', nnn)
    .replace('{{USER_TEXT}}', '')
    .replace('{{AI_TEXT}}', '');
  
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(out, md, 'utf8');
  console.log('✅ Wrote:', out);
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}

