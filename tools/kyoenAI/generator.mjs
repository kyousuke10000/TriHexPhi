#!/usr/bin/env node

/**
 * KYOEN AI Generator
 * Usage:
 *   --mode {intro|thanks|pitch} --who Name --about Context --tone Style
 *   --preset {tsuji|chieri|plain} --topic "Topic" --channel {line|tsukutsuku|stage}
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

// UTF-8 + NFC normalization
const toUtf8NFC = (s) => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

// UTF-8 subprocess wrapper (from conductor)
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

const mode = getArg('--mode');
const who = getArg('--who', 'User');
const about = getArg('--about', '');
const tone = getArg('--tone', 'やわらか');
const preset = getArg('--preset', 'plain');
const topic = getArg('--topic', '');
const channel = getArg('--channel', 'plain');

// Validate new preset arguments
if (!mode && !preset) {
  console.error(`Usage:
Old style:
  node generator.mjs --mode {intro|thanks|pitch} [--who NAME] [--about CONTEXT] [--tone STYLE]

New style:
  node generator.mjs --preset {tsuji|chieri|plain} --topic "Topic" [--channel {line|tsukutsuku|stage}]

Examples:
  node generator.mjs --preset tsuji --channel line --topic "ツクツク=分け合い/AI=想いの分配器"
  node generator.mjs --preset chieri --channel line --topic "AI怖い→安心→ありがとう増加"
  node generator.mjs --preset tsuji --channel stage --topic "紹介→共鳴/ありがとうの循環"`);
  process.exit(1);
}

// Generate prompt based on preset
function buildPresetPrompt(preset, topic, channel) {
  let basePrompt = '';
  
  if (preset === 'tsuji') {
    // Tsuji mode: assertive, passionate, metaphors
    basePrompt = `辻さんの語り口で、以下を温かく力強く表現してください：
「${topic}」

【キーワード】
- 分け合い/みんなの得
- 紹介→共鳴
- AI=想いの分配器
- Amazon=一人、ツクツク=皆

【トーン】
- 断定・熱量
- 軽い比喩を織り込む
- 3-7行の語り口
- 台本化はしない`;
  } else if (preset === 'chieri') {
    // Chieri mode: soft, emotional evidence, bridge
    basePrompt = `知恵里さんの語り口で、以下を温かく共感的に表現してください：
「${topic}」

【キーワード】
- 最初は怖かった → 安心 → ありがとうが増えた
- 「そのまま形になる」
- 優しい言葉を思い出す

【トーン】
- 柔らか・感情の証拠
- 思い出の表現
- 自然な会話調`;
  } else {
    // plain mode (fallback)
    basePrompt = `KYOEN AIの温かい表現で、以下を作成してください：
「${topic}」`;
  }
  
  // Channel adjustments
  if (channel === 'line') {
    basePrompt += '\n\n【文体】短く、絵文字少し（30-50字程度）';
  } else if (channel === 'tsukutsuku') {
    basePrompt += '\n\n【文体】温かい販促寄り（80-120字程度）';
  } else if (channel === 'stage') {
    basePrompt += '\n\n【文体】90秒スピーチ尺（200-250字程度）';
  }
  
  return basePrompt;
}

// Call TriHex CLI for generation
function generateContent(mode, who, about, tone, preset, topic, channel) {
  return new Promise((resolve, reject) => {
    let prompt = '';
    
    // New preset mode
    if (preset && preset !== 'plain') {
      prompt = buildPresetPrompt(preset, topic, channel);
    }
    // Old mode system (for compatibility)
    else if (mode === 'intro') {
      prompt = `以下の3つから自己紹介文を作成してください: 想い「${about}」、届けたい相手「一般の方々」、メッセージ「温かく自然な表現で」。`;
    } else if (mode === 'thanks') {
      prompt = `「${who}」さんへの感謝文を作成してください。内容: ${about}。温かく丁寧な表現で、${tone}なトーンで。`;
    } else if (mode === 'pitch') {
      prompt = `${about}について、90秒で伝わるピッチを作成してください。${tone}なトーンで、共感できる言葉で。`;
    } else {
      reject(new Error(`Unknown mode: ${mode}, preset: ${preset}`));
      return;
    }
    
    // Use temp file
    const tmpfile = `/tmp/kyoen_prompt_${Date.now()}.txt`;
    fs.writeFile(tmpfile, toUtf8NFC(prompt), 'utf8').then(() => {
      const proc = pspawn('sh', [
        '-c',
        `node tools/trihex/trihex.mjs --exec "$(cat ${tmpfile})" && rm -f ${tmpfile}`
      ]);
      
      let output = '';
      
      proc.stdout.on('data', data => {
        output += data.toString();
      });
      
      proc.stderr.on('data', data => {
        // Ignore stderr
      });
      
      proc.on('exit', code => {
        try { fs.unlink(tmpfile); } catch {}
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Generation failed: ${code}`));
        }
      });
      
      proc.on('error', error => {
        try { fs.unlink(tmpfile); } catch {}
        reject(error);
      });
    }).catch(reject);
  });
}

// Save to Proofs
async function saveProof(mode, who, about, tone, content, preset, topic, channel) {
  const date = new Date().toISOString().split('T')[0];
  const dir = path.join('99_SYSTEM/Proofs/KyoenAI', date);
  await fs.mkdir(dir, { recursive: true });
  
  // Determine slug based on mode or preset
  let slug = '';
  if (preset && preset !== 'plain') {
    slug = `${preset}_${channel}_${Date.now()}`;
  } else {
    slug = mode + '_' + who.replace(/\s+/g, '_').toLowerCase();
    slug += '_' + Date.now();
  }
  const filename = `${slug}.md`;
  const filepath = path.join(dir, filename);
  
  // Build frontmatter
  const frontmatter = {
    kyoen_ai: true,
    team: "Tokunoshima",
    date: new Date().toISOString(),
    tags: ["#KYOEN"]
  };
  
  if (preset && preset !== 'plain') {
    frontmatter.preset = preset;
    frontmatter.channel = channel;
    frontmatter.topic = topic || '';
    frontmatter.tags.push(`#${preset}`);
  } else {
    frontmatter.author = who;
    frontmatter.mode = mode;
    frontmatter.tone = tone;
    frontmatter.tags.push(`#${mode}`);
  }
  
  const proof = `---
${Object.entries(frontmatter).map(([k,v]) => `${k}: ${typeof v === 'string' ? `"${v}"` : v}`).join('\n')}
---

# KYOEN AI Generation

**Generated:** ${new Date().toISOString()}

${preset && preset !== 'plain' ? `
**Preset:** ${preset}  
**Channel:** ${channel}  
**Topic:** ${topic}
` : `
**Mode:** ${mode}  
**Author:** ${who}  
**Tone:** ${tone}
`}

---

${preset && preset !== 'plain' ? `
## Topic

${topic || 'No topic provided'}

---

## Generated Content
` : `
## Context

${about || 'No context provided'}

---

## Generated Content
`}

${toUtf8NFC(content)}

---

**Brand:** KYOEN AI  
**Node:** Tokunoshima  
**OS:** TriHex Φ

---

*"想いが響けば、繋がりが生まれる。"*
`;
  
  await fs.writeFile(filepath, toUtf8NFC(proof), 'utf8');
  console.log(`✅ Saved: ${filepath}`);
  return filepath;
}

// Main
async function main() {
  console.log(`🎨 KYOEN AI Generator`);
  if (preset && preset !== 'plain') {
    console.log(`Preset: ${preset}, Channel: ${channel}`);
    console.log(`Topic: ${topic.substring(0, 50)}...`);
  } else {
    console.log(`Mode: ${mode}, Who: ${who}, About: ${about.substring(0, 30)}...`);
  }
  console.log('');
  
  try {
    const content = await generateContent(mode, who, about, tone, preset, topic, channel);
    const filepath = await saveProof(mode, who, about, tone, content, preset, topic, channel);
    
    console.log('');
    console.log('📄 Generated Content:');
    console.log('---');
    console.log(toUtf8NFC(content));
    console.log('---');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});