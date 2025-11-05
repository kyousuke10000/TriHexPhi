#!/usr/bin/env node

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
  return { n8n };
}

const secrets = loadSecrets();

async function getDetail() {
  const execId = 396;
  
  const res = await fetch(
    `${secrets.n8n.N8N_API_URL}/executions/${execId}`,
    {
      headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY }
    }
  );
  
  if (!res.ok) {
    console.log(`❌ ${res.status}`);
    return;
  }
  
  const exec = await res.json();
  
  console.log('📋 Execution Detail:');
  console.log(JSON.stringify(exec, null, 2).slice(0, 3000));
}

getDetail();


