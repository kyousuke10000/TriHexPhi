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

async function getExecutions(workflowId) {
  const url = secrets.n8n.N8N_API_URL || secrets.n8n.N8N_URL + '/api/v1';
  const res = await fetch(`${url}/workflows/${workflowId}/executions?limit=5`, {
    headers: { 'X-N8N-API-KEY': secrets.n8n.N8N_API_KEY }
  });
  if (!res.ok) {
    const text = await res.text();
    console.log(`Failed for ${workflowId}: ${res.status} ${text}`);
    return [];
  }
  const data = await res.json();
  return data.data || [];
}

async function main() {
  const workflows = [
    { id: 'x6DDgPh24FLp33am', name: 'event-detect' }
  ];

  for (const wf of workflows) {
    const execs = await getExecutions(wf.id);
    console.log(`\n${wf.name}:`);
    execs.forEach(e => {
      console.log(`  ${e.startedAt}: ${e.finished ? '✅' : '⏳'} ${e.mode} - ${e.stoppedAt || 'N/A'}`);
      if (e.data?.resultData?.error) {
        console.log(`    Error: ${JSON.stringify(e.data.resultData.error)}`);
      }
    });
  }
}

main();

