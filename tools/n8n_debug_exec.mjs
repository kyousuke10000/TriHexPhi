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

async function debug() {
  // Get workflow
  const wfId = 'z80YkaQJp2MYnfxS';
  const wfRes = await fetch(
    `${secrets.n8n.N8N_API_URL}/workflows/${wfId}`,
    { headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY } }
  );
  
  if (!wfRes.ok) {
    console.log(`❌ ${wfRes.status}`);
    return;
  }
  
  const wf = await wfRes.json();
  
  console.log('📋 Workflow Nodes:\n');
  for (const node of wf.nodes) {
    console.log(`${node.name} (${node.type})`);
    if (node.type === 'n8n-nodes-base.webhook') {
      console.log(`  Webhook: ${node.parameters.path || 'N/A'}`);
      console.log(`  Method: ${node.parameters.httpMethod || 'GET'}`);
    }
    console.log('');
  }
  
  console.log('\n🔗 Connections:\n');
  console.log(JSON.stringify(wf.connections, null, 2));
}

debug();


