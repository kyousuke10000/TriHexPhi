#!/usr/bin/env node

/**
 * Ryudo Router - Discussion → Conductor Bridge
 * Usage: node scripts/ryudo/router.mjs --mode {live|demo} [--topic "Topic"]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

// UTF-8 + NFC normalization
const toUtf8NFC = (s) => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

// UTF-8 subprocess wrapper
function pspawn(cmd, args, opts = {}) {
  const env = { ...process.env, LANG: "C.UTF-8", LC_ALL: "C.UTF-8" };
  const ps = spawn(cmd, args, { 
    stdio: ["pipe", "pipe", "pipe"], 
    env: { ...env, ...opts.env },
    ...opts 
  });
  ps.stdout.setEncoding("utf8");
  ps.stderr.setEncoding("utf8");
  return ps;
}

// Simple logging
async function log(message, file = '99_SYSTEM/Logs/ryudo_router_run.log') {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  await fs.appendFile(file, toUtf8NFC(logLine), 'utf8');
  console.log(message);
}

// Parse arguments
const args = process.argv.slice(2);
const getArg = (key, defaultValue) => {
  const idx = args.indexOf(key);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : defaultValue;
};

const mode = getArg('--mode', 'demo');
const topic = getArg('--topic', '');

if (!topic && mode === 'live') {
  console.error('❌ --topic required for live mode');
  process.exit(1);
}

// Main execution
async function main() {
  await log(`🎼 Ryudo Router starting: mode=${mode}, topic="${topic.substring(0, 50)}..."`);
  
  try {
    if (mode === 'live') {
      await log('→ Attempting live mode...');
      
      // Check secrets
      const hasClaudeKey = !!process.env.CLAUDE_API_KEY;
      const hasN8nUrl = !!process.env.N8N_RYUDO_INGEST_URL;
      
      await log(`  Secrets check: CLAUDE_API_KEY=${hasClaudeKey ? 'OK' : 'MISSING'}, N8N_URL=${hasN8nUrl ? 'OK' : 'MISSING'}`);
      
      if (!hasClaudeKey && !hasN8nUrl) {
        throw new Error('Missing live mode secrets, falling back to demo');
      }
      
      // Live mode would call n8n or Claude API here
      await log('⚠️  Live mode not fully implemented, falling back to demo');
      await runDemo();
    } else {
      await runDemo();
    }
  } catch (error) {
    await log(`❌ Live mode failed: ${error.message}`);
    await log('→ Falling back to demo mode...');
    await runDemo();
  }
  
  await log('✅ Ryudo Router complete');
}

async function runDemo() {
  await log('🎭 Running demo mode...');
  
  // Use Conductor demo mode
  const topicArg = topic || 'Sample Review Topic';
  
  return new Promise((resolve, reject) => {
    const proc = pspawn('node', [
      'tools/conductor/run.mjs',
      '--topic', topicArg,
      '--mode', 'demo'
    ]);
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', data => {
      stdout += data.toString();
      console.log(data.toString().trim());
    });
    
    proc.stderr.on('data', data => {
      stderr += data.toString();
    });
    
    proc.on('exit', async code => {
      await log(`Conductor exit code: ${code}`);
      
      if (code === 0) {
        await log('✅ Demo mode complete');
        resolve();
      } else {
        await log(`⚠️  Demo mode exited with code ${code}`);
        resolve(); // Continue anyway
      }
    });
    
    proc.on('error', async error => {
      await log(`❌ Demo mode error: ${error.message}`);
      reject(error);
    });
  });
}

main().catch(async error => {
  await log(`Fatal error: ${error.message}`);
  process.exit(1);
});

