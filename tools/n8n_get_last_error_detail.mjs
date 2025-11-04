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

async function getErrorDetail() {
  const res = await fetch(
    `${secrets.n8n.N8N_API_URL}/executions/399`,
    { headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY } }
  );
  
  const exec = await res.json();
  console.log('Full execution data:');
  console.log(JSON.stringify(exec, null, 2));
}

getErrorDetail();


