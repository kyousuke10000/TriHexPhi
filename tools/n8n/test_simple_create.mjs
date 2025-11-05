#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

// Load secrets
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

async function test() {
  const url = `${secrets.n8n.N8N_API_URL}/workflows`;
  console.log(`Testing: ${url}`);
  
  const minimal = {
    name: "Test Workflow",
    nodes: [],
    connections: {},
    settings: { executionOrder: 'v1' }
  };
  
  console.log('Sending:', JSON.stringify(minimal, null, 2));
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-N8N-API-KEY': secrets.n8n.N8N_API_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(minimal)
  });
  
  const text = await res.text();
  console.log(`Status: ${res.status}`);
  console.log(`Response: ${text}`);
  
  if (res.ok) {
    console.log('\n✅ Success! Format is correct');
    const json = JSON.parse(text);
    console.log(`Workflow ID: ${json.id}`);
  } else {
    console.log('\n❌ Failed');
  }
}

test();


