#!/usr/bin/env node

/**
 * Golden Test for UTF-8 + NFC Encoding
 * Usage: node scripts/test-encoding.mjs
 */

import fs from 'node:fs/promises';

const goldenFile = 'tests/encoding/golden.txt';

try {
  const s = await fs.readFile(goldenFile);
  const txt = s.toString('utf8').normalize('NFC');
  
  // Test 1: Contains Japanese characters
  if (!/叡智/.test(txt)) {
    console.error('[test-encoding] FAIL: Japanese characters not found');
    process.exit(1);
  }
  
  // Test 2: No CRLF
  if (txt.includes('\r')) {
    console.error('[test-encoding] FAIL: Contains CRLF (\\r)');
    process.exit(1);
  }
  
  // Test 3: Normalize works
  const nfd = txt.normalize('NFD');
  if (txt !== nfd.normalize('NFC')) {
    console.error('[test-encoding] FAIL: NFC normalization broken');
    process.exit(1);
  }
  
  console.log('[test-encoding] OK');
} catch (error) {
  console.error(`[test-encoding] ERROR: ${error.message}`);
  process.exit(1);
}
