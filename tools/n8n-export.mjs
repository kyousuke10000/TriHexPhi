#!/usr/bin/env node

/**
 * Export n8n workflows to JSON files
 * Usage: N8N_BASE_URL=... N8N_API_KEY=... node tools/n8n-export.mjs [--ids=id1,id2]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load env
const BASE_URL = process.env.N8N_BASE_URL || process.env.N8N_API_URL;
const API_KEY = process.env.N8N_API_KEY || process.env.N8N_API_TOKEN;

if (!BASE_URL || !API_KEY) {
  console.error('❌ Missing N8N_BASE_URL and N8N_API_KEY');
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
const idsOnly = args.find(a => a.startsWith('--ids='))?.split('=')[1];

async function fetchWorkflows() {
  const res = await fetch(`${BASE_URL}/workflows`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  if (!res.ok) throw new Error(`Failed to fetch workflows: ${res.status}`);
  return res.json();
}

async function exportWorkflow(workflowId) {
  const res = await fetch(`${BASE_URL}/workflows/${workflowId}`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  if (!res.ok) throw new Error(`Failed to fetch workflow ${workflowId}: ${res.status}`);
  return res.json();
}

async function main() {
  console.log('📦 Exporting n8n workflows...');
  console.log(`Base URL: ${BASE_URL}\n`);

  const dir = join(root, 'workflows');
  mkdirSync(dir, { recursive: true });

  try {
    const { data: allWorkflows } = await fetchWorkflows();
    
    // Filter by target workflow IDs if specified
    const targetIds = idsOnly ? idsOnly.split(',') : ['x6DDgPh24FLp33am', 'Ozw3pPoFy0GsfdOm', 'kugMQN2qdbuLoIw9', 'ZJq3KtFbBP6bzjwy'];
    const toExport = allWorkflows.filter(w => targetIds.includes(w.id));
    
    console.log(`Found ${toExport.length} workflows to export\n`);

    for (const w of toExport) {
      const full = await exportWorkflow(w.id);
      
      // Clean for version control
      const clean = {
        name: full.name,
        nodes: full.nodes,
        connections: full.connections,
        settings: full.settings,
        staticData: full.staticData
      };
      
      // Filename: sanitize workflow name
      const filename = `${w.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
      const path = join(dir, filename);
      
      writeFileSync(path, JSON.stringify(clean, null, 2));
      console.log(`✅ ${filename}`);
    }
    
    console.log(`\n✅ Exported ${toExport.length} workflows to workflows/`);
  } catch (err) {
    console.error(`❌ Export failed: ${err.message}`);
    process.exit(1);
  }
}

main();


