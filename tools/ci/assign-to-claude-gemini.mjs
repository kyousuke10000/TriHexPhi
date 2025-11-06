#!/usr/bin/env node
/**
 * GPT指示に従い、失敗ワークフローのエラーをClaude/Geminiに割り振る
 * 
 * Claude: CIドクター - エラーの原因分析と最小パッチ生成
 * Gemini: 設計官 - ワークフロー標準化案の生成
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const WORKFLOWS_DIR = '.github/workflows';
const PROOFS_DIR = '99_SYSTEM/Proofs/CI';

// エラーログを収集
function collectErrors() {
  try {
    const runs = JSON.parse(
      execSync('gh run list --limit 20 --json name,conclusion,workflowName,headBranch,databaseId', { encoding: 'utf8' })
    );
    
    const failures = runs.filter(r => r.conclusion === 'failure');
    console.log(`Found ${failures.length} failed workflows`);
    
    return failures;
  } catch (e) {
    console.error('Failed to collect errors:', e.message);
    return [];
  }
}

// Claudeにエラー分析を依頼
async function askClaudeForPatch(errors) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.error('ANTHROPIC_API_KEY missing');
    return null;
  }
  
  const client = new Anthropic({ apiKey: key });
  
  const errorSummary = errors.map(e => 
    `- ${e.workflowName} (Run ID: ${e.databaseId}, Branch: ${e.headBranch})`
  ).join('\n');
  
  const prompt = `以下はGitHub Actionsの失敗ワークフローリストです。

失敗ワークフロー:
${errorSummary}

これらのワークフローが失敗している原因を分析し、最小の修正パッチを提案してください。

特に以下を重点的にチェック:
- permissions設定
- secrets参照
- workflow_callの定義（_std_node.ymlなど）
- スクリプトファイルの存在
- YAML構文エラー
- 依存関係（needs）

各ワークフローに対して:
1. 失敗の原因
2. 修正パッチ（完全なYAML差分）
3. 根拠

を200行以内で出力してください。`;

  try {
    const res = await client.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet',
      max_tokens: 2000,
      system: 'You are a CI doctor. Return minimal, exact patches for workflow failures.',
      messages: [{ role: 'user', content: prompt }]
    });
    
    const text = res.content?.map(x => x.text).join('\n') || '';
    return text;
  } catch (e) {
    console.error('Claude API error:', e.message);
    return null;
  }
}

// Geminiに標準化案を依頼
async function askGeminiForStandardization() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    console.error('GOOGLE_API_KEY missing');
    return null;
  }
  
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-pro' });
  
  // 全ワークフローファイルを読み込み
  const workflows = [];
  if (fs.existsSync(WORKFLOWS_DIR)) {
    const files = fs.readdirSync(WORKFLOWS_DIR).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(WORKFLOWS_DIR, file), 'utf8');
        workflows.push({ name: file, content });
      } catch (e) {
        console.warn(`Failed to read ${file}:`, e.message);
      }
    }
  }
  
  const workflowsBundle = workflows.map(w => `## ${w.name}\n\`\`\`yaml\n${w.content}\n\`\`\``).join('\n\n');
  
  const prompt = `以下のGitHub Actionsワークフローファイルを読み、標準化案を3つ提示してください。

特に以下を重点的に:
- _std_node.ymlへの統一
- permissionsの明示
- environment設定（production/staging）
- concurrency設定
- エラーハンドリング

各提案に対して:
1. 提案内容
2. 完全なYAML例
3. 適用すべきワークフローリスト

を300行以内で出力してください。

${workflowsBundle}`;

  try {
    const res = await model.generateContent(prompt);
    const text = res.response.text();
    return text;
  } catch (e) {
    console.error('Gemini API error:', e.message);
    return null;
  }
}

// メイン処理
async function main() {
  console.log('🔍 Collecting workflow errors...');
  const errors = collectErrors();
  
  if (errors.length === 0) {
    console.log('✅ No failed workflows found');
    return;
  }
  
  console.log(`\n📋 Found ${errors.length} failed workflows`);
  console.log('Assigning to Claude (CI Doctor) and Gemini (Design Officer)...\n');
  
  // Claudeにエラー分析を依頼
  console.log('🤖 Asking Claude for error analysis and patches...');
  const claudeResult = await askClaudeForPatch(errors);
  
  // Geminiに標準化案を依頼
  console.log('🤖 Asking Gemini for standardization plan...');
  const geminiResult = await askGeminiForStandardization();
  
  // 結果を保存
  fs.mkdirSync(PROOFS_DIR, { recursive: true });
  const timestamp = Date.now();
  
  if (claudeResult) {
    const claudeFile = path.join(PROOFS_DIR, `CLAUDE_PATCH_${timestamp}.md`);
    fs.writeFileSync(claudeFile, claudeResult, 'utf8');
    console.log(`✅ Claude patch saved: ${claudeFile}`);
  }
  
  if (geminiResult) {
    const geminiFile = path.join(PROOFS_DIR, `GEMINI_PLAN_${timestamp}.md`);
    fs.writeFileSync(geminiFile, geminiResult, 'utf8');
    console.log(`✅ Gemini plan saved: ${geminiFile}`);
  }
  
  console.log('\n✅ Assignment complete');
}

main().catch(console.error);

