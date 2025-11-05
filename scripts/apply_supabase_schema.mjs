#!/usr/bin/env node

/**
 * Apply Supabase Schemas
 * Purpose: Apply all SQL files to Supabase via REST API
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read secrets
let SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY;
try {
  const secrets = readFileSync('.secrets/supabase.env', 'utf8');
  SUPABASE_URL = secrets.match(/SUPABASE_URL=(.+)/)?.[1]?.trim();
  SUPABASE_SERVICE_ROLE_KEY = secrets.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
} catch (e) {
  console.error('❌ Could not read .secrets/supabase.env');
  process.exit(1);
}

const toUtf8NFC = (s) => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

async function applySQL(sqlPath) {
  console.log(`\n📄 Applying: ${sqlPath}...`);
  
  const sql = toUtf8NFC(readFileSync(join(__dirname, sqlPath), 'utf8'));
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    console.log('✅ Applied successfully');
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Supabase schema application...\n');
  console.log(`URL: ${SUPABASE_URL}`);
  
  const sqlFiles = [
    '../sql/0001_trihex_base.sql',
    '../sql/0002_tsukutsuku_line_messages.sql',
    '../sql/0003_points_history.sql'
  ];
  
  let allSuccess = true;
  for (const file of sqlFiles) {
    const success = await applySQL(file);
    if (!success) allSuccess = false;
  }
  
  console.log(allSuccess ? '\n✅ All schemas applied!' : '\n⚠️ Some errors occurred');
  
  // Write log
  const logEntry = {
    timestamp: new Date().toISOString(),
    success: allSuccess,
    files: sqlFiles
  };
  
  const fs = await import('fs/promises');
  const logPath = join(__dirname, '../../99_SYSTEM/Proofs/DB_適用ログ_2025-11-02.md');
  await fs.writeFile(logPath, `# Database Schema Application Log

**Date:** ${logEntry.timestamp}  
**Status:** ${allSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL'}

## Applied Files

${sqlFiles.map(f => `- ${f}`).join('\n')}

---
`, 'utf8');
  
  console.log(`📝 Log saved: ${logPath}`);
}

main().catch(console.error);


