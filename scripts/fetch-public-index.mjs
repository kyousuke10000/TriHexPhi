#!/usr/bin/env node
/**
 * Fetch Public Mirror index.md and save to website/public/today.md
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_ENTRY_RAW =
  'https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md';
const OUTPUT_PATH = path.join(__dirname, '..', 'website', 'public', 'today.md');

async function fetchPublicIndex() {
  try {
    console.log(`📥 Fetching ${PUBLIC_ENTRY_RAW}...`);

    const response = await fetch(PUBLIC_ENTRY_RAW);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const content = await response.text();
    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await fs.writeFile(OUTPUT_PATH, content, 'utf8');

    console.log(`✅ Saved to ${OUTPUT_PATH}`);
    console.log(`📄 Content length: ${content.length} chars`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fetchPublicIndex();

