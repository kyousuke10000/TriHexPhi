#!/usr/bin/env node
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'node:fs';
import path from 'node:path';

const key = process.env.GOOGLE_API_KEY;
if (!key) {
  console.error('GOOGLE_API_KEY missing');
  process.exit(1);
}
const gen = new GoogleGenerativeAI(key);
const model = gen.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-pro' });

const wfDir = '.github/workflows';
const wfFiles = fs.existsSync(wfDir)
  ? fs.readdirSync(wfDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
  : [];

let bundle = '# workflows\n';
for (const f of wfFiles) {
  const filePath = path.join(wfDir, f);
  if (fs.existsSync(filePath)) {
    bundle += `\n## ${f}\n` + fs.readFileSync(filePath, 'utf8') + '\n';
  }
}

const pkg = fs.existsSync('package.json') ? fs.readFileSync('package.json', 'utf8') : '{}';
const prompt = `以下のworkflowsとpackage.jsonを読み、依存と順序の標準化案を3つ提示。_std_node.ymlに寄せる完全YAML例も返すこと。permissions/needs/environmentを明記。\n\n[package.json]\n${pkg}\n\n[bundle]\n${bundle}`;

const r = await model.generateContent(prompt);
const text = r.response.text();

const outDir = path.join(process.cwd(), '99_SYSTEM/Proofs/CI');
fs.mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `GEMINI_PLAN_${Date.now()}.md`);
fs.writeFileSync(file, text, 'utf8');
console.log(file);

