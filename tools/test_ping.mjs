#!/usr/bin/env node

/**
 * Test webhook ping
 * Usage: node tools/test_ping.mjs [--env=prod]
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const env = args.find(a => a.startsWith('--env='))?.split('=')[1] || 'stg';

// Webhook URLs
const WEBHOOKS = {
  stg: 'https://primary-production-14b0.up.railway.app/webhook/ping',
  prod: 'https://primary-production-14b0.up.railway.app/webhook/ping'
};

const URL = WEBHOOKS[env] || WEBHOOKS.stg;

async function test() {
  console.log(`🧪 Testing ${env} webhook...`);
  console.log(`URL: ${URL}\n`);

  try {
    const res = await fetch(URL, { method: 'GET' });
    const text = await res.text();
    
    if (res.ok && (text.includes('pong') || text.includes('started'))) {
      console.log('✅ PASS: 200 OK');
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


