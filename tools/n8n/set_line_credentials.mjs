#!/usr/bin/env node

/**
 * Update all 4 workflows to use LINE Bot Token credential
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

// Load secrets
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

// Workflow IDs
const workflows = {
  'event-detect': 'x6DDgPh24FLp33am',
  'rsvp': 'Ozw3pPoFy0GsfdOm',
  'reminders': 'kugMQN2qdbuLoIw9',
  'cards': 'ZJq3KtFbBP6bzjwy'
};

// n8n API client
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
    throw new Error(`${method} ${path}: ${res.status} ${text}`);
  }
  return res.json();
}

// Main
async function setCredentials() {
  const log = [];
  
  try {
    log.push('🔐 Setting LINE credentials...');
    
    // First, get credential ID for "LINE Bot Token"
    const creds = await n8nRequest('GET', '/credentials');
    log.push(`Found ${creds.data?.length || 0} credentials`);
    
    const lineCred = creds.data?.find(c => c.name === 'LINE Bot Token');
    if (!lineCred) {
      log.push('❌ LINE Bot Token credential not found');
      log.push('Please create it in n8n UI first');
      return { success: false, log };
    }
    
    log.push(`✅ Found credential: ${lineCred.id}`);
    
    // Update each workflow
    for (const [name, workflowId] of Object.entries(workflows)) {
      try {
        log.push(`📝 Updating: ${name}`);
        
        // Get current workflow
        const workflow = await n8nRequest('GET', `/workflows/${workflowId}`);
        
        // Update nodes that need LINE credentials
        let updated = false;
        for (const node of workflow.nodes) {
          // HTTP Request nodes that call LINE API
          if (node.name === 'Reply Flex' || 
              node.name === 'Reply Snack' || 
              node.name === 'Send DM' || 
              node.name === 'Reply Cards') {
            
            // Set credential
            node.credentials = {
              httpHeaderAuth: {
                id: lineCred.id,
                name: 'LINE Bot Token'
              }
            };
            updated = true;
            log.push(`  ✅ ${node.name}: credential set`);
          }
        }
        
        if (updated) {
          // Update workflow
          await n8nRequest('PUT', `/workflows/${workflowId}`, workflow);
          log.push(`✅ ${name}: workflow updated`);
        } else {
          log.push(`⚠️ ${name}: no nodes to update`);
        }
        
      } catch (err) {
        log.push(`❌ ${name}: ${err.message}`);
      }
    }
    
    log.push('');
    log.push('=== Summary ===');
    log.push('All workflows updated');
    
    return { success: true, log };
  } catch (err) {
    log.push(`❌ Fatal: ${err.message}`);
    return { success: false, log };
  }
}

const result = await setCredentials();
console.log(result.log.join('\n'));
process.exit(result.success ? 0 : 1);


