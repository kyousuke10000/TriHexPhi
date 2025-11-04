#!/usr/bin/env node

/**
 * KYOEN LINE Zero Friction Ops - Automated n8n Deployment
 * Creates and activates 4 workflows via n8n API
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

// Load secrets
function loadSecrets() {
  const supabase = Object.fromEntries(
    readFileSync(join(root, '.secrets/supabase.env'), 'utf8')
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
  const n8n = Object.fromEntries(
    readFileSync(join(root, '.secrets/n8n.env'), 'utf8')
      .split('\n')
      .filter(l => l && !l.startsWith('#'))
      .map(l => l.split('=', 2))
  );
  return { supabase, line, n8n };
}

const secrets = loadSecrets();

// n8n API client
async function n8nRequest(method, path, body) {
  const url = `${secrets.n8n.N8N_API_URL}${path}`;
  const opts = {
    method,
    headers: {
      'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY,
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);
  
  console.log(`→ ${method} ${path}`);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    console.log(`❌ ${res.status}: ${text}`);
    throw new Error(`n8n API ${method} ${path}: ${res.status} ${text}`);
  }
  const result = await res.json();
  console.log(`✅ ${method} ${path}: OK`);
  return result;
}

// Workflow definitions
const workflows = {
  'event-detect': {
    name: 'KYOEN Event Detect',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'kyoen-line-in' },
        id: 'webhook',
        name: 'LINE Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [250, 300],
        webhookId: 'kyoen-line-in',
        credentials: {}
      },
      {
        parameters: {
          jsCode: `// Extract: date/time/title/ZoomURL
const events = $input.item.json.events;
const event = events[0];
const message = event.message.text;

return {
  message,
  replyToken: event.replyToken
};`
        },
        id: 'extract',
        name: 'Extract Data',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [450, 300]
      },
      {
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
      },
      {
        parameters: {
          method: 'POST',
          url: 'https://api.line.me/v2/bot/message/reply',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'Content-Type', value: 'application/json' },
              { name: 'Authorization', value: `Bearer ${secrets.line.LINE_CHANNEL_TOKEN}` }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            replyToken: '={{ $("Extract Data").item.json.replyToken }}',
            messages: [{ type: 'text', text: 'pong' }]
          })
        },
        id: 'ping',
        name: 'Reply Pong',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [850, 500]
      },
      {
        parameters: {
          jsCode: `// Extract: date/time/title/ZoomURL
const message = $('Extract Data').item.json.message;

// Date patterns
const dateMatch1 = message.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
const dateMatch2 = message.match(/(\\d{1,2})\\/(\\d{1,2})/);
const timeMatch = message.match(/(\\d{1,2}):(\\d{2})(?:\\s*-\\s*(\\d{1,2}):(\\d{2}))?/);
const zoomMatch = message.match(/(https?:\\/\\/(?:[^\\s]+)?zoom\\.us\\/[^\\s?]+\\?pwd=[^\\s]+)/);

let dateStr = null;
if (dateMatch1) {
  dateStr = \`\${dateMatch1[1]}-\${dateMatch1[2]}-\${dateMatch1[3]}\`;
} else if (dateMatch2) {
  const year = new Date().getFullYear();
  dateStr = \`\${year}-\${dateMatch2[1].padStart(2, '0')}-\${dateMatch2[2].padStart(2, '0')}\`;
}

let timeStr = '00:00';
if (timeMatch) {
  timeStr = timeMatch[0];
}

const title = message.split('\\n')[0].trim();
const zoomUrl = zoomMatch ? zoomMatch[0] : null;

const startAt = dateStr ? \`\${dateStr}T\${timeStr}:00+09:00\` : null;

return {
  title, startAt, zoomUrl, message, replyToken: $('Extract Data').item.json.replyToken
};`
        },
        id: 'parse',
        name: 'Parse Event',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [850, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: `\${${JSON.stringify(secrets.supabase.SUPABASE_URL)}}/rest/v1/tokunoshima_events`,
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'apikey', value: secrets.supabase.SUPABASE_SERVICE_ROLE_KEY },
              { name: 'Authorization', value: `Bearer ${secrets.supabase.SUPABASE_SERVICE_ROLE_KEY}` },
              { name: 'Prefer', value: 'return=representation,resolution=merge-duplicates' },
              { name: 'Content-Type', value: 'application/json' }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            title: '={{ $json.title }}',
            start_at: '={{ $json.startAt }}',
            zoom_url: '={{ $json.zoomUrl }}',
            created_by: 'tokunoshima'
          })
        },
        id: 'upsert',
        name: 'Upsert Event',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [650, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: 'https://api.line.me/v2/bot/message/reply',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'Content-Type', value: 'application/json' },
              { name: 'Authorization', value: `Bearer ${secrets.line.LINE_CHANNEL_TOKEN}` }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            replyToken: '={{ $json.replyToken }}',
            messages: [{
              type: 'flex',
              altText: '={{ $("Extract Data").item.json.title }}',
              contents: {
                type: 'bubble',
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    { type: 'text', text: '={{ $("Extract Data").item.json.title }}', weight: 'bold' },
                    { type: 'text', text: '={{ $("Extract Data").item.json.startAt }}' }
                  ]
                },
                footer: {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    { type: 'button', action: { type: 'postback', data: `going:=\${{$json.id}}`, label: '参加する' } },
                    { type: 'button', action: { type: 'postback', data: `maybe:=\${{$json.id}}`, label: '検討中' } },
                    { type: 'button', action: { type: 'postback', data: `mute:=\${{$json.id}}`, label: '聞かせて' } }
                  ]
                }
              }
            }]
          })
        },
        id: 'reply',
        name: 'Reply Flex',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [850, 300]
      }
    ],
    connections: {
      'LINE Webhook': {
        main: [[{ node: 'Extract Data', type: 'main', index: 0 }]]
      },
      'Extract Data': {
        main: [[{ node: 'If /ping?', type: 'main', index: 0 }]]
      },
      'If /ping?': {
        main: [[{ node: 'Reply Pong', type: 'main', index: 0 }], [{ node: 'Parse Event', type: 'main', index: 0 }]]
      },
      'Parse Event': {
        main: [[{ node: 'Upsert Event', type: 'main', index: 0 }]]
      },
      'Upsert Event': {
        main: [[{ node: 'Reply Flex', type: 'main', index: 0 }]]
      }
    },
    settings: {
      executionOrder: 'v1',
      saveDataErrorExecution: 'all',
      saveDataSuccessExecution: 'all',
      saveManualExecutions: true
    },
    staticData: null
  },
  'rsvp': {
    name: 'KYOEN RSVP',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'kyoen-rsvp' },
        id: 'webhook',
        name: 'LINE Postback',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [250, 300],
        webhookId: 'kyoen-rsvp',
        credentials: {}
      },
      {
        parameters: {
          jsCode: `const events = $input.item.json.events;
const event = events[0];
const data = event.postback.data;
const [status, event_id] = data.split(':');
const user_id = event.source.userId;

return {
  status, event_id, user_id, data, replyToken: event.replyToken
};`
        },
        id: 'parse',
        name: 'Parse Postback',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [450, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: `\${${JSON.stringify(secrets.supabase.SUPABASE_URL)}}/rest/v1/tokunoshima_rsvp`,
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'apikey', value: secrets.supabase.SUPABASE_SERVICE_ROLE_KEY },
              { name: 'Authorization', value: `Bearer ${secrets.supabase.SUPABASE_SERVICE_ROLE_KEY}` },
              { name: 'Prefer', value: 'return=minimal,resolution=merge-duplicates' },
              { name: 'Content-Type', value: 'application/json' }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            event_id: '={{ $json.event_id }}',
            user_id: '={{ $json.user_id }}',
            status: '={{ $json.status }}'
          })
        },
        id: 'upsert',
        name: 'Upsert RSVP',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [650, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: 'https://api.line.me/v2/bot/message/reply',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'Content-Type', value: 'application/json' },
              { name: 'Authorization', value: `Bearer ${secrets.line.LINE_CHANNEL_TOKEN}` }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            replyToken: '={{ $json.replyToken }}',
            messages: [{ type: 'text', text: '記録しました' }]
          })
        },
        id: 'reply',
        name: 'Reply Snack',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [850, 300]
      }
    ],
    connections: {
      'LINE Postback': {
        main: [[{ node: 'Parse Postback', type: 'main', index: 0 }]]
      },
      'Parse Postback': {
        main: [[{ node: 'Upsert RSVP', type: 'main', index: 0 }]]
      },
      'Upsert RSVP': {
        main: [[{ node: 'Reply Snack', type: 'main', index: 0 }]]
      }
    },
    settings: {
      executionOrder: 'v1'
    },
    staticData: null
  },
  'reminders': {
    name: 'KYOEN Reminders',
    nodes: [
      {
        parameters: {
          rule: {
            interval: [{ field: 'cronExpression', expression: '* * * * *' }]
          }
        },
        id: 'cron',
        name: 'Cron',
        type: 'n8n-nodes-base.cron',
        typeVersion: 1,
        position: [250, 300]
      },
      {
        parameters: {
          method: 'GET',
          url: `\${${JSON.stringify(secrets.supabase.SUPABASE_URL)}}/rest/v1/tokunoshima_events?select=*,tokunoshima_rsvp!inner(user_id)&tokunoshima_rsvp.status=eq.going`,
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'apikey', value: secrets.supabase.SUPABASE_SERVICE_ROLE_KEY },
              { name: 'Authorization', value: `Bearer\${${JSON.stringify(secrets.supabase.SUPABASE_SERVICE_ROLE_KEY)}}` }
            ]
          }
        },
        id: 'query',
        name: 'Query Events',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [450, 300]
      },
      {
        parameters: {
          mode: 'executeOnceForEachItem',
          jsCode: `const items = $input.all();
const now = new Date();
const messages = [];

for (const item of items) {
  const startAt = new Date(item.json.start_at);
  const diffMin = (startAt - now) / (1000 * 60);
  
  let interval = null;
  if (diffMin >= 1440 - 1 && diffMin <= 1440 + 1) interval = '24時間';
  else if (diffMin >= 60 - 1 && diffMin <= 60 + 1) interval = '1時間';
  else if (diffMin >= 10 - 1 && diffMin <= 10 + 1) interval = '10分';
  
  if (interval) {
    messages.push({
      userId: item.json.tokunoshima_rsvp.user_id,
      title: item.json.title,
      zoomUrl: item.json.zoom_url,
      interval
    });
  }
}

return messages;`
        },
        id: 'filter',
        name: 'Filter Timing',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [650, 300]
      },
      {
        parameters: {
          mode: 'executeOnceForEachItem',
          method: 'POST',
          url: 'https://api.line.me/v2/bot/message/push',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'Content-Type', value: 'application/json' },
              { name: 'Authorization', value: `Bearer ${secrets.line.LINE_CHANNEL_TOKEN}` }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            to: '={{ $json.userId }}',
            messages: [{
              type: 'text',
              text: '={{ $json.title }}が\{{ $json.interval }}で開始です。\n{{ $json.zoomUrl }}'
            }]
          })
        },
        id: 'dm',
        name: 'Send DM',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [850, 300]
      }
    ],
    connections: {
      'Cron': {
        main: [[{ node: 'Query Events', type: 'main', index: 0 }]]
      },
      'Query Events': {
        main: [[{ node: 'Filter Timing', type: 'main', index: 0 }]]
      },
      'Filter Timing': {
        main: [[{ node: 'Send DM', type: 'main', index: 0 }]]
      }
    },
    settings: {
      executionOrder: 'v1'
    },
    staticData: null
  },
  'cards': {
    name: 'KYOEN Cards',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'kyoen-cards' },
        id: 'webhook',
        name: 'LINE Command',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [250, 300],
        webhookId: 'kyoen-cards',
        credentials: {}
      },
      {
        parameters: {
          method: 'GET',
          url: `\${${JSON.stringify(secrets.supabase.SUPABASE_URL)}}/rest/v1/line_cards?select=*&order=updated_at.desc&limit=10`,
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'apikey', value: secrets.supabase.SUPABASE_SERVICE_ROLE_KEY },
              { name: 'Authorization', value: `Bearer ${secrets.supabase.SUPABASE_SERVICE_ROLE_KEY}` }
            ]
          }
        },
        id: 'query',
        name: 'Query Cards',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [450, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: 'https://api.line.me/v2/bot/message/reply',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: 'Content-Type', value: 'application/json' },
              { name: 'Authorization', value: `Bearer ${secrets.line.LINE_CHANNEL_TOKEN}` }
            ]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: JSON.stringify({
            replyToken: '={{ $json.events[0].replyToken }}',
            messages: [{
              type: 'text',
              text: 'カード一覧:\n{{ $json.map(c => c.title).join("\\n") }}'
            }]
          })
        },
        id: 'reply',
        name: 'Reply Cards',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [650, 300]
      }
    ],
    connections: {
      'LINE Command': {
        main: [[{ node: 'Query Cards', type: 'main', index: 0 }]]
      },
      'Query Cards': {
        main: [[{ node: 'Reply Cards', type: 'main', index: 0 }]]
      }
    },
    settings: {
      executionOrder: 'v1'
    },
    staticData: null
  }
};

// Main deployment
async function deploy() {
  const log = [];
  
  try {
    log.push('🚀 Starting n8n deployment...');
    
    // Test connection
    const existing = await n8nRequest('GET', '/workflows');
    log.push(`✅ Connected to n8n (${existing.data?.length || 0} existing workflows)`);
    
    // Deploy each workflow definition
    const deployed = [];
    for (const [key, workflowDef] of Object.entries(workflows)) {
      try {
        log.push(`📦 Deploying: ${key}`);
        const result = await n8nRequest('POST', '/workflows', workflowDef);
        deployed.push({ key, id: result.id, active: result.active });
        log.push(`✅ ${key}: ID=${result.id}, Active=${result.active}`);
      } catch (err) {
        log.push(`❌ ${key}: ${err.message}`);
      }
    }
    
    // Summary
    log.push('');
    log.push('=== Deployment Summary ===');
    log.push(`Deployed: ${deployed.length}/${Object.keys(workflows).length}`);
    deployed.forEach(w => log.push(`  ${w.key}: ${w.id} (${w.active ? 'Active' : 'Inactive'})`));
    
    return { success: true, log, deployed };
  } catch (err) {
    log.push(`❌ Fatal error: ${err.message}`);
    return { success: false, log, error: err.message };
  }
}

// Run
const result = await deploy();
console.log(result.log.join('\n'));
process.exit(result.success ? 0 : 1);

