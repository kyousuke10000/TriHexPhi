#!/usr/bin/env node
/**
 * Generate trihex_manifest.json with file list and sizes
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);

async function generateManifest() {
  const ROOT = process.cwd();
  
  // Get all git-tracked files
  const { stdout } = await execAsync('git ls-files');
  const files = stdout.trim().split('\n').filter(Boolean);
  
  // Get file sizes
  const manifest = await Promise.all(
    files.map(async (file) => {
      try {
        const stats = await fs.stat(file);
        return {
          path: file,
          size: stats.size
        };
      } catch {
        return {
          path: file,
          size: 0
        };
      }
    })
  );
  
  // Sort by path
  manifest.sort((a, b) => a.path.localeCompare(b.path));
  
  // Write to file
  await fs.writeFile(
    'trihex_manifest.json',
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
  
  console.log(`✅ Manifest generated: ${manifest.length} files`);
}

generateManifest().catch(console.error);

