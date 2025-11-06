#!/usr/bin/env node

/**
 * Normalize Markdown Files to UTF-8 NFC
 * Usage: node scripts/normalize-md.mjs [dir1] [dir2] ...
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const toUtf8NFC = s => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

async function walk(dir, acc = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p, acc);
      else if (e.isFile() && p.endsWith(".md")) acc.push(p);
    }
  } catch (err) {
    if (err && err.code === "ENOENT") {
      console.warn(`[normalize-md] skip missing directory: ${dir}`);
      return acc;
    }
    throw err;
  }
  return acc;
}

const roots = process.argv.slice(2);

if (roots.length === 0) {
  console.error("Usage: node normalize-md.mjs [dir1] [dir2] ...");
  process.exit(1);
}

let totalFiles = 0;
let totalChanges = 0;

for (const r of roots) {
  try {
    const stat = await fs.stat(r);
    if (!stat.isDirectory()) {
      console.warn(`[normalize-md] ${r} is not a directory, skipping`);
      continue;
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`[normalize-md] root missing, skipping: ${r}`);
      continue;
    }
    throw err;
  }
  
  for (const file of await walk(r)) {
    totalFiles++;
    const before = await fs.readFile(file, "utf8");
    const after = toUtf8NFC(before);
    if (after !== before) {
      await fs.writeFile(file, after, "utf8");
      totalChanges++;
      console.log(`[normalize] ${file}`);
    }
  }
}

console.log(`\n[normalize-md] complete: ${totalChanges}/${totalFiles} files updated`);
