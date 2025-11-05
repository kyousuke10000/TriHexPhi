#!/usr/bin/env node

/**
 * Recover deleted n8n workflows from 10_TriHexCore/tools/workflows/
 */

import { readFileSync, readdirSync } from 'node:fs';
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
  return { n8n };
}

const secrets = loadSecrets();

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
  
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path}: ${res.status} ${text}`);
  }
  return res.json();
}

async function recover() {
  console.log('🔄 Recovering deleted workflows...\n');
  
  const dir = join(root, '10_TriHexCore/tools/workflows');
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  
  console.log(`Found ${files.length} workflows to recover\n`);
  
  for (const file of files) {
    try {
      const content = JSON.parse(readFileSync(join(dir, file), 'utf8'));
      console.log(`📦 ${content.name}`);
      
      // Clean workflow (remove read-only fields)
      const clean = {
        name: content.name,
        nodes: content.nodes,
        connections: content.connections,
        settings: content.settings,
        staticData: content.staticData
      };
      
      const result = await n8nRequest('POST', '/workflows', clean);
      console.log(`  ✅ Recovered: ${result.id}\n`);
    } catch (err) {
      console.log(`  ❌ Failed: ${err.message}\n`);
    }
  }
  
  console.log('✅ Recovery complete');
}

recover();


