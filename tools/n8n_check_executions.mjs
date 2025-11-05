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

async function checkExecutions() {
  console.log('🔍 Checking recent executions...\n');
  
  // Get event-detect workflow
  const wfId = 'z80YkaQJp2MYnfxS';
  const res = await fetch(
    `${secrets.n8n.N8N_API_URL}/executions?workflowId=${wfId}&limit=5`,
    {
      headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY }
    }
  );
  
  if (!res.ok) {
    console.log(`❌ ${res.status}: ${await res.text()}`);
    return;
  }
  
  const data = await res.json();
  const executions = data.data || [];
  
  console.log(`Found ${executions.length} recent executions\n`);
  
  for (const exec of executions) {
    console.log(`📋 ${exec.mode || 'unknown'} ${exec.finished ? '✅' : exec.waitTill ? '⏳' : '❌'}`);
    console.log(`   ID: ${exec.id}`);
    console.log(`   Started: ${new Date(exec.startedAt).toLocaleString('ja-JP')}`);
    console.log(`   Finished: ${exec.finished}`);
    
    if (!exec.finished && exec.data && exec.data.resultData && exec.data.resultData.error) {
      const error = exec.data.resultData.error;
      console.log(`   🚨 Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Get workflow status
  console.log('\n📊 Workflow status:');
  const wfRes = await fetch(
    `${secrets.n8n.N8N_API_URL}/workflows/${wfId}`,
    {
      headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY }
    }
  );
  
  if (wfRes.ok) {
    const wf = await wfRes.json();
    console.log(`   Name: ${wf.name}`);
    console.log(`   Active: ${wf.active ? '✅ YES' : '❌ NO'}`);
  }
}

checkExecutions();


