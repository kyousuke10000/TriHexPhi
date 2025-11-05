#!/usr/bin/env node

/**
 * Obsidian Link Indexer
 * Extract Wiki links, Markdown links, Embeds, frontmatter, and backlinks
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { createHash } from 'crypto';

const OBSIDIAN_PATHS = [
  '20_TriHex-Obsidian',
  '🜇_Shiryu_Studio',
  '00_HarmoniaCouncil',
  '10_TriHexCore'
];

const LINKS = {
  wikiLinks: [],
  markdownLinks: [],
  embeds: [],
  frontmatter: [],
  backlinks: new Map(),
  unresolved: new Set(),
  duplicateSlugs: new Map(),
  orphanNotes: new Set()
};

async function processFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const slug = basename(filePath, '.md');
  
  // Extract Wiki links [[...]]
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
  let match;
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const link = match[1];
    LINKS.wikiLinks.push({ source: filePath, target: link });
    
    // Track backlink
    if (!LINKS.backlinks.has(link)) {
      LINKS.backlinks.set(link, []);
    }
    LINKS.backlinks.get(link).push(filePath);
  }
  
  // Extract Embeds ![[...]]
  const embedRegex = /!\[\[([^\]]+)\]\]/g;
  while ((match = embedRegex.exec(content)) !== null) {
    const link = match[1];
    LINKS.embeds.push({ source: filePath, target: link });
  }
  
  // Extract Markdown links [text](url)
  const mdLinkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    LINKS.markdownLinks.push({
      source: filePath,
      text: match[1],
      url: match[2]
    });
  }
  
  // Extract frontmatter
  const fmRegex = /^---\s*\n([\s\S]*?)\n---/;
  const fmMatch = content.match(fmRegex);
  if (fmMatch) {
    const fmText = fmMatch[1];
    const fm = {};
    for (const line of fmText.split('\n')) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.substring(0, colonIdx).trim();
        const value = line.substring(colonIdx + 1).trim();
        fm[key] = value;
      }
    }
    LINKS.frontmatter.push({ file: filePath, ...fm });
  }
  
  // Track duplicate slugs
  if (!LINKS.duplicateSlugs.has(slug)) {
    LINKS.duplicateSlugs.set(slug, []);
  }
  LINKS.duplicateSlugs.get(slug).push(filePath);
}

async function scanDirectory(dir) {
  try {
    const entries = await readdir(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.endsWith('.md')) {
        await processFile(fullPath);
      }
    }
  } catch (err) {
    // Skip errors
  }
}

async function main() {
  console.log('🔍 Indexing Obsidian links...');
  
  for (const path of OBSIDIAN_PATHS) {
    await scanDirectory(path);
  }
  
  // Detect unresolved links
  const allFiles = new Set();
  for (const item of LINKS.frontmatter) {
    allFiles.add(basename(item.file, '.md'));
  }
  
  for (const link of LINKS.wikiLinks) {
    const target = link.target.split('|')[0].split('#')[0];
    if (!allFiles.has(target)) {
      LINKS.unresolved.add(target);
    }
  }
  
  // Detect orphan notes (no in or out links)
  for (const item of LINKS.frontmatter) {
    const slug = basename(item.file, '.md');
    const hasOutLinks = LINKS.wikiLinks.some(l => l.source === item.file);
    const hasInLinks = LINKS.backlinks.has(slug);
    
    if (!hasOutLinks && !hasInLinks) {
      LINKS.orphanNotes.add(item.file);
    }
  }
  
  // Write reports
  await writeReports();
  
  console.log('✅ Obsidian index complete!');
}

async function writeReports() {
  const fs = await import('node:fs/promises');
  
  // Graph Summary
  let summary = `# Obsidian Graph Summary\n\n**Generated:** ${new Date().toISOString()}\n\n`;
  summary += `## 📊 Statistics\n\n`;
  summary += `| Metric | Count |\n`;
  summary += `|--------|-------|\n`;
  summary += `| **Total Files** | ${LINKS.frontmatter.length} |\n`;
  summary += `| **Wiki Links** | ${LINKS.wikiLinks.length} |\n`;
  summary += `| **Markdown Links** | ${LINKS.markdownLinks.length} |\n`;
  summary += `| **Embeds** | ${LINKS.embeds.length} |\n`;
  summary += `| **Unresolved Links** | ${LINKS.unresolved.size} |\n`;
  summary += `| **Duplicate Slugs** | ${Array.from(LINKS.duplicateSlugs.values()).filter(v => v.length > 1).length} |\n`;
  summary += `| **Orphan Notes** | ${LINKS.orphanNotes.size} |\n\n`;
  
  summary += `## 🔗 Top 20 Most Linked Files\n\n`;
  const topLinked = Array.from(LINKS.backlinks.entries())
    .map(([slug, files]) => ({ slug, count: files.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  for (const item of topLinked) {
    summary += `- \`${item.slug}\`: ${item.count} backlinks\n`;
  }
  
  await fs.writeFile('99_SYSTEM/Proofs/OBSIDIAN_GRAPH_SUMMARY.md', summary);
  
  // Unresolved Links
  let unresolved = `# Unresolved Links\n\n**Generated:** ${new Date().toISOString()}\n\n`;
  unresolved += `## ⚠️ Links Not Found (${LINKS.unresolved.size} total)\n\n`;
  for (const link of Array.from(LINKS.unresolved).sort()) {
    unresolved += `- \`${link}\`\n`;
  }
  await fs.writeFile('99_SYSTEM/Proofs/UNRESOLVED_LINKS.md', unresolved);
  
  // Duplicate Slugs
  let duplicates = `# Duplicate Slugs\n\n**Generated:** ${new Date().toISOString()}\n\n`;
  duplicates += `## 🔄 Files with Same Name (Potential Conflicts)\n\n`;
  for (const [slug, files] of LINKS.duplicateSlugs.entries()) {
    if (files.length > 1) {
      duplicates += `### ${slug} (${files.length} copies)\n\n`;
      for (const file of files) {
        duplicates += `- \`${file}\`\n`;
      }
      duplicates += '\n';
    }
  }
  await fs.writeFile('99_SYSTEM/Proofs/DUPLICATE_SLUGS.md', duplicates);
  
  // Orphan Notes
  let orphans = `# Orphan Notes\n\n**Generated:** ${new Date().toISOString()}\n\n`;
  orphans += `## 🏝️ Isolated Files (${LINKS.orphanNotes.size} total)\n\n`;
  for (const file of Array.from(LINKS.orphanNotes).sort()) {
    orphans += `- \`${file}\`\n`;
  }
  await fs.writeFile('99_SYSTEM/Proofs/ORPHAN_NOTES.md', orphans);
}

main().catch(console.error);


