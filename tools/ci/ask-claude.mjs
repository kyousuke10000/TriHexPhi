#!/usr/bin/env node
import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs';
import path from 'node:path';

const key = process.env.ANTHROPIC_API_KEY;
if (!key) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}
const client = new Anthropic({ apiKey: key });

const logPath = path.join(process.cwd(), '.logs/last.log');
if (!fs.existsSync(logPath)) {
  console.error('.logs/last.log not found');
  process.exit(1);
}

const log = fs.readFileSync(logPath, 'utf8');
const prompt = `以下はGitHub Actionsの失敗ログです。原因→最小修正パッチ（完全なYAMLやコードの差分）→根拠の順で200行以内で出力。特に permissions / needs / ref / environment / with を重点チェック。\n\n${log}`;

const res = await client.messages.create({
  model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet',
  max_tokens: 1500,
  system: 'You are a CI doctor. Return minimal, exact patches.',
  messages: [{ role: 'user', content: prompt }]
});
const text = res.content?.map(x => x.text).join('\n') || '';

const outDir = path.join(process.cwd(), '99_SYSTEM/Proofs/CI');
fs.mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `CLAUDE_PATCH_${Date.now()}.md`);
fs.writeFileSync(file, text, 'utf8');
console.log(file);

