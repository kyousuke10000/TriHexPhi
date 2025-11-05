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

async function updateEventDetect() {
  console.log('🔧 Updating event-detect to handle /ping...\n');
  
  const wf = await n8nRequest('GET', '/x6DDgPh24FLp33am');
  
  // Add ping handler before extract
  const clean = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings,
    staticData: wf.staticData
  };
  
  // Find Extract Data node
  const extractNode = clean.nodes.find(n => n.name === 'Extract Data');
  if (extractNode) {
    // Update code to handle /ping
    const originalCode = extractNode.parameters.jsCode;
    const newCode = `const events = $input.item.json.events;
const event = events[0];
const message = event.message.text;

// /ping check
if (message === '/ping') {
  return { action: 'ping', replyToken: event.replyToken };
}

${originalCode.replace('const events = $input.item.json.events;\nconst event = events[0];\nconst message = event.message.text;', '')}`;
    
    extractNode.parameters.jsCode = newCode;
  }
  
  // Add ping reply node
  const pingReply = {
    parameters: {
      method: 'POST',
      url: 'https://api.line.me/v2/bot/message/reply',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'Authorization', value: `Bearer${secrets.line.LINE_CHANNEL_TOKEN}` }
        ]
      },
      sendBody: true,
      specifyBody: 'json',
      jsonBody: JSON.stringify({
        replyToken: '={{ $json.replyToken }}',
        messages: [{ type: 'text', text: 'pong' }]
      })
    },
    id: 'ping',
    name: 'Reply Pong',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.1,
    position: [650, 500]
  };
  
  clean.nodes.push(pingReply);
  
  // Update connections
  clean.connections['Extract Data'] = {
    main: [[
      { node: 'Upsert Event', type: 'main', index: 0 },
      { node: 'Reply Pong', type: 'main', index: 0 }
    ]]
  };
  
  await n8nRequest('PUT', '/x6DDgPh24FLp33am', clean);
  console.log('✅ Updated');
}

updateEventDetect();


