#!/usr/bin/env node
/**
 * 🔱 TriHexΦ - Claude API呼び出しスクリプト
 * 
 * @description GitHub ActionsやローカルからClaude APIを呼び出す
 * @usage node call-claude-api.js --context-file context.txt --prompt "レビューしてください"
 * @version 1.0.0
 * @date 2025-10-26
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';

// 環境変数チェック
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('❌ エラー: ANTHROPIC_API_KEY 環境変数が設定されていません');
  console.error('設定方法: export ANTHROPIC_API_KEY="sk-ant-..."');
  process.exit(1);
}

// Claude クライアント初期化
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

/**
 * コマンドライン引数をパース
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    contextFile: null,
    context: null,
    prFile: null,
    prompt: null,
    model: 'claude-sonnet-4-20250514',
    maxTokens: 4096,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--context-file') {
      parsed.contextFile = args[++i];
    } else if (arg === '--context') {
      parsed.context = args[++i];
    } else if (arg === '--pr-file') {
      parsed.prFile = args[++i];
    } else if (arg === '--prompt') {
      parsed.prompt = args[++i];
    } else if (arg === '--model') {
      parsed.model = args[++i];
    } else if (arg === '--max-tokens') {
      parsed.maxTokens = parseInt(args[++i], 10);
    } else if (arg === '--help') {
      printHelp();
      process.exit(0);
    }
  }

  return parsed;
}

/**
 * ヘルプメッセージ
 */
function printHelp() {
  console.log(`
🔱 TriHexΦ - Claude API Caller

使用方法:
  node call-claude-api.js [options]

オプション:
  --context-file <path>   コンテキストファイルのパス
  --context <text>        コンテキストテキスト（直接指定）
  --pr-file <path>        PRデータJSONファイルのパス
  --prompt <text>         プロンプトテキスト
  --model <model>         使用モデル（デフォルト: claude-sonnet-4-20250514）
  --max-tokens <number>   最大トークン数（デフォルト: 4096）
  --help                  このヘルプを表示

例:
  # コンテキストファイルから読み込み
  node call-claude-api.js \\
    --context-file context-bootstrap.txt \\
    --prompt "PRをレビューしてください"

  # PRファイルも指定
  node call-claude-api.js \\
    --context-file context-bootstrap.txt \\
    --pr-file pr-content.json \\
    --prompt "PRをレビューしてください"

  # 直接テキスト指定
  node call-claude-api.js \\
    --context "TRIHEXPHI.md の内容..." \\
    --prompt "要約してください"

環境変数:
  ANTHROPIC_API_KEY       AnthropicのAPIキー（必須）
`);
}

/**
 * ファイルを読み込む
 */
async function readFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`❌ ファイル読み込みエラー: ${filePath}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * PRデータを整形
 */
function formatPRData(prData) {
  try {
    const data = JSON.parse(prData);
    return `
## Pull Request Information

**Title**: ${data.title || 'N/A'}

**Body**:
${data.body || 'No description provided.'}

**Files Changed**:
${data.files ? data.files.map(f => `- ${f.path || f}`).join('\n') : 'No files information'}
`;
  } catch (error) {
    return prData; // JSONパース失敗時はそのまま返す
  }
}

/**
 * Claude APIを呼び出す
 */
async function callClaudeAPI(context, prompt, model, maxTokens) {
  console.error('🌙 Claude APIを呼び出しています...');
  console.error(`Model: ${model}`);
  console.error(`Max Tokens: ${maxTokens}`);
  console.error('');

  try {
    const message = await anthropic.messages.create({
      model: model,
      max_tokens: maxTokens,
      messages: [{
        role: 'user',
        content: `${context}\n\n${prompt}`
      }]
    });

    // レスポンスを返す
    if (message.content && message.content[0] && message.content[0].text) {
      return message.content[0].text;
    } else {
      throw new Error('APIレスポンスが不正です');
    }
  } catch (error) {
    console.error('❌ Claude API呼び出しエラー:');
    console.error(error.message);
    
    if (error.status === 401) {
      console.error('認証エラー: APIキーを確認してください');
    } else if (error.status === 429) {
      console.error('レート制限エラー: しばらく待ってから再試行してください');
    } else if (error.status === 500) {
      console.error('サーバーエラー: Anthropicのステータスを確認してください');
    }
    
    process.exit(1);
  }
}

/**
 * メイン処理
 */
async function main() {
  const args = parseArgs();

  // コンテキストを取得
  let context = '';
  if (args.contextFile) {
    context = await readFile(args.contextFile);
    console.error(`✅ コンテキストファイル読み込み: ${args.contextFile}`);
  } else if (args.context) {
    context = args.context;
    console.error('✅ コンテキストを直接指定');
  } else {
    console.error('❌ エラー: --context-file または --context を指定してください');
    printHelp();
    process.exit(1);
  }

  // PRデータを取得（オプション）
  if (args.prFile) {
    const prData = await readFile(args.prFile);
    const formattedPR = formatPRData(prData);
    context = `${context}\n\n${formattedPR}`;
    console.error(`✅ PRデータ読み込み: ${args.prFile}`);
  }

  // プロンプトを取得
  if (!args.prompt) {
    console.error('❌ エラー: --prompt を指定してください');
    printHelp();
    process.exit(1);
  }

  console.error(`✅ プロンプト: ${args.prompt.substring(0, 50)}${args.prompt.length > 50 ? '...' : ''}`);
  console.error('');

  // トークン数推定
  const estimatedTokens = Math.ceil((context.length + args.prompt.length) / 4);
  console.error(`📊 推定入力トークン数: ${estimatedTokens}`);
  
  if (estimatedTokens > 150000) {
    console.error('⚠️  警告: トークン数が多すぎます（150K超）');
  }
  console.error('');

  // API呼び出し
  const response = await callClaudeAPI(
    context,
    args.prompt,
    args.model,
    args.maxTokens
  );

  // 結果を標準出力に出力（エラーメッセージは標準エラー出力なので分離されている）
  console.log(response);

  console.error('');
  console.error('✅ 完了');
  console.error(`📊 出力トークン数: 約${Math.ceil(response.length / 4)}`);
}

// 実行
main().catch(error => {
  console.error('❌ 予期しないエラー:');
  console.error(error);
  process.exit(1);
});

