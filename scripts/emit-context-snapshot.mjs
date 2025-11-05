#!/usr/bin/env node

/**
 * Context Snapshot Generator
 * Purpose: One-page overview of current TriHex state
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const toUtf8NFC = (s) => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

async function readJson(file) {
  try {
    const content = await fs.readFile(file, 'utf8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function listFiles(dir, maxDepth = 2) {
  const files = [];
  try {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory() && maxDepth > 0) {
        files.push(...await listFiles(p, maxDepth - 1));
      } else if (e.isFile() && p.endsWith('.md')) {
        files.push(p);
      }
    }
  } catch {}
  return files;
}

async function main() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  
  // Read seed
  const seed = await readJson('99_SYSTEM/MemorySeeds/reactivation_seed.json');
  
  // Get recent proofs
  const proofsDir = '99_SYSTEM/Proofs';
  const allFiles = await listFiles(proofsDir, 1);
  const recentProofs = allFiles
    .filter(f => f.includes('.md'))
    .sort()
    .reverse()
    .slice(0, 5)
    .map(f => f.replace(/^.*Proofs\//, ''));
  
  // Build snapshot
  const snapshot = `---
title: "TriHex Context Snapshot"
date: "${now.toISOString()}"
generated: "auto"
phase: "${seed.phase || 'Unknown'}"
---

# TriHex Context Snapshot

**Date:** ${dateStr}  
**Phase:** ${seed.phase || 'Unknown'}  
**Generated:** Auto-snapshot

---

## 🎯 Quick Start

**Activation Command:**
> ${seed.quick_start_command || 'Memory Reactivation Protocol を読んで TriHex の文脈を再起動して'}

---

## 📁 Vault Architecture

${seed.vault_priority_map ? Object.entries(seed.vault_priority_map).map(([priority, desc]) => `**Priority ${priority}:** ${desc}`).join('\n\n') : 'No vault map available'}

---

## 🔗 Recent Reports

${recentProofs.map(p => `- \`${p}\``).join('\n')}

---

## ⚙️ System State

**Phase:** ${seed.phase || 'Unknown'}  
**Status:** Operational

---

## 📊 Active Layers

${seed.active_layers ? seed.active_layers.map(l => `- \`${l}\``).join('\n') : 'No active layers'}

---

**Generated:** ${now.toISOString()} / Auto-snapshot  
**Purpose:** One-page context restoration

---

*"One page. Complete overview."*
`;

  // Save snapshot
  const snapshotFile = `99_SYSTEM/Proofs/${dateStr}-Context_Snapshot.md`;
  await fs.writeFile(snapshotFile, toUtf8NFC(snapshot), 'utf8');
  
  console.log(`✅ Context snapshot: ${snapshotFile}`);
  console.log(`\n📄 Preview (first 20 lines):`);
  console.log('='.repeat(60));
  console.log(snapshot.split('\n').slice(0, 20).join('\n'));
  console.log('='.repeat(60));
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
