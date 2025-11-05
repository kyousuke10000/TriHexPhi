#!/usr/bin/env node

/**
 * Test LINE webhook with realistic payload
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadSecrets() {
  const line = Object.fromEntries(
    readFileSync(join(root, '.secrets/line.env'), 'utf8')
      .split('\n')
      .filter(l => l && !l.startsWith('#'))
      .map(l => l.split('=', 2))
  );
  return { line };
}

const secrets = loadSecrets();

async function testPing() {
  console.log('🧪 Testing LINE webhook with /ping message...\n');
  
  // Realistic LINE webhook payload
  const payload = {
    destination: secrets.line.LINE_USER_ID,
    events: [{
      type: 'message',
      mode: 'active',
      timestamp: Date.now(),
      source: {
        type: 'user',
        userId: 'test_user_123'
      },
      webhookEventId: 'test_webhook_123',
      deliveryContext: {
        isRedelivery: false
      },
      message: {
        id: 'test_msg_123',
        type: 'text',
        text: '/ping'
      },
      replyToken: 'test_reply_token_123'
    }]
  };
  
  console.log('Sending to webhook...');
  const res = await fetch('https://primary-production-14b0.up.railway.app/webhook/kyoen-line-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const text = await res.text();
  console.log(`Status: ${res.status}`);
  console.log(`Response: ${text}`);
  
  console.log('\n⏳ Waiting 3s for processing...');
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('\n✅ Test complete');
}

testPing();


