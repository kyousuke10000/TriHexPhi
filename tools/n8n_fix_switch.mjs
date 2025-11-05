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

async function fixSwitch() {
  console.log('🔧 Adding IF node for /ping switch...\n');
  
  const wf = await n8nRequest('GET', '/x6DDgPh24FLp33am');
  
  const clean = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings,
    staticData: wf.staticData
  };
  
  // Add IF node
  const ifNode = {
    parameters: {
      conditions: {
        options: {},
        conditions: [{
          id: 'ping-check',
          leftValue: '={{ $json.message }}',
          rightValue: '/ping',
          operator: { type: 'string', operation: 'equals' }
        }]
      }
    },
    id: 'if',
    name: 'If /ping?',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: [650, 300]
  };
  
  clean.nodes.push(ifNode);
  
  // Update connections
  clean.connections = {
    'LINE Webhook': {
      main: [[{ node: 'Extract Data', type: 'main', index: 0 }]]
    },
    'Extract Data': {
      main: [[{ node: 'If /ping?', type: 'main', index: 0 }]]
    },
    'If /ping?': {
      main: [[{ node: 'Reply Pong', type: 'main', index: 0 }], [{ node: 'Upsert Event', type: 'main', index: 0 }]]
    },
    'Upsert Event': {
      main: [[{ node: 'Reply Flex', type: 'main', index: 0 }]]
    }
  };
  
  await n8nRequest('PUT', '/x6DDgPh24FLp33am', {
    name: clean.name,
    nodes: clean.nodes,
    connections: clean.connections,
    settings: clean.settings,
    staticData: clean.staticData
  });
  console.log('✅ Updated');
}

fixSwitch();

