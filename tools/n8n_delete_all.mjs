#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadSecrets() {
  const n8n = Object.fromEntries(
    readFileSync(join(root, '.secrets/n8n.env'), 'utf8')
      .split('\n')
      .filter(l => l && !l.startsWith('#'))
      .map(l => l.split('=', 2))
  );
  return { n8n };
}

const secrets = loadSecrets();

async function deleteWorkflow(id) {
  const url = `${secrets.n8n.N8N_API_URL}/workflows/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DELETE ${id}: ${res.status} ${text}`);
  }
}

async function listWorkflows() {
  const url = `${secrets.n8n.N8N_API_URL}/workflows`;
  const res = await fetch(url, {
    headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY }
  });
  const data = await res.json();
  return data.data || data; // Handle both formats
}

async function main() {
  console.log('🗑️  Deleting all workflows...\n');
  
  const workflows = await listWorkflows();
  console.log(`Found ${workflows.length} workflows\n`);
  
  for (const wf of workflows) {
    console.log(`Deleting: ${wf.name} (${wf.id})`);
    try {
      await deleteWorkflow(wf.id);
      console.log('  ✅ Deleted\n');
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}\n`);
    }
  }
  
  console.log('✅ All workflows deleted');
}

main();

