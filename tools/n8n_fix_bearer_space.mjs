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

async function fixBearer() {
  console.log('🔧 Fixing Bearer token spacing...\n');
  
  const workflows = [
    { id: 'x6DDgPh24FLp33am', name: 'event-detect' },
    { id: 'Ozw3pPoFy0GsfdOm', name: 'rsvp' },
    { id: 'kugMQN2qdbuLoIw9', name: 'reminders' },
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
    
    let fixed = 0;
    for (const node of clean.nodes) {
      if (node.parameters?.headerParameters?.parameters) {
        for (const h of node.parameters.headerParameters.parameters) {
          if (h.name === 'Authorization' && h.value.startsWith('Bearer') && !h.value.includes(' ')) {
            // Fix: BearerXXX -> Bearer XXX
            h.value = h.value.replace('Bearer', 'Bearer ');
            fixed++;
          }
        }
      }
    }
    
    if (fixed > 0) {
      await n8nRequest('PUT', `/${wf.id}`, clean);
      console.log(`  ✅ Fixed ${fixed} headers`);
    }
  }
  
  console.log('\n✅ Complete');
}

fixBearer();


