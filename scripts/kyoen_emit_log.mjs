#!/usr/bin/env node
/**
 * KYOEN Messages → Obsidian Log Exporter
 * 
 * Purpose: Export daily messages from kyoen_messages to Obsidian
 * Output: 10_CAPTURE_MIZUKAGAMI/Grok/YYYY-MM-DD_KYOEN_Log.md
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function exportDailyLog(targetDate = new Date().toISOString().split('T')[0]) {
  const start = new Date(`${targetDate}T00:00:00Z`);
  const end = new Date(`${targetDate}T23:59:59Z`);
  
  const { data, error } = await supabase
    .from('kyoen_messages')
    .select('id,ts,line_user_id,text,intent,meta')
    .gte('ts', start.toISOString())
    .lte('ts', end.toISOString())
    .order('ts', { ascending: true });
  
  if (error) {
    console.error('Error fetching messages:', error);
    process.exit(1);
  }
  
  const outputDir = '10_CAPTURE_MIZUKAGAMI/Grok';
  await fs.mkdir(outputDir, { recursive: true });
  
  const outputFile = path.join(outputDir, `${targetDate}_KYOEN_Log.md`);
  
  let markdown = `---
ai_source: Grok
user: shiryu
session_id: KYOEN_${targetDate.replace(/-/g, '')}
date: ${targetDate}
topics: [kyoen, line, tokunoshima]
sync: false
tags: [mizukagami, grok, kyoen, line]
---

# KYOEN Log (${targetDate})

## Summary

Total messages: ${data.length}

## Messages

`;
  
  for (const msg of data) {
    markdown += `### ${msg.ts}
**User:** ${msg.line_user_id}  
**Intent:** ${msg.intent || 'unknown'}  
**Text:** ${msg.text}

`;
  }
  
  markdown += `---
## Dataview Example

\`\`\`dataview
TABLE ts as 時刻, intent as 意図, text as 内容
FROM "10_CAPTURE_MIZUKAGAMI/Grok/${targetDate}_KYOEN_Log.md"
WHERE ai_source = "Grok" AND date = "${targetDate}"
SORT ts ASC
\`\`\`
`;
  
  await fs.writeFile(outputFile, markdown, 'utf8');
  console.log(`✅ Exported ${data.length} messages to ${outputFile}`);
}

// CLI
const args = process.argv.slice(2);
const targetDate = args[0] || new Date().toISOString().split('T')[0];

exportDailyLog(targetDate).catch(console.error);

