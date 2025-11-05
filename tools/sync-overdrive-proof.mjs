#!/usr/bin/env node
/**
 * Sync AI Overdrive logs from Supabase to Proofs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function syncOverdriveProofs() {
  try {
    console.log('📥 Fetching latest AI Overdrive logs from Supabase...');
    
    // Fetch latest 10 logs
    const { data, error } = await supabase
      .from('ai_overdrive_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log('ℹ️ No Overdrive logs found');
      return;
    }

    console.log(`✅ Fetched ${data.length} logs`);

    // Save each log as a proof
    const proofDir = '99_SYSTEM/Proofs/Overdrive';
    fs.mkdirSync(proofDir, { recursive: true });

    for (const log of data) {
      const timestamp = new Date(log.timestamp).toISOString().replace(/[:.]/g, '-');
      const filename = `OVERDRIVE_${timestamp}.md`;
      const filepath = path.join(proofDir, filename);

      const content = `# AI Overdrive Log: ${timestamp}

**User ID**: ${log.user_id}
**Status**: ${log.status}
**Timestamp**: ${log.timestamp}

## Original Text

${log.original_text}

## Generated Content

\`\`\`json
${JSON.stringify(log.generated_content, null, 2)}
\`\`\`

---
*Synced from Supabase*
`;

      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`✅ Saved: ${filename}`);
    }

    console.log(`✅ Sync complete: ${data.length} proofs saved`);
  } catch (error) {
    console.error('❌ Error syncing Overdrive proofs:', error.message);
    process.exit(1);
  }
}

syncOverdriveProofs();

