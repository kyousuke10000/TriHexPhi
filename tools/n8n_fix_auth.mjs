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
  const line = Object.fromEntries(
    readFileSync(join(root, '.secrets/line.env'), 'utf8')
      .split('\n')
      .filter(l => l && !l.startsWith('#'))
      .map(l => l.split('=', 2))
  );
  return { n8n, line };
}

const secrets = loadSecrets();

async function n8nRequest(method, path, body) {
  const url = `${secrets.n8n.N8N_API_URL}/workflows${path}`;
  const opts = {
    method,
    headers: {
      'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY,
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status}`);
  return res.json();
}

async function main() {
  console.log('🔐 Adding authentication to webhook...\n');
  
  const wf = await n8nRequest('GET', '/x6DDgPh24FLp33am');
  
  const clean = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings,
    staticData: wf.staticData
  };
  
  // Set auth on webhook
  const webhook = clean.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
  webhook.parameters.authentication = 'predefinedCredentialType';
  webhook.parameters.nodeCredentialType = 'httpHeaderAuth';
  
  console.log('✅ Webhook auth configured');
  console.log('Note: You need to create "httpHeaderAuth" credential in n8n UI');
  
  await n8nRequest('PUT', '/x6DDgPh24FLp33am', clean);
  console.log('✅ Saved');
}

main();


