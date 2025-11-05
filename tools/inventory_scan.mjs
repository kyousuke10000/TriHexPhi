#!/usr/bin/env node

/**
 * TriHex Full Inventory Scanner
 * Phase 1: Dry-Run mode
 */

import { readdir, stat, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname, basename, extname } from 'node:path';
import { writeFile } from 'node:fs/promises';

const HOST = {
  os: 'Darwin',
  hostname: 'ShiryunoiMac.local',
  user: 'shiryu',
  disks: [{
    mount: '/',
    fs: '/dev/disk3s1s1',
    size: '228Gi',
    used: '11Gi'
  }]
};

const SCAN_CONFIG = {
  roots: [
    process.env.HOME,
    join(process.env.HOME, 'Dev'),
    join(process.env.HOME, 'Documents'),
    join(process.env.HOME, 'Desktop'),
    '/Users/shiryu/【Shii】/Active/TriHexΦ'
  ],
  excluded: [
    '.git', 'node_modules', '.venv', '__pycache__', '.DS_Store',
    'Library', 'Caches', 'Trash', '.vscode', '.cursor'
  ]
};

const EXCLUDE_PATTERNS = [
  /^\./,
  /Library/,
  /Caches/,
  /Trash/,
  /node_modules/,
  /\.git/,
  /\.venv/,
  /__pycache__/
];

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
let stats = {
  files_total: 0,
  dirs_total: 0,
  by_ext: {},
  duplicates: {},
  oversized: 0,
  errors: 0
};

const tree = [];

// Hash for deduplication
async function computeHash(filePath) {
  try {
    const data = await readFile(filePath);
    return createHash('sha1').update(data).digest('hex');
  } catch (err) {
    return null;
  }
}

// Parse frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon > 0) {
      const key = line.substring(0, colon).trim();
      const value = line.substring(colon + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

// Recursive scan
async function scanDir(root, relPath = '') {
  const fullPath = join(root, relPath);
  
  try {
    const entries = await readdir(fullPath);
    
    for (const entry of entries) {
      // Skip excluded
      if (EXCLUDE_PATTERNS.some(pattern => pattern.test(entry))) {
        continue;
      }
      
      const entryPath = join(fullPath, entry);
      const relEntryPath = join(relPath, entry);
      
      try {
        const fileStat = await stat(entryPath);
        
        if (fileStat.isDirectory()) {
          stats.dirs_total++;
          tree.push({
            path: relEntryPath,
            type: 'dir',
            size_bytes: 0,
            mtime: fileStat.mtime.toISOString()
          });
          
          await scanDir(root, relEntryPath);
        } else if (fileStat.isFile()) {
          stats.files_total++;
          const ext = extname(entry);
          stats.by_ext[ext] = (stats.by_ext[ext] || 0) + 1;
          
          if (fileStat.size > MAX_FILE_SIZE) {
            stats.oversized++;
            tree.push({
              path: relEntryPath,
              type: 'file',
              size_bytes: fileStat.size,
              ext: ext,
              mtime: fileStat.mtime.toISOString(),
              oversized: true
            });
          } else {
            const hash = await computeHash(entryPath);
            const item = {
              path: relEntryPath,
              type: 'file',
              size_bytes: fileStat.size,
              ext: ext,
              mtime: fileStat.mtime.toISOString(),
              sha1: hash
            };
            
            // Track duplicates
            if (hash) {
              if (!stats.duplicates[hash]) {
                stats.duplicates[hash] = [];
              }
              stats.duplicates[hash].push(relEntryPath);
            }
            
            // Parse markdown frontmatter
            if (ext === '.md') {
              try {
                const content = await readFile(entryPath, 'utf-8');
                const fm = parseFrontmatter(content);
                if (fm) {
                  item.frontmatter = fm;
                }
              } catch (err) {
                // Ignore read errors
              }
            }
            
            tree.push(item);
          }
        }
      } catch (err) {
        stats.errors++;
      }
    }
  } catch (err) {
    stats.errors++;
  }
}

// Main
async function main() {
  console.log('🔍 TriHex Full Inventory Scanner - Dry-Run Mode');
  console.log('='.repeat(60));
  
  const scan = {
    started_at: new Date().toISOString()
  };
  
  // Scan each root
  for (const root of SCAN_CONFIG.roots) {
    console.log(`\n📁 Scanning: ${root}`);
    await scanDir(root);
  }
  
  scan.ended_at = new Date().toISOString();
  scan.roots = SCAN_CONFIG.roots;
  scan.excluded = SCAN_CONFIG.excluded;
  
  // Build inventory JSON
  const inventory = {
    host: HOST,
    scan,
    tree,
    stats: {
      files_total: stats.files_total,
      dirs_total: stats.dirs_total,
      by_ext: Object.entries(stats.by_ext).map(([ext, count]) => ({
        ext, count
      })),
      duplicates: Object.entries(stats.duplicates)
        .filter(([hash, paths]) => paths.length > 1)
        .map(([hash, paths]) => ({
          sha1: hash,
          paths
        })),
      oversized: stats.oversized,
      errors: stats.errors
    }
  };
  
  // Save raw inventory
  await writeFile(
    '99_SYSTEM/Proofs/_raw/trihex_inventory.json',
    JSON.stringify(inventory, null, 2)
  );
  
  console.log('\n✅ Inventory saved to 99_SYSTEM/Proofs/_raw/trihex_inventory.json');
  console.log('\n📊 Summary:');
  console.log(`   Files: ${stats.files_total}`);
  console.log(`   Dirs: ${stats.dirs_total}`);
  console.log(`   Duplicates: ${Object.values(stats.duplicates).filter(p => p.length > 1).length}`);
  console.log(`   Errors: ${stats.errors}`);
}

main().catch(console.error);


