#!/usr/bin/env node

/**
 * Import chat.json to Supabase
 * Purpose: Bulk upsert to line_messages table
 */

import { readFileSync } from 'node:fs';
import { readFileSync as readFile } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read secrets
let SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY;
try {
  const secrets = readFileSync('.secrets/supabase.env', 'utf8');
  SUPABASE_URL = secrets.match(/SUPABASE_URL=(.+)/)?.[1]?.trim();
  SUPABASE_SERVICE_ROLE_KEY = secrets.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
} catch (e) {
  console.error('❌ Could not read secrets');
  process.exit(1);
}

const toUtf8NFC = (s) => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

async function bulkUpsert(messages) {
  console.log(`\n📤 Importing ${messages.length} messages to Supabase...`);
  
  const BATCH_SIZE = 1000;
  let successCount = 0;
  let dupCount = 0;
  
  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const batch = messages.slice(i, i + BATCH_SIZE);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/line_messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(batch.map(m => ({
          group_id: m.group_id,
          "user": m.user,
          text: m.text,
          ts: m.ts,
          hash: m.hash,
          metadata: m.metadata
        })))
      });
      
      if (response.ok) {
        successCount += batch.length;
        console.log(`✅ Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${batch.length} messages`);
      } else {
        const error = await response.text();
        console.error(`❌ Batch failed: ${error}`);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Import complete:`);
  console.log(`   Success: ${successCount}/${messages.length}`);
  
  return { successCount, dupCount };
}

async function main() {
  console.log('📄 Reading chat.json...');
  const messages = JSON.parse(readFileSync('artifacts/line_export/chat.json', 'utf8'));
  
  const result = await bulkUpsert(messages);
  
  return result;
}

main().catch(console.error);

