#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

function loadSecrets() {
  const n8n = Object.fromEntries(
    readFileSync(join(root, '.secrets/n8n.env'), 'utf8')
      .split('\n')
      .filter(l => l && !l.startsWith('#'))
      .map(l => l.split('=', 2))
  );
  const line = Object.fromEntries(
    readFileSync(join(root, '.secrets/line.env'), 'utf8')
      .split('\n')
      .filter(l => l && !l.startsWith('#'))
      .map(l => l.split('=', 2))
  );
  return { n8n, line };
}

const secrets = loadSecrets();

const workflows = {
  'event-detect': 'x6DDgPh24FLp33am',
  'rsvp': 'Ozw3pPoFy0GsfdOm',
  'reminders': 'kugMQN2qdbuLoIw9',
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
    log.push('🔐 Adding credentials to workflows...');
    
    // LINE Bot Token (assume it exists with ID we can reference)
    // Since we can't list credentials, we'll use inline auth
    
    for (const [name, workflowId] of Object.entries(workflows)) {
      try {
        log.push(`\n📝 ${name}`);
        
        // Get workflow
        const workflow = await n8nRequest('GET', `/workflows/${workflowId}`);
        
        // Find LINE HTTP nodes
        const lineNodes = ['Reply Flex', 'Reply Snack', 'Send DM', 'Reply Cards'];
        let updated = false;
        
        for (const node of workflow.nodes) {
          if (lineNodes.includes(node.name)) {
            // Update header with Bearer token
            if (!node.parameters.headerParameters) {
              node.parameters.headerParameters = { parameters: [] };
            }
            
            // Add/update Authorization header
            const headers = node.parameters.headerParameters.parameters;
            const authIdx = headers.findIndex(h => h.name === 'Authorization');
            
            const authValue = `Bearer ${secrets.line.LINE_CHANNEL_TOKEN}`;
            
            if (authIdx >= 0) {
              headers[authIdx].value = authValue;
            } else {
              headers.push({ name: 'Authorization', value: authValue });
            }
            
            updated = true;
            log.push(`  ✅ ${node.name}: Authorization header set`);
          }
        }
        
        if (updated) {
          // Save workflow
          await n8nRequest('PUT', `/workflows/${workflowId}`, workflow);
          log.push(`✅ Saved`);
        } else {
          log.push(`⚠️ No nodes to update`);
        }
        
      } catch (err) {
        log.push(`❌ Error: ${err.message}`);
      }
    }
    
    log.push('\n✅ Complete');
    return { success: true, log };
  } catch (err) {
    log.push(`❌ Fatal: ${err.message}`);
    return { success: false, log };
  }
}

const result = await main();
console.log(result.log.join('\n'));
process.exit(result.success ? 0 : 1);


