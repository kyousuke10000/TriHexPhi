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

async function checkLastError() {
  const res = await fetch(
    `${secrets.n8n.N8N_API_URL}/executions?limit=5`,
    {
      headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY }
    }
  );
  const data = await res.json();
  
  console.log('🔍 Last 5 executions:\n');
  for (const exec of data.data) {
    const status = exec.finished ? '❌' : exec.waitTill ? '⏳' : '✅';
    const mode = exec.mode || 'unknown';
    const started = new Date(exec.startedAt).toLocaleTimeString('ja-JP');
    
    console.log(`${status} ${exec.workflowName || 'Unknown'}`);
    console.log(`   ID: ${exec.id}`);
    console.log(`   Started: ${started}`);
    console.log(`   Mode: ${mode}`);
    console.log(`   Finished: ${exec.finished ? 'YES' : 'NO'}`);
    
    if (exec.finished && exec.data?.resultData?.error) {
      console.log(`\n   🚨 ERROR:`);
      const error = exec.data.resultData.error;
      console.log(`   ${error.message}`);
      if (error.name) console.log(`   Name: ${error.name}`);
      if (error.stack) {
        const stack = error.stack.split('\n').slice(0, 3);
        stack.forEach(s => console.log(`   ${s.trim()}`));
      }
    }
    
    console.log('');
    
    // Get full details for first item
    if (exec.id === data.data[0].id) {
      const detailRes = await fetch(
        `${secrets.n8n.N8N_API_URL}/executions/${exec.id}`,
        {
          headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY }
        }
      );
      const detail = await detailRes.json();
      
      console.log('📊 Full details:');
      console.log(JSON.stringify(detail, null, 2).slice(0, 2000));
    }
  }
}

checkLastError();

