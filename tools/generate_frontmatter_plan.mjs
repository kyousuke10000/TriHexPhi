#!/usr/bin/env node

/**
 * Frontmatter Patch Plan Generator
 * Propose trihex_layer / trihex_module additions
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const VAULT_PATHS = [
  { path: '20_TriHex-Obsidian', layer: 'obsidian' },
  { path: '🜇_Shiryu_Studio', layer: 'shiryu' },
  { path: '00_HarmoniaCouncil', layer: 'obsidian' },
  { path: '10_TriHexCore', layer: 'obsidian' }
];

const proposals = [];

const LAYER_RULES = {
  mizukagami: {
    keywords: ['体験', '語り', 'トーン', '日誌', '問い', 'story', 'experience', 'tone', 'question'],
    layer: 'mizukagami'
  },
  obsidian: {
    keywords: ['設計', '仕様', 'ADR', 'モデル', 'Runbook', 'design', 'spec', 'model', 'architect'],
    layer: 'obsidian'
  },
  shinsen_phi: {
    keywords: ['DB', 'スキーマ', 'メモリ', 'API', 'ETL', 'schema', 'database', 'memory', 'api'],
    layer: 'shinsen_phi'
  },
  ryudo: {
    keywords: ['n8n', 'CI-CD', '監査', 'Proofs', 'workflow', 'audit', 'proof'],
    layer: 'ryudo'
  }
};

const MODULE_KEYWORDS = {
  'kyoen-ai': ['kyoen', 'tokunoshima', 'line', 'bot', 'zerofriction', 'rsvp'],
  'harmonia-cloud': ['harmonia', 'council', 'round', 'ai_council'],
  'trihex-core': ['trihex', 'constitution', 'protocol', 'genesis', 'ryudo']
};

async function analyzeFile(filePath, vaultLayer) {
  const content = await readFile(filePath, 'utf-8');
  const slug = basename(filePath, '.md');
  
  // Check existing frontmatter
  const fmRegex = /^---\s*\n([\s\S]*?)\n---/;
  const fmMatch = content.match(fmRegex);
  
  const currentFM = fmMatch ? parseFrontmatter(fmMatch[1]) : {};
  const proposedFM = { ...currentFM };
  
  // Determine trihex_layer
  let detectedLayer = vaultLayer;
  for (const [key, rule] of Object.entries(LAYER_RULES)) {
    if (rule.keywords.some(kw => content.toLowerCase().includes(kw.toLowerCase()) || slug.toLowerCase().includes(kw.toLowerCase()))) {
      detectedLayer = rule.layer;
      break;
    }
  }
  
  if (!currentFM.trihex_layer && detectedLayer) {
    proposedFM.trihex_layer = detectedLayer;
  }
  
  // Determine trihex_module
  let detectedModule = null;
  for (const [module, keywords] of Object.entries(MODULE_KEYWORDS)) {
    if (keywords.some(kw => content.toLowerCase().includes(kw.toLowerCase()) || slug.toLowerCase().includes(kw.toLowerCase()))) {
      detectedModule = module;
      break;
    }
  }
  
  if (!currentFM.trihex_module && detectedModule) {
    proposedFM.trihex_module = detectedModule;
  }
  
  // Compare
  const hasChanges = JSON.stringify(currentFM) !== JSON.stringify(proposedFM);
  
  if (hasChanges) {
    proposals.push({
      file: filePath,
      current: currentFM,
      proposed: proposedFM,
      changes: diffFM(currentFM, proposedFM)
    });
  }
}

function parseFrontmatter(text) {
  const fm = {};
  for (const line of text.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      const value = line.substring(colonIdx + 1).trim();
      fm[key] = value;
    }
  }
  return fm;
}

function diffFM(current, proposed) {
  const diff = {};
  for (const key in proposed) {
    if (current[key] !== proposed[key]) {
      diff[key] = proposed[key];
    }
  }
  return diff;
}

async function scanDirectory(dir, vaultLayer) {
  try {
    const entries = await readdir(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        await scanDirectory(fullPath, vaultLayer);
      } else if (entry.endsWith('.md')) {
        await analyzeFile(fullPath, vaultLayer);
      }
    }
  } catch (err) {
    // Skip
  }
}

async function main() {
  console.log('🔍 Analyzing frontmatter...');
  
  for (const vault of VAULT_PATHS) {
    await scanDirectory(vault.path, vault.layer);
  }
  
  // Generate report
  const fs = await import('node:fs/promises');
  
  let report = `# Frontmatter Patch Plan\n\n**Generated:** ${new Date().toISOString()}\n\n`;
  report += `## 📊 Summary\n\n`;
  report += `| Metric | Count |\n`;
  report += `|--------|-------|\n`;
  report += `| **Files Analyzed** | ${proposals.length + (proposals.length === 0 ? 'N/A' : '')} |\n`;
  report += `| **Proposals Generated** | ${proposals.length} |\n\n`;
  
  if (proposals.length === 0) {
    report += `**Status:** ✅ All files already have appropriate frontmatter.\n\n`;
  } else {
    report += `## 📋 Proposed Changes\n\n`;
    
    for (const proposal of proposals.slice(0, 50)) { // Top 50
      report += `### ${basename(proposal.file)}\n\n`;
      report += `**Path:** \`${proposal.file}\`\n\n`;
      report += `**Changes:**\n`;
      for (const [key, value] of Object.entries(proposal.changes)) {
        report += `- Add \`${key}: ${value}\`\n`;
      }
      report += '\n';
    }
    
    if (proposals.length > 50) {
      report += `\n*... and ${proposals.length - 50} more proposals*\n\n`;
    }
    
    report += `## 🔄 YAML Diff Preview\n\n`;
    report += `\`\`\`yaml\n`;
    report += `# Example: Adding trihex_layer\n`;
    report += `---\n`;
    report += `trihex_layer: obsidian  # NEW\n`;
    report += `trihex_module: kyoen-ai  # NEW (if applicable)\n`;
    report += `# ... existing keys unchanged\n`;
    report += `---\n`;
    report += `\`\`\`\n`;
  }
  
  await fs.writeFile('99_SYSTEM/Proofs/FRONTMATTER_PATCH_PLAN.md', report);
  
  console.log(`✅ Generated ${proposals.length} proposals!`);
}

main().catch(console.error);


