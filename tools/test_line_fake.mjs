#!/usr/bin/env node

/**
 * Test LINE webhook with fake event
 * Usage: node tools/test_line_fake.mjs [--env=prod]
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const env = args.find(a => a.startsWith('--env='))?.split('=')[1] || 'stg';

const WEBHOOKS = {
  stg: 'https://primary-production-14b0.up.railway.app/webhook/kyoen-line-in',
  prod: 'https://primary-production-14b0.up.railway.app/webhook/kyoen-line-in'
};

const URL = WEBHOOKS[env] || WEBHOOKS.stg;

async function test() {
  console.log(`🧪 Testing LINE webhook (${env})...`);
  console.log(`URL: ${URL}\n`);

  const fakeEvent = {
    events: [{
      type: 'message',
      replyToken: 'fake_reply_token',
      timestamp: Date.now(),
      source: {
        type: 'group',
        groupId: 'fake_group_id'
      },
      message: {
        id: 'fake_message_id',
        type: 'text',
        text: '2025-11-15 19:00 Test Meeting https://zoom.us/j/123456?pwd=test123'
      }
    }]
  };

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fakeEvent)
    });
    
    const text = await res.text();
    
    if (res.ok && text.includes('started')) {
      console.log('✅ PASS: Workflow started');
      process.exit(0);
    } else {
      console.log(`❌ FAIL: ${res.status}`);
      console.log(`Response: ${text}`);
      process.exit(1);
    }
  } catch (err) {
    console.log(`❌ ERROR: ${err.message}`);
    process.exit(1);
  }
}

test();


