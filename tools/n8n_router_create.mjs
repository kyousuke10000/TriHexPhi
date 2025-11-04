#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const secrets = Object.fromEntries(
  readFileSync(join(root, '.secrets/n8n.env'), 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=', 2))
);
const lineSecrets = Object.fromEntries(
  readFileSync(join(root, '.secrets/line.env'), 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=', 2))
);
const supabaseSecrets = Object.fromEntries(
  readFileSync(join(root, '.secrets/supabase.env'), 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=', 2))
);

async function n8nRequest(method, path, body) {
  const url = `${secrets.N8N_API_URL}${path}`;
  const opts = {
    method,
    headers: {
      'X-N8N-API-KEY': secrets.N8N_API_TOKEN,
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status}`);
  return res.json();
}

async function main() {
  console.log('🔧 Creating Router workflow...\n');

  const router = {
    name: 'LINE Router',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'kyoen-line-in' },
        id: 'webhook',
        name: 'LINE Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [250, 300],
        webhookId: 'kyoen-line-in'
      },
      {
        parameters: {
          jsCode: `const event = $input.item.json.events[0];
const replyToken = event.replyToken;
const source = event.source;

// /ping check
if (event.type === 'message' && event.message && event.message.text === '/ping') {
  return [{ json: { action: 'ping', replyToken } }];
}

// postback → rsvp
if (event.type === 'postback') {
  return [{ json: { action: 'rsvp', event, replyToken } }];
}

// message → event-detect
if (event.type === 'message' && event.message.type === 'text') {
  const text = event.message.text;
  return [{ json: { action: 'event-detect', text, event, replyToken } }];
}

return [{ json: { action: 'ignore' } }];`
        },
        id: 'router',
        name: 'Route',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [450, 300]
      },
      {
        parameters: {
          mode: 'whenAllItems',
          jsCode: `const text = $input.item.json.text || '';
const REPLY = $input.item.json.replyToken;

// Improved regex
const dateMatch = text.match(/(20\\d{2})[\\/.\\-年](\\d{1,2})[\\/.\\-月](\\d{1,2})/);
const timeMatch = text.match(/(\\d{1,2}):(\\d{2})/);
const zoomMatch = text.match(/https?:\\/\\/\\S*zoom\\.us\\/\\S+\\?[^ ]*pwd=[^ \\n]+/);

let startAt = null;
if (dateMatch && timeMatch) {
  const year = dateMatch[1];
  const month = dateMatch[2].padStart(2, '0');
  const day = dateMatch[3].padStart(2, '0');
  const time = timeMatch[0];
  startAt = \`\${year}-\${month}-\${day}T\${time}:00+09:00\`;
}

const title = text.split('\\n')[0].trim();
const zoomUrl = zoomMatch ? zoomMatch[0] : null;

return {
  json: {
    title,
    start_at: startAt,
    zoom_url: zoomUrl,
    created_by: 'tokunoshima',
    replyToken: REPLY
  }
};`
        },
        id: 'extract',
        name: 'Extract Event',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [650, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: `${supabaseSecrets.SUPABASE_URL}/rest/v1/tokunoshima_events`,
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'apikey', value: supabaseSecrets.SUPABASE_SERVICE_ROLE_KEY },
              { name: 'Authorization', value: `Bearer${supabaseSecrets.SUPABASE_SERVICE_ROLE_KEY}` },
              { name: 'Prefer', value: 'return=representation' }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            title: '={{ $json.title }}',
            start_at: '={{ $json.start_at }}',
            zoom_url: '={{ $json.zoom_url }}',
            created_by: '={{ $json.created_by }}'
          })
        },
        id: 'upsert',
        name: 'Upsert',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [850, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: 'https://api.line.me/v2/bot/message/reply',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'Content-Type', value: 'application/json' },
              { name: 'Authorization', value: `Bearer${lineSecrets.LINE_CHANNEL_TOKEN}` }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            replyToken: '={{ $json.replyToken }}',
            messages: [{
              type: 'flex',
              altText: 'イベント',
              contents: {
                type: 'bubble',
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    { type: 'text', text: '={{ $json.title }}', weight: 'bold' },
                    { type: 'text', text: '={{ $json.start_at }}' }
                  ]
                },
                footer: {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    { type: 'button', action: { type: 'postback', data: 'going:={{ $json.id }}', label: '参加' } },
                    { type: 'button', action: { type: 'postback', data: 'maybe:={{ $json.id }}', label: '検討' } },
                    { type: 'button', action: { type: 'postback', data: 'mute:={{ $json.id }}', label: 'mute' } }
                  ]
                }
              }
            }]
          })
        },
        id: 'reply',
        name: 'Reply',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [1050, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: 'https://api.line.me/v2/bot/message/reply',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'Content-Type', value: 'application/json' },
              { name: 'Authorization', value: `Bearer${lineSecrets.LINE_CHANNEL_TOKEN}` }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            replyToken: '={{ $json.replyToken }}',
            messages: [{ type: 'text', text: 'pong' }]
          })
        },
        id: 'pong',
        name: 'Reply Pong',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [850, 500]
      }
    ],
    connections: {
      'LINE Webhook': { main: [[{ node: 'Route', type: 'main', index: 0 }]] },
      'Route': { main: [[{ node: 'Extract Event', type: 'main', index: 0 }, { node: 'Reply Pong', type: 'main', index: 0 }]] },
      'Extract Event': { main: [[{ node: 'Upsert', type: 'main', index: 0 }]] },
      'Upsert': { main: [[{ node: 'Reply', type: 'main', index: 0 }]] }
    },
    settings: { executionOrder: 'v1' },
    staticData: null
  };

  // Deploy
  const result = await n8nRequest('POST', '/workflows', router);
  console.log(`✅ Created: ${result.id}`);
}

main();


