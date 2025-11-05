#!/usr/bin/env node
/**
 * Generate public index.md for TriHexPhi-public mirror
 * This creates a landing page with latest Proofs and Council links
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const sh = (cmd, opts = {}) => {
  try {
    const out = execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'], ...opts });
    return out.toString().trim();
  } catch (e) {
    const msg = e.stderr?.toString() || e.message;
    throw new Error(`CMD FAIL: ${cmd}\n${msg}`);
  }
};

const PUB_REPO = 'kyousuke10000/TriHexPhi-public';
const PUB_BRANCH = 'main';

async function getLatestProofs(count = 10) {
  try {
    // Get all Proof files, sorted by modification time (newest first)
    const files = sh(
      `git ls-tree -r --name-only HEAD | grep '^99_SYSTEM/Proofs/.*\\.md$' | grep -vE '/(Meta|Overdrive)/'`
    ).split('\n').filter(Boolean);

    if (files.length === 0) return [];

    // Get commit timestamps for each file
    const filesWithTime = files.map(file => {
      try {
        const timestamp = sh(
          `git log -1 --format='%ct' -- '${file}' 2>/dev/null || echo 0`
        );
        return { file, time: parseInt(timestamp) || 0 };
      } catch {
        return { file, time: 0 };
      }
    });

    // Sort by time (newest first) and take top N
    return filesWithTime
      .sort((a, b) => b.time - a.time)
      .slice(0, count)
      .map(({ file }) => file);
  } catch (error) {
    console.error('Error getting latest proofs:', error.message);
    return [];
  }
}

async function getLatestMetaProofs(count = 10) {
  try {
    const files = sh(
      `git ls-tree -r --name-only HEAD | grep '^99_SYSTEM/Proofs/Meta/.*\\.md$'`
    ).split('\n').filter(Boolean);

    if (files.length === 0) return [];

    const filesWithTime = files.map(file => {
      try {
        const timestamp = sh(
          `git log -1 --format='%ct' -- '${file}' 2>/dev/null || echo 0`
        );
        return { file, time: parseInt(timestamp) || 0 };
      } catch {
        return { file, time: 0 };
      }
    });

    return filesWithTime
      .sort((a, b) => b.time - a.time)
      .slice(0, count)
      .map(({ file }) => file);
  } catch (error) {
    console.error('Error getting latest Meta proofs:', error.message);
    return [];
  }
}

async function getLatestOverdriveProofs(count = 10) {
  try {
    const files = sh(
      `git ls-tree -r --name-only HEAD | grep '^99_SYSTEM/Proofs/Overdrive/.*\\.md$'`
    ).split('\n').filter(Boolean);

    if (files.length === 0) return [];

    const filesWithTime = files.map(file => {
      try {
        const timestamp = sh(
          `git log -1 --format='%ct' -- '${file}' 2>/dev/null || echo 0`
        );
        return { file, time: parseInt(timestamp) || 0 };
      } catch {
        return { file, time: 0 };
      }
    });

    return filesWithTime
      .sort((a, b) => b.time - a.time)
      .slice(0, count)
      .map(({ file }) => file);
  } catch (error) {
    console.error('Error getting latest Overdrive proofs:', error.message);
    return [];
  }
}

async function generateIndex() {
  const now = new Date();
  const nowStr = now.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });

  const latestProofs = await getLatestProofs(10);
  const latestMetaProofs = await getLatestMetaProofs(10);
  const latestOverdriveProofs = await getLatestOverdriveProofs(10);

  const indexContent = `# TriHexΦ Public Mirror — 今日の入口

最終更新: ${nowStr}

## 最新 Proofs (Top 10)

${latestProofs.length > 0
    ? latestProofs
        .map(
          (f) =>
            `- [${path.basename(f)}](https://github.com/${PUB_REPO}/blob/${PUB_BRANCH}/${f})`
        )
        .join('\n')
    : '- (Proofs not found)'}

## Meta Proofs (Top 10)

${latestMetaProofs.length > 0
    ? latestMetaProofs
        .map(
          (f) =>
            `- [${path.basename(f)}](https://github.com/${PUB_REPO}/blob/${PUB_BRANCH}/${f})`
        )
        .join('\n')
    : '- (Meta Proofs not found)'}

## Overdrive Proofs (Top 10)

${latestOverdriveProofs.length > 0
    ? latestOverdriveProofs
        .map(
          (f) =>
            `- [${path.basename(f)}](https://github.com/${PUB_REPO}/blob/${PUB_BRANCH}/${f})`
        )
        .join('\n')
    : '- (Overdrive Proofs not found)'}

## Council

- Records: https://github.com/${PUB_REPO}/tree/${PUB_BRANCH}/00_RYUDO/Council/Records
- Decisions: https://github.com/${PUB_REPO}/tree/${PUB_BRANCH}/00_RYUDO/Council/Decisions

## How to use (for Web AIs)

- このページの **Raw** を貼ると最新状況を常に参照できます:
  https://raw.githubusercontent.com/${PUB_REPO}/${PUB_BRANCH}/index.md

## 固定入口URL（共有用）

- **入口（Start Here）**: https://github.com/${PUB_REPO}
- **Proofs 一覧**: https://github.com/${PUB_REPO}/tree/${PUB_BRANCH}/99_SYSTEM/Proofs
- **Council Records**: https://github.com/${PUB_REPO}/tree/${PUB_BRANCH}/00_RYUDO/Council/Records
- **Council Decisions**: https://github.com/${PUB_REPO}/tree/${PUB_BRANCH}/00_RYUDO/Council/Decisions
`;

  return indexContent;
}

async function main() {
  try {
    console.log('📝 Generating public index.md...');
    const content = await generateIndex();
    
    const outputPath = process.argv[2] || 'index.md';
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log(`✅ Generated: ${outputPath}`);
    console.log(`📌 Public URL: https://github.com/${PUB_REPO}/blob/${PUB_BRANCH}/index.md`);
    console.log(`📌 Raw URL: https://raw.githubusercontent.com/${PUB_REPO}/${PUB_BRANCH}/index.md`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

