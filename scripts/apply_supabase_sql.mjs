#!/usr/bin/env node

/**
 * Apply SQL to Supabase
 * Purpose: Direct SQL execution via service role
 */

import { readFileSync } from 'node:fs';

// Read secrets
const secrets = readFileSync('.secrets/supabase.env', 'utf8');
const SUPABASE_URL = secrets.match(/SUPABASE_URL=(.+)/)?.[1]?.trim();
const SUPABASE_SERVICE_KEY = secrets.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

// Read SQL files
const sql1 = readFileSync('scripts/sql/0001_trihex_base.sql', 'utf8');
const sql2 = readFileSync('scripts/sql/0002_tsukutsuku_line_messages.sql', 'utf8');
const sql3 = readFileSync('scripts/sql/0003_points_history.sql', 'utf8');

async function executeSQL(sql, filename) {
  console.log(`\n📄 Applying ${filename}...`);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ sql_text: sql })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Error: ${error}`);
      return false;
    }
    
    console.log('✅ Applied successfully');
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Applying SQL to Supabase...\n');
  
  const results = [];
  results.push(await executeSQL(sql1, '0001_trihex_base.sql'));
  results.push(await executeSQL(sql2, '0002_tsukutsuku_line_messages.sql'));
  results.push(await executeSQL(sql3, '0003_points_history.sql'));
  
  const allSuccess = results.every(r => r);
  
  if (allSuccess) {
    console.log('\n✅ All schemas applied!');
  } else {
    console.log('\n⚠️ Some failed. Check errors above.');
  }
  
  // Write log
  const fs = await import('fs/promises');
  await fs.mkdir('99_SYSTEM/Proofs', { recursive: true });
  await fs.writeFile('99_SYSTEM/Proofs/DB_Schema_Applied_2025-11-02.md', `
# Database Schema Application

**Date:** ${new Date().toISOString()}
**Status:** ${allSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL'}

## Applied Files

1. ${results[0] ? '✅' : '❌'} 0001_trihex_base.sql
2. ${results[1] ? '✅' : '❌'} 0002_tsukutsuku_line_messages.sql
3. ${results[2] ? '✅' : '❌'} 0003_points_history.sql

---

**Generated:** ${new Date().toISOString()} / Cursor (☿)
`, 'utf8');
}

main().catch(console.error);


