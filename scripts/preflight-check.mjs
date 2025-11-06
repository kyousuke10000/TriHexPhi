#!/usr/bin/env node

/**
 * Preflight Environment Check
 * Usage: node scripts/preflight-check.mjs
 */

import { spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const exec = promisify(spawn);

async function checkNode() {
  const version = process.version;
  console.log(`✅ Node.js: ${version}`);
  return version.startsWith('v18') || version.startsWith('v20') || version.startsWith('v22');
}

async function checkPermissions() {
  try {
    await fs.access('tools', fs.constants.R_OK | fs.constants.W_OK);
    await fs.access('scripts', fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK);
    console.log('✅ Permissions: OK');
    return true;
  } catch (error) {
    console.error('❌ Permissions: FAILED');
    return false;
  }
}

async function checkSecrets() {
  // ワークフローで実際に使用されている必須Secrets
  const required = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_API_KEY'];
  // Mirror Gate用（本番環境で必要）
  const mirrorRequired = ['MIRROR_REPO', 'MIRROR_TOKEN'];
  // オプション
  const optional = ['DEEPSEEK_API_KEY', 'GROK_API_KEY', 'PPLX_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  
  const missing = required.filter(k => !process.env[k]);
  const missingMirror = mirrorRequired.filter(k => !process.env[k]);
  const present = [...required, ...mirrorRequired, ...optional].filter(k => process.env[k]);
  
  if (missing.length > 0) {
    console.error(`❌ Required secrets: ${missing.join(', ')}`);
    console.error(`   💡 These are required for core AI workflows (SeventhSense, Claude Review, Gemini)`);
  }
  
  if (missingMirror.length > 0) {
    console.warn(`⚠️  Mirror secrets missing: ${missingMirror.join(', ')}`);
    console.warn(`   💡 These are required for Mirror Gate workflow`);
  }
  
  if (missing.length > 0) {
    return false;
  }
  
  if (missingMirror.length === 0) {
    console.log(`✅ Secrets: ${required.length + mirrorRequired.length}/${required.length + mirrorRequired.length} required present`);
  } else {
    console.log(`✅ Core secrets: ${required.length}/${required.length} present`);
    console.log(`   ⚠️  Mirror secrets: ${mirrorRequired.length - missingMirror.length}/${mirrorRequired.length} present`);
  }
  
  if (present.length > required.length + mirrorRequired.length) {
    console.log(`   Optional: ${present.length - required.length - mirrorRequired.length} additional secrets present`);
  }
  
  return true;
}

async function checkUTF8() {
  try {
    // Test golden file
    const golden = await fs.readFile('tests/encoding/golden.txt', 'utf8');
    if (!golden.includes('叡智') || golden.includes('\r')) {
      console.error('❌ UTF-8: Golden test failed');
      return false;
    }
    console.log('✅ UTF-8: Golden test passed');
    return true;
  } catch (error) {
    console.log('⚠️  UTF-8: Golden file not found, skipping');
    return true;
  }
}

async function checkFileThresholds() {
  try {
    const dirs = ['99_SYSTEM/Proofs', '20_TriHex-Obsidian/00_INDEX'];
    for (const dir of dirs) {
      try {
        const files = await fs.readdir(dir);
        if (files.length > 1000) {
          console.warn(`⚠️  File count in ${dir}: ${files.length} (>1000)`);
        } else {
          console.log(`✅ ${dir}: ${files.length} files`);
        }
      } catch {
        // Directory might not exist
      }
    }
    return true;
  } catch (error) {
    console.error('❌ File threshold check failed');
    return false;
  }
}

async function main() {
  console.log('🔍 Preflight Check Starting...\n');
  
  const results = {
    node: await checkNode(),
    permissions: await checkPermissions(),
    secrets: await checkSecrets(),
    utf8: await checkUTF8(),
    files: await checkFileThresholds()
  };
  
  console.log('');
  console.log('📊 Summary:');
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('✅ All checks passed');
    process.exit(0);
  } else {
    console.log('❌ Some checks failed');
    console.log('📝 TODO: Fix issues above');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
