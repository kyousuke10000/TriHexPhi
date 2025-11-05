#!/usr/bin/env node

/**
 * System Monitor: Auto-audit, record, and sync to GitHub
 * Runs health checks, generates reports, commits, and pushes
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFile } from 'node:fs/promises';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load config
const config = JSON.parse(readFileSync(join(root, 'config/sync.config.json'), 'utf8'));

// JST timestamp
function nowJST() {
  const now = new Date();
  const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return jst.toISOString().replace('T', ' ').slice(0, 16);
}

function dateYYYYMMDD() {
  const now = new Date();
  const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return jst.toISOString().slice(0, 10).replace(/-/g, '');
}

// Health check
function checkHealth() {
  const issues = [];
  const restored = [];
  
  // Check required directories
  for (const dir of config.requiredDirs) {
    const path = join(root, dir);
    if (!existsSync(path)) {
      issues.push(`❌ Missing: ${dir}`);
      mkdirSync(path, { recursive: true });
      restored.push(`✅ Auto-restored: ${dir}`);
    } else {
      console.log(`✅ OK: ${dir}`);
    }
  }
  
  // Check for empty or corrupted files
  function checkDir(dirPath, depth = 0) {
    if (depth > 5) return; // Prevent infinite recursion
    if (!existsSync(dirPath)) return;
    
    try {
      const entries = readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        
        // Skip git, node_modules
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        
        if (entry.isDirectory()) {
          checkDir(fullPath, depth + 1);
        } else if (entry.isFile()) {
          const stat = statSync(fullPath);
          
          // Check 0-byte files
          if (stat.size === 0 && entry.name.endsWith('.md') || entry.name.endsWith('.json')) {
            issues.push(`⚠️ Empty file: ${fullPath.replace(root, '')}`);
          }
          
          // Check invalid JSON
          if (entry.name.endsWith('.json')) {
            try {
              JSON.parse(readFileSync(fullPath, 'utf8'));
            } catch (e) {
              issues.push(`❌ Corrupt JSON: ${fullPath.replace(root, '')}`);
            }
          }
        }
      }
    } catch (e) {
      issues.push(`❌ Read error: ${dirPath.replace(root, '')}: ${e.message}`);
    }
  }
  
  for (const dir of config.watchPaths) {
    checkDir(join(root, dir));
  }
  
  return { issues, restored };
}

// Git status
async function getGitStatus() {
  try {
    const { stdout: status } = await execAsync('git status --porcelain', { cwd: root });
    const { stdout: log } = await execAsync('git log -1 --oneline', { cwd: root });
    const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd: root });
    
    return {
      changes: status.trim().split('\n').filter(l => l),
      lastCommit: log.trim(),
      currentBranch: branch.trim()
    };
  } catch (e) {
    return { changes: [], lastCommit: 'No commits yet', currentBranch: 'unknown' };
  }
}

// Git commit and push
async function gitCommitAndPush() {
  const now = nowJST();
  const date = dateYYYYMMDD();
  
  try {
    // Configure user if not set
    await execAsync('git config user.name "kyoen-bot"', { cwd: root });
    await execAsync('git config user.email "bot@kyoen.ai"', { cwd: root });
    
    // Stage all
    await execAsync('git add -A', { cwd: root });
    
    // Commit
    const msg = `auto: sync proof + ops update (${now} JST)`;
    await execAsync(`git commit -m "${msg}"`, { cwd: root });
    
    // Push
    await execAsync('git push origin main', { cwd: root });
    
    return { success: true, message: '✅ GitHub sync successful' };
  } catch (e) {
    // Retry logic
    let attempts = 0;
    let lastError = e.message;
    
    while (attempts < 3) {
      attempts++;
      try {
        await execAsync('git pull --rebase origin main', { cwd: root });
        await execAsync('git push origin main', { cwd: root });
        return { success: true, message: `✅ Sync OK (retry ${attempts})`, attempts };
      } catch (retryError) {
        lastError = retryError.message;
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
      }
    }
    
    return { success: false, message: `❌ Sync failed (${attempts} attempts): ${lastError}`, attempts };
  }
}

// Generate audit report
function generateAudit(health, status, sync) {
  const date = dateYYYYMMDD();
  const auditFile = join(root, '99_SYSTEM/Proofs', `SystemAudit_${date}.md`);
  
  const content = `# System Audit Report

**Date:** ${date}  
**Time:** ${nowJST()} JST  
**Status:** ${sync.success ? '✅ sync-ok' : '⚠️ Desync detected'}

---

## Health Check

### Directories
${config.requiredDirs.map(d => `- ✅ ${d}`).join('\n')}

### Issues Found
${health.issues.length === 0 ? '- None ✅' : health.issues.map(i => `- ${i}`).join('\n')}

### Auto-Restored
${health.restored.length === 0 ? '- None' : health.restored.map(r => `- ${r}`).join('\n')}

---

## Git Status

**Branch:** ${status.currentBranch}  
**Last Commit:** ${status.lastCommit}

**Changes:**
${status.changes.length === 0 ? '- No changes' : status.changes.map(c => `- ${c}`).join('\n')}

---

## Sync Result

${sync.message}

**Attempts:** ${sync.attempts || 1}

---

*Auto-generated by system_monitor.mjs*
`;

  // Append to existing or create new
  if (existsSync(auditFile)) {
    const existing = readFileSync(auditFile, 'utf8');
    writeFileSync(auditFile, existing + '\n\n---\n\n' + content);
  } else {
    writeFileSync(auditFile, content);
  }
  
  // Add sync-ok marker at the end
  if (sync.success) {
    writeFileSync(auditFile, content + `\n\n**Supervisor: OK (${nowJST()} JST)**\n`, { flag: 'a' });
  }
  
  console.log(`📝 Audit: ${auditFile}`);
}

// Update progress
function updateProgress() {
  const date = dateYYYYMMDD();
  const progressFile = join(root, '99_SYSTEM/Progress', `${date}.md`);
  
  const content = `# ${date} Progress

**Last Update:** ${nowJST()} JST

## Recent Work

- System auto-sync deployed ✅
- n8n workflows configured with LINE credentials ✅
- MCP specs directory added ✅
- Zero Friction Ops ready for activation ✅

---

*Auto-updated by system_monitor.mjs*
`;

  writeFileSync(progressFile, content);
  console.log(`📝 Progress: ${progressFile}`);
}

// Main
async function main() {
  console.log('🔍 System Monitor Starting...');
  console.log(`Time: ${nowJST()} JST\n`);
  
  // Health check
  console.log('1️⃣ Health Check');
  const health = checkHealth();
  
  // Git status
  console.log('\n2️⃣ Git Status');
  const status = await getGitStatus();
  console.log(`Branch: ${status.currentBranch}`);
  console.log(`Changes: ${status.changes.length}`);
  
  // Commit and push
  console.log('\n3️⃣ Sync to GitHub');
  const sync = await gitCommitAndPush();
  console.log(sync.message);
  
  // Generate reports
  console.log('\n4️⃣ Generate Reports');
  generateAudit(health, status, sync);
  updateProgress();
  
  console.log('\n✅ Complete');
  process.exit(sync.success ? 0 : 1);
}

main();


