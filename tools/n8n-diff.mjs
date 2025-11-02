#!/usr/bin/env node

/**
 * Compare Git workflows with live n8n, detect drift
 * Usage: N8N_BASE_URL=... N8N_API_KEY=... node tools/n8n-diff.mjs --env=prod
 */

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

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
const env = args.find(a => a.startsWith('--env='))?.split('=')[1] || 'stg';

async function fetchWorkflow(workflowId) {
  const res = await fetch(`${BASE_URL}/workflows/${workflowId}`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  if (!res.ok) return null;
  return res.json();
}

function normalizeWorkflow(w) {
  return {
    name: w.name,
    nodes: w.nodes.map(n => ({
      name: n.name,
      type: n.type,
      parameters: n.parameters
    })),
    connections: w.connections
  };
}

async function main() {
  console.log(`🔍 Checking drift for ${env}...`);
  console.log(`Base URL: ${BASE_URL}\n`);

  const dir = join(root, 'workflows');
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));

  const drift = [];

  for (const file of files) {
    const git = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    const name = basename(file, '.json');
    
    console.log(`📝 ${name}`);
    
    // Find in n8n by name
    const { data: all } = await fetchWorkflow('list');
    // Need to get list first...
  }

  // Simplified for now
  console.log('\n⚠️ Diff not fully implemented yet');
  console.log('Compare manually: Git vs n8n UI');
}

main();

