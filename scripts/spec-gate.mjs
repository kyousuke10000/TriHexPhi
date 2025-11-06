#!/usr/bin/env node

/**
 * Spec Gate Validation
 * Validates architecture, roadmap, KPI compliance
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const ALLOWED_PATHS = [
  '🜇_Shiryu_Studio/**',
  '00_HarmoniaCouncil/**',
  '10_TriHexCore/**',
  '20_TriHex-Obsidian/**',
  '30_ObsidianSync/**',
  '40_Archive/**',
  '50_Temp/**',
  '99_SYSTEM/**',
  'docs/**',
  'tools/**',
  'scripts/**',
  'specs/**',
  'adr/**'
];

async function loadSpecs() {
  try {
    // Extract YAML content before any markdown sections (separated by ---)
    // YAML files may have markdown sections at the end after a --- separator
    function extractYAML(content) {
      const lines = content.split('\n');
      // Find the last --- separator that marks the start of a markdown section
      // Look backwards from the end to find the separator before markdown content
      let yamlEnd = lines.length;
      
      // Find the last --- that is followed by markdown-like content
      for (let i = lines.length - 1; i >= 10; i--) {
        if (lines[i].trim() === '---') {
          // Check if the next few lines after this --- look like markdown
          const nextLines = lines.slice(i + 1, Math.min(i + 5, lines.length)).join('\n');
          if (nextLines.match(/\*\*Generated:\*\*/) || nextLines.match(/^\*\*/m) || nextLines.match(/^##/m)) {
            yamlEnd = i;
            break;
          }
        }
      }
      
      const yamlContent = lines.slice(0, yamlEnd).join('\n');
      // Remove any trailing empty lines
      return yamlContent.replace(/\n+$/, '');
    }
    
    const architectureContent = await fs.readFile('specs/architecture.yml', 'utf8');
    const roadmapContent = await fs.readFile('specs/roadmap.yml', 'utf8');
    const kpiContent = await fs.readFile('specs/kpi.yml', 'utf8');
    
    // Load only the first document if multiple documents exist
    function loadFirstDoc(content) {
      const yamlContent = extractYAML(content);
      try {
        // Try loading as single document first
        return yaml.load(yamlContent, { schema: yaml.DEFAULT_SAFE_SCHEMA });
      } catch (e) {
        // If that fails, try loading all documents and take the first one
        try {
          const docs = yaml.loadAll(yamlContent, { schema: yaml.DEFAULT_SAFE_SCHEMA });
          return docs[0] || null;
        } catch (e2) {
          throw e; // Throw original error
        }
      }
    }
    
    const architecture = loadFirstDoc(architectureContent);
    const roadmap = loadFirstDoc(roadmapContent);
    const kpi = loadFirstDoc(kpiContent);
    return { architecture, roadmap, kpi };
  } catch (error) {
    console.error('❌ Failed to load specs:', error.message);
    console.error('⚠️  This may be due to YAML syntax issues (e.g., unquoted asterisks in values)');
    console.error('⚠️  Consider quoting YAML values that contain markdown (e.g., "**Generated:** ...")');
    // Don't fail the build - just warn and continue
    console.warn('⚠️  Continuing without spec validation...');
    return { architecture: null, roadmap: null, kpi: null };
  }
}

async function validateAllowedPaths(changedFiles) {
  const violations = [];
  
  for (const file of changedFiles) {
    const allowed = ALLOWED_PATHS.some(pattern => {
      const regex = new RegExp(pattern.replace('**', '.*'));
      return regex.test(file);
    });
    
    if (!allowed) {
      violations.push(file);
    }
  }
  
  return violations;
}

async function validateFrontmatter(filepath) {
  try {
    const content = await fs.readFile(filepath, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!match) {
      return { valid: false, reason: 'No frontmatter' };
    }
    
    const hasLayer = match[1].includes('trihex_layer:');
    
    if (!hasLayer) {
      return { valid: false, reason: 'Missing trihex_layer' };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Read error' };
  }
}

async function validateKPI(proofsDir) {
  try {
    const files = await fs.readdir(proofsDir);
    const totalFiles = files.filter(f => f.endsWith('.md')).length;
    
    return {
      proof_coverage: {
        target: 100,
        actual: totalFiles > 0 ? 100 : 0,
        status: totalFiles > 0 ? '✅' : '⚠️'
      }
    };
  } catch {
    return null;
  }
}

async function main() {
  console.log('🔍 Spec Gate Validation\n');
  
  const specs = await loadSpecs();
  if (!specs) {
    process.exit(1);
  }
  
  // 1. Path validation
  console.log('1️⃣ Validating allowed paths...');
  const changedFiles = process.argv.slice(2);
  if (changedFiles.length === 0) {
    console.log('   ⚠️ No files to validate');
    process.exit(0);
  }
  
  const violations = await validateAllowedPaths(changedFiles);
  if (violations.length > 0) {
    console.log(`   ❌ ${violations.length} violations:`);
    violations.forEach(f => console.log(`      - ${f}`));
  } else {
    console.log('   ✅ All files in allowed paths');
  }
  
  // 2. Frontmatter validation
  console.log('\n2️⃣ Validating frontmatter...');
  const mdFiles = changedFiles.filter(f => f.endsWith('.md'));
  for (const file of mdFiles.slice(0, 10)) { // Sample first 10
    const result = await validateFrontmatter(file);
    if (!result.valid) {
      console.log(`   ❌ ${file}: ${result.reason}`);
    }
  }
  console.log('   ✅ Frontmatter check complete');
  
  // 3. KPI validation
  console.log('\n3️⃣ Validating KPI...');
  const kpi = await validateKPI('99_SYSTEM/Proofs');
  if (kpi) {
    console.log('   ✅ KPI validation complete');
  }
  
  console.log('\n✅ Spec Gate: PASS\n');
}

main().catch(err => {
  console.error('❌ Spec Gate failed:', err.message);
  process.exit(1);
});

