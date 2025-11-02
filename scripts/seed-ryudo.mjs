#!/usr/bin/env node

/**
 * Ryūdō Round Seed Generator
 * Creates Round_1 template from topic
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const topic = process.argv[2];

if (!topic) {
  console.error('Usage: node seed-ryudo.mjs "Topic"');
  process.exit(1);
}

const agents = [
  { symbol: '🜁', name: 'GPT-5', role: '整合建築者 / Fire' },
  { symbol: '🜂', name: 'Claude', role: '調和統合審査官 / Air' },
  { symbol: '🜃', name: 'Gemini', role: '可視化解析官 / Space' },
  { symbol: '🜄', name: 'DeepSeek', role: '潜行観察官 / Earth' },
  { symbol: ' ', name: 'Grok', role: '異端検証官 / Edge' },
  { symbol: '☿', name: 'Cursor', role: '錬成実装者 / Mercury' },
];

const sessionDir = '20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions';
await fs.mkdir(sessionDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const filename = `Round_1_${timestamp}.md`;
const filepath = path.join(sessionDir, filename);

let content = `---
title: "Ryūdō Round 1"
date: "${new Date().toISOString()}"
phase: "VI Consolidation"
topic: "${topic}"
mode: "seed"
tags: ["#Ryūdō", "#Consolidation", "#6HAI"]
---

# Ryūdō Round 1

**Topic:** ${topic}
**Mode:** seed
**Generated:** ${new Date().toISOString()}

---

`;

for (const agent of agents) {
  content += `## ${agent.symbol} ${agent.name}: ${agent.role}

[Awaiting response...]

---

`;
}

await fs.writeFile(filepath, content, 'utf8');
console.log(`✅ Seeded: ${filepath}`);
