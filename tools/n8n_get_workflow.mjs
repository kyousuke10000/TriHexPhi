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

async function getWorkflow(id) {
  const res = await fetch(
    `${secrets.n8n.N8N_API_URL}/workflows/${id}`,
    {
      headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY }
    }
  );
  return res.json();
}

// Get event-detect workflow
const wf = await getWorkflow('x6DDgPh24FLp33am');

console.log('📋 Nodes:');
for (const node of wf.nodes) {
  console.log(`\n${node.name}`);
  console.log(`  Type: ${node.type}`);
  console.log(`  ID: ${node.id}`);
  
  if (node.type === 'n8n-nodes-base.webhook') {
    console.log(`  Webhook ID: ${node.parameters.path}`);
    console.log(`  Method: ${node.parameters.httpMethod || 'GET'}`);
  }
  
  if (node.type === 'n8n-nodes-base.httpRequest') {
    console.log(`  URL: ${node.parameters.url}`);
    console.log(`  Method: ${node.parameters.method}`);
    console.log(`  Auth Type: ${node.parameters.authentication || 'none'}`);
    if (node.parameters.headerParameters) {
      console.log(`  Headers: ${Object.keys(node.parameters.headerParameters.parameters || {}).length} items`);
    }
  }
}

console.log('\n\n🔗 Connections:');
console.log(JSON.stringify(wf.connections, null, 2));


