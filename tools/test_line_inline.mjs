#!/usr/bin/env node

/**
 * Test LINE webhook inline without waiting
 */

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

// Directly call LINE API to simulate
async function testPing() {
  console.log('🧪 Testing /ping directly...\n');
  
  const fakeEvent = {
    events: [{
      type: 'message',
      replyToken: 'test_direct_123',
      timestamp: Date.now(),
      source: {
        type: 'group',
        groupId: 'test_group',
        userId: 'test_user'
      },
      message: {
        id: 'msg_test',
        type: 'text',
        text: '/ping'
      }
    }]
  };
  
  console.log('Sending to webhook...');
  const res = await fetch('https://primary-production-14b0.up.railway.app/webhook/kyoen-line-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fakeEvent)
  });
  
  const text = await res.text();
  console.log(`Status: ${res.status}`);
  console.log(`Response: ${text}`);
  
  // Wait a bit and check what was sent to LINE
  console.log('\n⏳ Waiting 3s...');
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('\n✅ Test complete');
  console.log('Check n8n executions to see if pong was sent');
}

testPing();


