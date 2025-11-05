#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load env
const n8nEnv = Object.fromEntries(
  readFileSync(join(root, '.secrets/n8n.env'), 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=', 2))
);

const BASE_URL = n8nEnv.N8N_API_URL;

async function fetchExecutions(workflowId, limit = 50) {
  try {
    const res = await fetch(`${BASE_URL}/workflows/${workflowId}/executions?limit=${limit}`, {
      headers: { 'X-N8N-API-KEY': n8nEnv.N8N_API_TOKEN }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    return [];
  }
}

function nowJST() {
  const now = new Date();
  const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return jst.toISOString().replace('T', ' ').slice(0, 16);
}

function dateYYYYMMDD() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

async function main() {
  const workflows = [
    { id: 'x6DDgPh24FLp33am', name: 'event-detect' },
    { id: 'Ozw3pPoFy0GsfdOm', name: 'rsvp' },
    { id: 'kugMQN2qdbuLoIw9', name: 'reminders' },
    { id: 'ZJq3KtFbBP6bzjwy', name: 'cards' }
  ];

  console.log('🔍 Auditing n8n executions...\n');

  const report = [];
  report.push('# LINE Webhook Audit');
  report.push('');
  report.push(`**Date:** ${dateYYYYMMDD()} ${nowJST()}`);
  report.push('');
  report.push('---');
  report.push('');

  for (const wf of workflows) {
    report.push(`## ${wf.name} (${wf.id})`);
    report.push('');

    const execs = await fetchExecutions(wf.id, 20);
    const recent = execs.filter(e => {
      const execDate = new Date(e.startedAt);
      const thirtyMinAgo = new Date(Date.now() - (30 * 60 * 1000));
      return execDate > thirtyMinAgo;
    });

    report.push(`**Recent (last 30m):** ${recent.length}`);
    report.push('');

    if (recent.length > 0) {
      for (const ex of recent.slice(0, 5)) {
        report.push(`- ${ex.startedAt}: ${ex.finished ? '✅ Done' : '⏳ Running'} - ${ex.mode}`);
      }
    } else {
      report.push('⚠️ **No executions in last 30 minutes**');
    }

    report.push('');
  }

  const output = join(root, '99_SYSTEM/Proofs', `LINE_Webhook_Audit_${dateYYYYMMDD()}_${nowJST().slice(11, 13)}${nowJST().slice(14, 16)}.md`);
  writeFileSync(output, report.join('\n'));
  console.log(`✅ Audit: ${output}`);
}

main();


