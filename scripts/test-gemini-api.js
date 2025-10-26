#!/usr/bin/env node
/**
 * 🔱 TriHexΦ - Gemini API テストスクリプト
 * 
 * @description Gemini API接続テスト
 * @usage node test-gemini-api.js
 * @version 1.0.0
 * @date 2025-10-26
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('🔱 TriHexΦ - Gemini API 接続テスト\n');

// 環境変数チェック
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_API_KEY または GEMINI_API_KEY が設定されていません');
  console.error('\n設定方法:');
  console.error('  export GOOGLE_API_KEY="AIzaSy..."');
  console.error('  export GEMINI_API_KEY="AIzaSy..."');
  process.exit(1);
}

console.log('✅ GOOGLE_API_KEY: ' + GOOGLE_API_KEY.substring(0, 20) + '...\n');

// Gemini クライアント初期化
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

console.log('💎 Geminiに接続中...\n');

try {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = "Hello, Gemini! TriHexΦプロジェクトの接続テストです。簡単に挨拶してください。";
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log('✅ 接続成功！\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Geminiからの応答:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(text);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📊 API情報:');
  console.log(`  Model: gemini-1.5-pro-latest`);
  console.log(`  Response Length: ${text.length} chars`);
  console.log('');

  console.log('🎉 テスト完了！Gemini APIは正常に動作しています。');
  console.log('');
  console.log('次のステップ:');
  console.log('  1. call-gemini-api.js を使用してPRレビューをテスト');
  console.log('  2. GitHub Actionsに統合');
  console.log('');

} catch (error) {
  console.error('❌ エラー:', error.message);
  
  if (error.message.includes('API_KEY') || error.message.includes('401')) {
    console.error('\n認証エラー: APIキーが無効です');
    console.error('対処法: https://makersuite.google.com/app/apikey で新しいキーを生成');
  } else if (error.message.includes('quota')) {
    console.error('\nクォータエラー: 使用量制限に達しました');
  } else if (error.message.includes('rate limit')) {
    console.error('\nレート制限: しばらく待ってから再試行してください');
  }
  
  process.exit(1);
}

