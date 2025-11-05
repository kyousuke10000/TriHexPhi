#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadSecrets() {
  const n8n = Object.fromEntries(
    readFileSync(join(root, '..', '.secrets/n8n.env'), 'utf8')
      .split('\n')
      .filter(l => l && !l.startsWith('#'))
      .map(l => l.split('=', 2))
  );
  return { n8n };
}

const secrets = loadSecrets();

const workflows = {
  'event-detect': 'x6DDgPh24FLp33am',
  'rsvp': 'Ozw3pPoFy0GsfdOm',
  'cards': 'ZJq3KtFbBP6bzjwy'
};

async function n8nRequest(method, path, body) {
  const url = `${secrets.n8n.N8N_API_URL}${path}`;
  const opts = {
    method,
    headers: {
      'X-N8N-API-KEY': secrets.n8n.N8N_API_TOKEN,
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);
  
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.json();
}

async function main() {
  const log = [];
  
  try {
    log.push('🔧 Fixing webhook methods...\n');
    
    for (const [name, workflowId] of Object.entries(workflows)) {
      try {
        log.push(`📝 ${name}`);
        
        const workflow = await n8nRequest('GET', `/workflows/${workflowId}`);
        
        const clean = {
          name: workflow.name,
          nodes: workflow.nodes,
          connections: workflow.connections,
          settings: workflow.settings,
          staticData: workflow.staticData
        };
        
        // Fix webhook nodes to accept POST
        for (const node of clean.nodes) {
          if (node.type === 'n8n-nodes-base.webhook') {
            node.parameters = {
              httpMethod: 'POST',
              path: node.webhookId
            };
            log.push(`  ✅ Set POST: ${node.webhookId}`);
          }
        }
        
        await n8nRequest('PUT', `/workflows/${workflowId}`, clean);
        log.push(`✅ Saved\n`);
        
      } catch (err) {
        log.push(`❌ ${err.message}\n`);
      }
    }
    
    log.push('✅ Complete');
    return { success: true, log };
  } catch (err) {
    log.push(`❌ Fatal: ${err.message}`);
    return { success: false, log };
  }
}

const result = await main();
console.log(result.log.join(''));
process.exit(result.success ? 0 : 1);


