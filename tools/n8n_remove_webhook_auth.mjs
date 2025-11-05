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

async function removeWebhookAuth() {
  console.log('🔧 Removing auth from webhook nodes...\n');
  
  const workflows = [
    { id: 'x6DDgPh24FLp33am', name: 'event-detect' },
    { id: 'Ozw3pPoFy0GsfdOm', name: 'rsvp' },
    { id: 'ZJq3KtFbBP6bzjwy', name: 'cards' }
  ];
  
  for (const wf of workflows) {
    console.log(`📝 ${wf.name}`);
    const full = await n8nRequest('GET', `/${wf.id}`);
    
    const clean = {
      name: full.name,
      nodes: full.nodes,
      connections: full.connections,
      settings: full.settings,
      staticData: full.staticData
    };
    
    // Remove credentials from webhook nodes
    const webhook = clean.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
    if (webhook && webhook.credentials) {
      webhook.credentials = {};
      console.log('  ✅ Removed webhook auth');
    }
    
    await n8nRequest('PUT', `/${wf.id}`, clean);
    console.log('✅ Saved\n');
  }
  
  console.log('✅ Complete');
}

removeWebhookAuth();


