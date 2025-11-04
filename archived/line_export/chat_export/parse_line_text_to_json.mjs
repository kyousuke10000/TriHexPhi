#!/usr/bin/env node

/**
 * Parse LINE Raw Text to JSON
 * Input: chat_raw.txt (LINE copy-paste format)
 * Output: chat.json (structured messages)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const toUtf8NFC = (s) => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

function parseLineRaw(rawText) {
  const lines = toUtf8NFC(rawText).split('\n');
  const messages = [];
  let currentDate = null;
  let currentUser = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Date line formats:
    // - "2024.08.10" (dot format)
    // - "2019年1月1日 火" (year/month/day format)
    const dateMatch1 = line.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
    const dateMatch2 = line.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    
    if (dateMatch1) {
      const [, year, month, day] = dateMatch1;
      currentDate = `${year}-${month}-${day}`;
      continue;
    } else if (dateMatch2) {
      const [, year, month, day] = dateMatch2;
      currentDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      continue;
    }
    
    // Message line (user + message)
    // Format: "UserName\nMessage content"
    if (currentDate) {
      // Try to match user + message pattern
      if (i < lines.length - 1) {
        const potentialUser = line;
        const potentialMessage = lines[i + 1];
        
        if (potentialMessage && !potentialMessage.match(/^\d{4}年/) && !potentialMessage.match(/^\d{4}\./) && !potentialMessage.match(/^\d{1,2}:\d{2}/)) {
          currentUser = potentialUser;
          
          // Collect multi-line message
          let messageText = potentialMessage;
          let j = i + 2;
          while (j < lines.length && !lines[j].match(/^\d{4}年/) && !lines[j].match(/^\d{4}\./) && !lines[j].match(/^\d{1,2}:\d{2}/) && 
                 lines[j].trim() && !lines[j].includes('年')) {
            messageText += '\n' + lines[j];
            j++;
          }
          
          // Extract time if present
          let timeStr = '00:00';
          const timeMatch = potentialMessage.match(/(\d{1,2}):(\d{2})/);
          if (timeMatch) {
            timeStr = timeMatch[0];
          }
          
          // Build ISO timestamp
          const ts = `${currentDate}T${timeStr}:00+09:00`;
          
          // Generate hash for upsert key
          const hash = createHash('sha256')
            .update(`tokunoshima${currentUser}${ts}${messageText.slice(0, 64)}`)
            .digest('hex');
          
          messages.push({
            group_id: 'tokunoshima',
            user: currentUser,
            text: messageText,
            ts: ts,
            hash: hash,
            metadata: {}
          });
          
          i = j - 1;
        }
      }
    }
  }
  
  return messages;
}

async function main() {
  console.log('📄 Reading chat_raw.txt...');
  const rawText = readFileSync('artifacts/line_export/chat_raw.txt', 'utf8');
  
  console.log('🔍 Parsing to JSON...');
  const messages = parseLineRaw(rawText);
  
  console.log(`✅ Parsed ${messages.length} messages`);
  
  // Save JSON
  writeFileSync('artifacts/line_export/chat.json', JSON.stringify(messages, null, 2), 'utf8');
  
  // Stats
  const oldest = messages.length > 0 ? messages[messages.length - 1].ts : 'N/A';
  const newest = messages.length > 0 ? messages[0].ts : 'N/A';
  
  console.log(`\n📊 Stats:`);
  console.log(`   Total: ${messages.length} messages`);
  console.log(`   Range: ${oldest} → ${newest}`);
  
  return { count: messages.length, oldest, newest };
}

main().catch(console.error);

