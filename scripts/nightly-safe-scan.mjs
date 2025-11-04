#!/usr/bin/env node

/**
 * Night Safe Auto — READ-ONLY scanner
 * 出力先: 99_SYSTEM/Proofs/NIGHTLY_*.md
 * 1) 外枠スナップショット（2階層）
 * 2) 未解決リンク検出 ([[Wiki]] / [text](path))
 * 3) スラッグ重複（同名.md）
 * 構造は一切変更しない。
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = process.cwd();
const PROOFS = path.join(ROOT, '99_SYSTEM/Proofs');
const DATE = new Date();
const ts = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})
  .format(DATE)
  .replace(/\//g, '-')
  .replace(' ', '_')
  .replace(':', '-');

const REPORT = path.join(PROOFS, `NIGHTLY_${ts}.md`);

const isMd = (f) => f.toLowerCase().endsWith('.md');

const walk = async (dir, depth = 0, maxDepth = 2, acc = []) => {
  if (depth > maxDepth) return acc;
  let ents;
  try {
    ents = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    acc.push({ depth, path: p, name: e.name, dir: e.isDirectory() });
    if (e.isDirectory()) await walk(p, depth + 1, maxDepth, acc);
  }
  return acc;
};

const rel = (p) => p.replace(ROOT + path.sep, '');

const readAllMd = async (dir) => {
  const files = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let ents = [];
    try {
      ents = await fs.readdir(d, { withFileTypes: true });
    } catch {}
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (isMd(e.name)) files.push(p);
    }
  }
  return files;
};

const ensureDir = async (d) => fs.mkdir(d, { recursive: true });

const extractLinks = (text) => {
  const wiki = [...text.matchAll(/\[\[([^\]]+?)\]\]/g)].map((m) => m[1]);
  const md = [...text.matchAll(/\[.*?\]\((?!http)([^)]+)\)/g)].map((m) => m[1]);
  return { wiki, md };
};

(async () => {
  await ensureDir(PROOFS);

  // 1) 外枠スナップショット（2階層）
  const skeleton = await walk(ROOT, 0, 1);
  const skeletonLines = skeleton
    .filter((x) => !x.path.includes('node_modules') && !x.path.includes('.git'))
    .map((x) => `${'  '.repeat(x.depth)}- ${x.dir ? '📁' : '📄'} ${rel(x.path)}`);

  // 2) 未解決リンク
  const mdFiles = await readAllMd(ROOT);
  const allNames = new Set(mdFiles.map((f) => path.basename(f)));
  const unresolved = [];
  for (const f of mdFiles) {
    let txt = '';
    try {
      txt = await fs.readFile(f, 'utf-8');
    } catch {}
    const { wiki, md } = extractLinks(txt);

    for (const w of wiki) {
      const candidate = w.endsWith('.md') ? w : `${w}.md`;
      if (!allNames.has(candidate)) {
        unresolved.push({ file: rel(f), type: 'wiki', target: w });
      }
    }

    for (const m of md) {
      const targetPath = path.resolve(path.dirname(f), m);
      try {
        await fs.access(targetPath);
      } catch {
        unresolved.push({ file: rel(f), type: 'path', target: m });
      }
    }
  }

  // 3) スラッグ重複
  const slugMap = new Map();
  for (const f of mdFiles) {
    const slug = path.basename(f).toLowerCase();
    if (!slugMap.has(slug)) slugMap.set(slug, []);
    slugMap.get(slug).push(rel(f));
  }
  const dups = [...slugMap.entries()]
    .filter(([, arr]) => arr.length > 1)
    .map(([slug, arr]) => ({ slug, files: arr }));

  // KPI
  const kpi = {
    files_indexed: mdFiles.length,
    unresolved_links: unresolved.length,
    duplicate_slugs: dups.length,
    snapshot_items: skeletonLines.length,
    generated_at_jst: ts,
  };

  // レポート本文
  const body = [
    `# 🌙 NIGHTLY SAFE AUTO — Proof Report`,
    ``,
    `**Generated (JST):** ${ts}`,
    ``,
    `## 📊 KPI`,
    `| metric | value |`,
    `|---|---:|`,
    ...Object.entries(kpi).map(([k, v]) => `| ${k} | ${v} |`),
    ``,
    `## 🧱 Outer Skeleton Snapshot (2 levels)`,
    '```',
    ...skeletonLines,
    '```',
    ``,
    `## 🚧 Unresolved Links (${unresolved.length})`,
    unresolved.length
      ? unresolved.map((u) => `- ${u.type.toUpperCase()} | ${u.file} → ${u.target}`).join('\n')
      : '_None_',
    ``,
    `## 🔁 Duplicate Slugs (${dups.length})`,
    dups.length
      ? dups.map((d) => `- **${d.slug}**\n  ${d.files.map((x) => `  - ${x}`).join('\n')}`).join('\n')
      : '_None_',
    ``,
    `---`,
    `_Mode: READ-ONLY • No files moved/renamed • Commit tagged with [skip ci]_`,
  ].join('\n');

  await fs.writeFile(REPORT, body, 'utf-8');
  console.log(`Report written: ${rel(REPORT)}`);
})();


