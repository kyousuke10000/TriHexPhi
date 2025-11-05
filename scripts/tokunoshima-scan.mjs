#!/usr/bin/env node

/**
 * Tokunoshima AI Scan - Quick status generator
 * Purpose: Scan files and generate quick status report
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const toUtf8NFC = (s) => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

async function listFiles(dir, recursive = true) {
  const files = [];
  try {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory() && recursive && !p.includes('node_modules') && !p.includes('.git')) {
        files.push(...await listFiles(p, recursive));
      } else if (e.isFile() && p.endsWith('.md')) {
        files.push(p);
      }
    }
  } catch {}
  return files;
}

async function getFileInfo(file) {
  try {
    const stats = await fs.stat(file);
    const content = await fs.readFile(file, 'utf8').catch(() => '');
    return {
      path: file,
      size: stats.size,
      modified: stats.mtime,
      lines: content.split('\n').length,
      keywords: {
        tsukutsuku: content.toLowerCase().includes('ツクツク'),
        tokunoshima: content.toLowerCase().includes('徳之島'),
        mlm: content.toLowerCase().includes('mlm'),
        ai: content.includes('AI'),
        market: content.includes('マーケ')
      }
    };
  } catch {
    return null;
  }
}

async function main() {
  console.log('🔍 Scanning Tokunoshima/KYOEN AI files...');
  
  // Scan key directories
  const dirs = [
    '20_TriHex-Obsidian/04_HARMONIA_COUNCIL',
    '99_SYSTEM/Brands/KyoenAI',
    '99_SYSTEM/Proofs',
    'tools/kyoenAI'
  ];
  
  const allFiles = [];
  for (const dir of dirs) {
    allFiles.push(...await listFiles(dir, true));
  }
  
  // Get file info
  const fileInfos = [];
  for (const file of allFiles) {
    const info = await getFileInfo(file);
    if (info) fileInfos.push(info);
  }
  
  // Sort by modified time
  fileInfos.sort((a, b) => b.modified - a.modified);
  
  // Find relevant files
  const relevant = fileInfos.filter(f => 
    f.keywords.tsukutsuku || 
    f.keywords.tokunoshima || 
    f.keywords.mlm || 
    f.keywords.market
  );
  
  console.log(`\n📊 Found ${allFiles.length} total files`);
  console.log(`🎯 Found ${relevant.length} relevant files\n`);
  
  // Print relevant files
  for (const f of relevant.slice(0, 15)) {
    console.log(`${f.modified.toISOString().split('T')[0]} | ${f.path}`);
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});

