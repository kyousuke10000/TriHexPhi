#!/usr/bin/env node

/**
 * Mirror Codex Sync
 * Syncs between Core/Obsidian/Sync layers
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const MIRROR_PAIRS = [
  { core: '10_TriHexCore/codex/Genesis_Protocol_v3.1.md', obsidian: '20_TriHex-Obsidian/01_Codex/Genesis_Protocol_v3.1.md' },
  // Add more pairs as needed
];

const toUtf8NFC = s => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

async function syncFile(pair) {
  try {
    const coreExists = await fs.access(pair.core).then(() => true).catch(() => false);
    const obsidianExists = await fs.access(pair.obsidian).then(() => true).catch(() => false);
    
    if (!coreExists && !obsidianExists) {
      return { synced: false, reason: 'Both missing' };
    }
    
    if (!coreExists && obsidianExists) {
      // Copy from obsidian to core
      const content = await fs.readFile(pair.obsidian, 'utf8');
      const normalized = toUtf8NFC(content);
      await fs.mkdir(path.dirname(pair.core), { recursive: true });
      await fs.writeFile(pair.core, normalized, 'utf8');
      return { synced: true, direction: 'obsidian→core' };
    }
    
    if (coreExists && !obsidianExists) {
      // Copy from core to obsidian
      const content = await fs.readFile(pair.core, 'utf8');
      const normalized = toUtf8NFC(content);
      await fs.mkdir(path.dirname(pair.obsidian), { recursive: true });
      await fs.writeFile(pair.obsidian, normalized, 'utf8');
      return { synced: true, direction: 'core→obsidian' };
    }
    
    // Both exist - check for differences
    const coreContent = toUtf8NFC(await fs.readFile(pair.core, 'utf8'));
    const obsidianContent = toUtf8NFC(await fs.readFile(pair.obsidian, 'utf8'));
    
    if (coreContent === obsidianContent) {
      return { synced: true, direction: 'already in sync' };
    }
    
    // Use core as source of truth
    await fs.writeFile(pair.obsidian, coreContent, 'utf8');
    return { synced: true, direction: 'core→obsidian (updated)' };
  } catch (error) {
    return { synced: false, reason: error.message };
  }
}

async function main() {
  console.log('[mirror-codex] Starting sync...');
  
  let synced = 0;
  let failed = 0;
  
  for (const pair of MIRROR_PAIRS) {
    const result = await syncFile(pair);
    if (result.synced) {
      synced++;
      console.log(`✅ ${path.basename(pair.core)}: ${result.direction}`);
    } else {
      failed++;
      console.warn(`⚠️  ${path.basename(pair.core)}: ${result.reason}`);
    }
  }
  
  console.log(`[mirror-codex] Synced: ${synced}, Failed: ${failed}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
