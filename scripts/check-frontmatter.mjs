#!/usr/bin/env node

/**
 * Frontmatter Validation
 * Checks required keys in markdown files
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const REQUIRED_KEYS = ['title', 'version', 'phase', 'trihex_layer'];

async function checkFrontmatter(filepath) {
  try {
    const content = await fs.readFile(filepath, 'utf8');
    
    if (!content.startsWith('---')) {
      return { valid: false, reason: 'No frontmatter' };
    }
    
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      return { valid: false, reason: 'Invalid frontmatter' };
    }
    
    const frontmatter = match[1];
    const missing = REQUIRED_KEYS.filter(key => !frontmatter.includes(`${key}:`));
    
    if (missing.length > 0) {
      return { valid: false, reason: `Missing keys: ${missing.join(', ')}` };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, reason: error.message };
  }
}

async function walk(dir, acc = []) {
  try {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p, acc);
      else if (e.isFile() && p.endsWith('.md')) acc.push(p);
    }
  } catch {
    // Directory might not exist
  }
  return acc;
}

async function main() {
  const dirs = ['10_TriHexCore', '20_TriHex-Obsidian'];
  const files = [];
  
  for (const dir of dirs) {
    files.push(...await walk(dir));
  }
  
  console.log(`[frontmatter] Checking ${files.length} files...`);
  
  let validCount = 0;
  let invalidCount = 0;
  
  for (const file of files) {
    const result = await checkFrontmatter(file);
    if (result.valid) {
      validCount++;
    } else {
      invalidCount++;
      console.warn(`⚠️  ${file}: ${result.reason}`);
    }
  }
  
  console.log(`[frontmatter] Valid: ${validCount}, Invalid: ${invalidCount}`);
  
  if (invalidCount > 0) {
    console.error('[frontmatter] Some files have invalid frontmatter');
    process.exit(1);
  }
  
  console.log('[frontmatter] ✅ All files valid');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
