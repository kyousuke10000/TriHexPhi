#!/usr/bin/env node

/**
 * Map files to TriHex vault layers
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, basename } from 'node:path';

const VAULT_LAYERS = {
  '🜇_Shiryu_Studio': { priority: 0, patterns: ['🜇_Shiryu_Studio', '00_Preface', '01_Alchemy', '02_Senteigaku', '03_Renseigaku'] },
  '00_HarmoniaCouncil': { priority: 1, patterns: ['00_HarmoniaCouncil', 'Harmonia'] },
  '10_TriHexCore': { priority: 2, patterns: ['10_TriHexCore', 'TriHexCore', '00_CORE'] },
  '20_TriHex-Obsidian': { priority: 3, patterns: ['20_TriHex-Obsidian', 'TriHex-Obsidian', 'Obsidian'] },
  '30_ObsidianSync': { priority: 4, patterns: ['30_ObsidianSync', 'ObsidianSync'] },
  '40_Archive': { priority: 5, patterns: ['40_Archive', 'Archive', '_アーカイブ'] },
  '50_Temp': { priority: 6, patterns: ['50_Temp', 'Temp', 'tmp'] },
  '99_SYSTEM': { priority: 7, patterns: ['99_SYSTEM', '99_SYSTEM', 'Proofs', 'BreathLogs'] }
};

const KNOWN_FILES = {
  'TRIHEXPHI_v4.0_FINAL.md': '10_TriHexCore',
  'Genesis_Protocol_v3.1.md': '10_TriHexCore',
  'Ryudo_Definition.md': '10_TriHexCore',
  'TriHex_Master_Reactivation.md': '99_SYSTEM'
};

async function mapFile(file) {
  // 1. Check path patterns
  for (const [layer, config] of Object.entries(VAULT_LAYERS)) {
    if (config.patterns.some(p => file.path.includes(p))) {
      return {
        layer,
        priority: config.priority,
        method: 'path_pattern',
        confidence: 'high'
      };
    }
  }
  
  // 2. Check known files
  const filename = basename(file.path);
  if (KNOWN_FILES[filename]) {
    return {
      layer: KNOWN_FILES[filename],
      priority: VAULT_LAYERS[KNOWN_FILES[filename]].priority,
      method: 'known_file',
      confidence: 'very_high'
    };
  }
  
  // 3. Check frontmatter
  if (file.frontmatter) {
    const fm = file.frontmatter;
    
    if (fm.canonical === 'true') {
      return {
        layer: '10_TriHexCore',
        priority: 2,
        method: 'frontmatter_canonical',
        confidence: 'very_high'
      };
    }
    
    if (fm.tags && fm.tags.includes('#TriHex')) {
      return {
        layer: '10_TriHexCore',
        priority: 2,
        method: 'frontmatter_tag',
        confidence: 'medium'
      };
    }
  }
  
  // 4. Unmapped
  return {
    layer: null,
    priority: null,
    method: 'unmapped',
    confidence: null
  };
}

async function main() {
  console.log('🗺️  Mapping files to TriHex vault layers...');
  
  const inventory = JSON.parse(
    await readFile('99_SYSTEM/Proofs/_raw/trihex_inventory.json', 'utf-8')
  );
  
  const mappings = [];
  const stats = {};
  
  for (const layer of Object.keys(VAULT_LAYERS)) {
    stats[layer] = 0;
  }
  stats.unmapped = 0;
  
  for (const item of inventory.tree) {
    if (item.type === 'file') {
      const mapping = await mapFile(item);
      mapping.path = item.path;
      mapping.size = item.size_bytes;
      mapping.ext = item.ext;
      mappings.push(mapping);
      
      if (mapping.layer) {
        stats[mapping.layer]++;
      } else {
        stats.unmapped++;
      }
    }
  }
  
  // Generate markdown report
  const report = `# TriHex Vault Layer Assignment

**Generated:** ${new Date().toISOString()}  
**Scanner:** map_vault_layers.mjs

---

## 📊 Layer Distribution

| Layer | Priority | Count | Method |
|-------|----------|-------|--------|
${Object.entries(stats).map(([layer, count]) => 
  `| ${layer} | ${layer && VAULT_LAYERS[layer] ? VAULT_LAYERS[layer].priority : '-'} | ${count} | - |`
).join('\n')}

---

## 🔍 Unmapped Files (Top 50)

${mappings.filter(m => !m.layer).slice(0, 50).map(m => 
  `- \`${m.path}\` (${m.ext || 'no ext'}, ${(m.size / 1024).toFixed(2)} KB)`
).join('\n')}

---

## ✅ High Confidence Mappings (Sample)

${mappings.filter(m => m.confidence === 'very_high').slice(0, 20).map(m => 
  `- \`${m.path}\` → **${m.layer}** (${m.method})`
).join('\n')}

---

**Generated:** ${new Date().toISOString()}`;
  
  await writeFile('99_SYSTEM/Proofs/MAP_VAULT_ASSIGNMENT.md', report);
  await writeFile('99_SYSTEM/Proofs/_raw/vault_mappings.json', JSON.stringify({ mappings, stats }, null, 2));
  
  console.log('✅ Mapping saved to 99_SYSTEM/Proofs/MAP_VAULT_ASSIGNMENT.md');
  console.log(`\n📊 Stats:`);
  Object.entries(stats).forEach(([layer, count]) => {
    console.log(`   ${layer}: ${count}`);
  });
}

main().catch(console.error);

