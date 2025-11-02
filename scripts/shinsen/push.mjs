#!/usr/bin/env node

/**
 * SHINSEN Push
 * Collects #sync:shinsen crystals and pushes to Supabase
 */

import fs from 'node:fs/promises';
import path from 'node:path';

// Simple fetch-based Supabase client (no npm dependency)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function collectCrystals(root) {
  const entries = [];
  
  async function walk(p) {
    try {
      const items = await fs.readdir(p, { withFileTypes: true });
      for (const it of items) {
        const full = path.join(p, it.name);
        if (it.isDirectory()) {
          await walk(full);
        } else if (it.isFile() && it.name.endsWith('.md')) {
          const body = await fs.readFile(full, 'utf8');
          if (body.includes('sync:shinsen')) {
            const title = (body.match(/^#\s+(.+)$/m) || ['', ''])[1];
            const summary = body.slice(0, 2000);
            entries.push({ full, title, summary });
          }
        }
      }
    } catch (err) {
      // Skip inaccessible directories
    }
  }
  
  await walk(root);
  return entries;
}

async function pushToSupabase(entries) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ SUPABASE_URL and SUPABASE_KEY must be set');
    process.exit(1);
  }
  
  const url = `${SUPABASE_URL}/rest/v1/memory_crystals`;
  let pushed = 0;
  
  for (const e of entries) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          kokuyou_path: e.full,
          title: e.title,
          summary: e.summary,
          source_ai: []
        })
      });
      
      if (!res.ok) {
        const text = await res.text();
        console.error(`❌ Failed: ${e.full} (${res.status})`);
        console.error('  ', text);
      } else {
        console.log('✅ Pushed:', e.full);
        pushed++;
      }
    } catch (err) {
      console.error('❌ Error pushing:', e.full, err.message);
    }
  }
  
  return pushed;
}

async function main() {
  const root = '20_CRYSTALLIZATION_KOKUYOU';
  const list = await collectCrystals(root);
  
  if (list.length === 0) {
    console.log('ℹ️  No crystals to push');
    process.exit(0);
  }
  
  console.log(`📦 Found ${list.length} crystals`);
  const pushed = await pushToSupabase(list);
  console.log(`✅ Pushed ${pushed}/${list.length} crystals`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});

