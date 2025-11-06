#!/usr/bin/env node

/**
 * Import JSON workflows to n8n
 * Usage: N8N_BASE_URL=... N8N_API_KEY=... node tools/n8n-import.mjs [--env=prod]
 */

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load env
const BASE_URL = process.env.N8N_BASE_URL || process.env.N8N_API_URL;
const API_KEY = process.env.N8N_API_KEY || process.env.N8N_API_TOKEN;

if (!BASE_URL || !API_KEY) {
  console.error('❌ Missing N8N_BASE_URL and N8N_API_KEY');
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
const env = args.find(a => a.startsWith('--env='))?.split('=')[1] || 'stg';

async function n8nRequest(method, path, body) {
  const url = `${BASE_URL}${path}`;
  const opts = {
    method,
    headers: {
      'X-N8N-API-KEY': API_KEY,
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

async function findExisting(name) {
  const { data } = await n8nRequest('GET', '/workflows');
  return data.find(w => w.name === name);
}

async function deployWorkflow(filePath) {
  const workflow = JSON.parse(readFileSync(filePath, 'utf8'));
  const name = basename(filePath, '.json');
  
  console.log(`\n📦 ${name}`);
  
  // Find existing
  const existing = await findExisting(workflow.name);
  
  if (existing) {
    // Update
    console.log(`  Found existing: ${existing.id}`);
    await n8nRequest('PUT', `/workflows/${existing.id}`, {
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: workflow.settings,
      staticData: workflow.staticData
    });
    console.log(`  ✅ Updated`);
  } else {
    // Create
    const result = await n8nRequest('POST', '/workflows', workflow);
    console.log(`  ✅ Created: ${result.id}`);
  }
}

async function main() {
  console.log(`🚀 Importing workflows to ${env}...`);
  console.log(`Base URL: ${BASE_URL}\n`);

  const dir = join(root, 'workflows');
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.error('❌ No workflows found in workflows/');
    process.exit(1);
  }

  console.log(`Found ${files.length} workflows\n`);

  for (const file of files) {
    try {
      await deployWorkflow(join(dir, file));
    } catch (err) {
      console.error(`❌ Failed: ${err.message}`);
      process.exit(1);
    }
  }

  console.log(`\n✅ Deployed ${files.length} workflows`);
}

main();

