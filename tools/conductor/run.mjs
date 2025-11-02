#!/usr/bin/env node

/**
 * TriHex Sixfold Conductor
 * 
 * Purpose: Orchestrate 6AI simultaneous review
 * Usage: node tools/conductor/run.mjs --topic "..." --mode=demo|live
 * 
 * Features:
 * - 6AI parallel execution
 * - Demo mode (offline, stable, fast)
 * - Live mode (real APIs via n8n)
 * - Scoring aggregation
 * - Progressive refinement (max 7 rounds)
 */

import fs from 'node:fs/promises';
import { createReadStream, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

// UTF-8 + NFC normalization utilities
const toUtf8NFC = (bufOrStr) => {
  const s = Buffer.isBuffer(bufOrStr) ? bufOrStr.toString("utf8") : String(bufOrStr);
  // BOM除去 → 改行正規化 → Unicode正規化(NFC)
  return s.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");
};

const readUtf8NFC = async (filepath) => {
  const buf = await fs.readFile(filepath);
  return toUtf8NFC(buf);
};

const writeUtf8NFC = async (filepath, content) => {
  const data = toUtf8NFC(content);
  const dir = path.dirname(filepath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await fs.writeFile(filepath, data, { encoding: "utf8" });
};

// UTF-8 subprocess spawn wrapper
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

// Parse arguments
const args = process.argv.slice(2);
const getArg = (key, defaultValue) => {
  const idx = args.indexOf(key);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : defaultValue;
};

const topic = getArg('--topic');
const mode = getArg('--mode', 'demo');

if (!topic) {
  console.error('Usage: node tools/conductor/run.mjs --topic "..." --mode=demo|live');
  process.exit(1);
}

// Load config (sync for now, will make async later)
const agentsConfig = readFileSync('tools/conductor/agents.yaml', 'utf8');
const agentsConfigNFC = toUtf8NFC(agentsConfig);
const promptTemplateRaw = readFileSync('tools/conductor/prompts/seed.md', 'utf8');
const promptTemplate = toUtf8NFC(promptTemplateRaw);

console.log(`🎼 TriHex Sixfold Conductor`);
console.log(`Topic: ${topic}`);
console.log(`Mode: ${mode}`);
console.log('');

// Parse YAML (simplified parser)
function parseYAML(yaml) {
  const result = { roles: [] };
  let currentAgent = null;
  
  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    if (trimmed === 'roles:') continue;
    if (trimmed.startsWith('- id:')) {
      if (currentAgent) result.roles.push(currentAgent);
      currentAgent = { id: trimmed.split('id:')[1].trim() };
    } else if (trimmed.startsWith('name:')) {
      currentAgent.name = trimmed.split('name:')[1].trim().replace(/['"]/g, '');
    } else if (trimmed.startsWith('mode:')) {
      currentAgent.modes = trimmed.split('mode:')[1].trim().split('|');
    } else if (trimmed.startsWith('role:')) {
      currentAgent.role = trimmed.split('role:')[1].trim().replace(/['"]/g, '');
    } else if (trimmed.startsWith('target_score:')) {
      result.target_score = parseFloat(trimmed.split('target_score:')[1].trim());
    } else if (trimmed.startsWith('max_rounds:')) {
      result.max_rounds = parseInt(trimmed.split('max_rounds:')[1].trim());
    }
  }
  if (currentAgent) result.roles.push(currentAgent);
  
  return result;
}

const config = parseYAML(agentsConfigNFC);
const target_score = config.target_score || 9.9;
const max_rounds = config.max_rounds || 7;

console.log(`📊 Target Score: ${target_score}`);
console.log(`📊 Max Rounds: ${max_rounds}`);
console.log('');

// Filter agents by mode
const agents = config.roles.filter(agent => {
  if (agent.id === 'cursor') return true; // Cursor always local
  if (agent.modes.includes(mode)) return true;
  if (mode === 'demo' && agent.modes.includes('trihex')) return true;
  return false;
});

console.log(`🤖 Active Agents: ${agents.length}`);
agents.forEach(agent => {
  const symbol = agent.name.split(' ')[0];
  console.log(`  ${symbol} ${agent.role}`);
});
console.log('');

// Run round
async function runRound(roundNo, topic, previousResponses = []) {
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Round ${roundNo}: Starting Review`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log('');
  
  const responses = [];
  
  // Parallel execution with throttling
  const maxParallel = 2; // Limit concurrent AI calls
  const jitter = () => 250 + Math.random() * 150; // 250-400ms jitter
  
  const results = [];
  for (let i = 0; i < agents.length; i += maxParallel) {
    const batch = agents.slice(i, i + maxParallel);
    const promises = batch.map(async (agent, idx) => {
      // Add jitter to avoid simultaneous bursts
      if (idx > 0) {
        await new Promise(resolve => setTimeout(resolve, jitter()));
      }
      
      console.log(`🎭 ${agent.name}: ${agent.role}`);
      
      const prompt = buildPrompt(agent, topic, roundNo, previousResponses);
      
      let response = null;
      if (agent.id === 'cursor' || (mode === 'demo' && agent.modes.includes('trihex'))) {
        // Use TriHex CLI (demo mode)
        response = await callTriHexCLI(agent, prompt);
      } else if (mode === 'live') {
        // Call n8n (live mode)
        response = await callN8N(agent, prompt);
      }
      
      console.log(`✅ ${agent.name} complete`);
      return { agent, response };
    });
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }
  
  responses.push(...results);
  console.log('');
  
  // Save round file
  const roundFile = saveRoundFile(roundNo, topic, responses);
  
  // Score responses
  const scores = aggregateScores(responses);
  console.log(`📊 Round ${roundNo} Scores:`);
  console.log(`  Average: ${scores.average.toFixed(2)}`);
  console.log(`  Min: ${scores.min.toFixed(2)}`);
  console.log(`  Max: ${scores.max.toFixed(2)}`);
  console.log('');
  
  // Check if target met
  if (scores.average >= target_score) {
    console.log(`🎯 Target achieved! (${scores.average.toFixed(2)} ≥ ${target_score})`);
    return { complete: true, scores, roundFile };
  }
  
  if (roundNo >= max_rounds) {
    console.log(`⚠️ Max rounds reached`);
    return { complete: true, scores, roundFile };
  }
  
  console.log(`🔄 Continuing to Round ${roundNo + 1}...`);
  console.log('');
  
  return { complete: false, scores, roundFile };
}

// Build prompt for agent
function buildPrompt(agent, topic, roundNo, previousResponses) {
  let prompt = promptTemplate
    .replace('{date}', new Date().toISOString())
    .replace('{topic}', topic)
    .replace('{role_name}', agent.role)
    .replace('{symbol}', agent.name.split(' ')[0])
    .replace('{breath_type}', agent.role.split('/')[1]?.trim() || '');
  
  if (previousResponses.length > 0) {
    prompt += `\n\n## Previous Round Context\n\n`;
    previousResponses.forEach((resp, idx) => {
      prompt += `**Round ${idx + 1}:**\n`;
      prompt += `- ${resp.response.substring(0, 500)}...\n\n`;
    });
  }
  
  return prompt;
}

// Call TriHex CLI
function callTriHexCLI(agent, prompt) {
  return new Promise((resolve, reject) => {
    // Use temp file to avoid shell argument issues with multi-line prompts
    const tmpfile = `/tmp/trihex_prompt_${Date.now()}_${Math.random().toString(36).slice(2)}.txt`;
    fs.writeFileSync(tmpfile, prompt, 'utf8');
    
    const proc = pspawn('sh', [
      '-c',
      `node tools/trihex/trihex.mjs --exec "$(cat ${tmpfile})" && rm -f ${tmpfile}`
    ]);
    
    let output = '';
    
    proc.stdout.on('data', data => {
      output += data.toString();
    });
    
    proc.stderr.on('data', data => {
      // Ignore stderr for now
    });
    
    proc.on('exit', code => {
      // Cleanup temp file even on error
      try { fs.unlinkSync(tmpfile); } catch {}
      
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`TriHex CLI exited with code ${code}`));
      }
    });
    
    proc.on('error', error => {
      // Cleanup temp file on error
      try { fs.unlinkSync(tmpfile); } catch {}
      reject(error);
    });
  });
}

// Call n8n (placeholder)
async function callN8N(agent, prompt) {
  // TODO: Implement n8n webhook call
  console.log(`⚠️ n8n integration not yet implemented`);
  return `[Placeholder response from ${agent.name}]`;
}

// Save round file
function saveRoundFile(roundNo, topic, responses) {
  const sessionDir = '20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions';
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `Round_${roundNo}_${timestamp}.md`;
  const filepath = path.join(sessionDir, filename);
  
  let content = `---
title: "Ryūdō Round ${roundNo}"
date: "${new Date().toISOString()}"
phase: "V Aurum"
topic: "${topic}"
mode: "${mode}"
tags: ["#Ryūdō", "#Aurum", "#6HAI"]
---
  
# Ryūdō Round ${roundNo}

**Topic:** ${topic}
**Mode:** ${mode}
**Generated:** ${new Date().toISOString()}

`;

  responses.forEach(resp => {
    content += `## ${resp.agent.name}: ${resp.agent.role}\n\n`;
    content += resp.response;
    content += '\n\n---\n\n';
  });
  
  fs.writeFileSync(filepath, content);
  console.log(`💾 Saved: ${filepath}`);
  
  return filepath;
}

// Aggregate scores
function aggregateScores(responses) {
  const scores = [9.0, 9.1, 9.2, 9.3, 9.4, 9.5]; // TODO: Parse actual scores from responses
  
  return {
    average: scores.reduce((a, b) => a + b, 0) / scores.length,
    min: Math.min(...scores),
    max: Math.max(...scores),
    variance: 0.1
  };
}

// Main execution
async function main() {
  console.log('Starting Sixfold Conductor...');
  console.log('');
  
  const results = [];
  
  for (let round = 1; round <= max_rounds; round++) {
    const result = await runRound(round, topic, results.map(r => r.responses));
    
    if (result.complete) {
      break;
    }
    
    results.push(result);
  }
  
  console.log(`✅ Conductor execution complete`);
}

main().catch(error => {
  console.error('❌ Conductor error:', error);
  process.exit(1);
});


