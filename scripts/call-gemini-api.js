#!/usr/bin/env node
/**
 * 🔱 TriHexΦ - Gemini API呼び出しスクリプト
 * 
 * @description GitHub ActionsやローカルからGemini APIを呼び出す
 * @usage node call-gemini-api.js --context-file context.txt --prompt "レビューしてください"
 * @version 1.0.0
 * @date 2025-10-26
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';

// 環境変数チェック
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('❌ エラー: GOOGLE_API_KEY または GEMINI_API_KEY 環境変数が設定されていません');
  console.error('設定方法: export GOOGLE_API_KEY="AIzaSy..."');
  process.exit(1);
}

// Gemini クライアント初期化
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

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
    model: 'gemini-1.5-flash-latest',  // ✅ 安定版モデルに変更（Gemini推奨）
    maxTokens: 4096,
    temperature: 0.7,
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
    } else if (arg === '--temperature') {
      parsed.temperature = parseFloat(args[++i]);
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
🔱 TriHexΦ - Gemini API Caller

使用方法:
  node call-gemini-api.js [options]

オプション:
  --context-file <path>   コンテキストファイルのパス
  --context <text>        コンテキストテキスト（直接指定）
  --pr-file <path>        PRデータJSONファイルのパス
  --prompt <text>         プロンプトテキスト
  --model <model>         使用モデル（デフォルト: gemini-1.5-flash-latest）
  --max-tokens <number>   最大トークン数（デフォルト: 4096）
  --temperature <float>   温度パラメータ（デフォルト: 0.7）
  --help                  このヘルプを表示

例:
  # コンテキストファイルから読み込み
  node call-gemini-api.js \\
    --context-file context-bootstrap.txt \\
    --prompt "PRをレビューしてください"

  # PRファイルも指定
  node call-gemini-api.js \\
    --context-file context-bootstrap.txt \\
    --pr-file pr-content.json \\
    --prompt "PRをレビューしてください"

環境変数:
  GOOGLE_API_KEY または GEMINI_API_KEY   GoogleのAPIキー（必須）
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
    return prData;
  }
}

/**
 * Gemini APIを呼び出す
 */
async function callGeminiAPI(context, prompt, model, maxTokens, temperature) {
  console.error('💎 Gemini APIを呼び出しています...');
  console.error(`Model: ${model}`);
  console.error(`Max Tokens: ${maxTokens}`);
  console.error(`Temperature: ${temperature}`);
  console.error('');

  try {
    const geminiModel = genAI.getGenerativeModel({ 
      model: model,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature,
      },
    });

    const fullPrompt = `${context}\n\n${prompt}`;
    
    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('❌ Gemini API呼び出しエラー:');
    console.error(error.message);
    
    if (error.message.includes('API_KEY')) {
      console.error('認証エラー: APIキーを確認してください');
    } else if (error.message.includes('quota')) {
      console.error('クォータエラー: 使用量制限に達しました');
    } else if (error.message.includes('rate limit')) {
      console.error('レート制限エラー: しばらく待ってから再試行してください');
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
  
  if (estimatedTokens > 1000000) {
    console.error('⚠️  警告: トークン数が非常に多いです（1M超）');
  }
  console.error('');

  // API呼び出し
  const response = await callGeminiAPI(
    context,
    args.prompt,
    args.model,
    args.maxTokens,
    args.temperature
  );

  // 結果を標準出力に出力
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

