#!/usr/bin/env node
/**
 * 🔱 TriHexΦ - Claude API テストスクリプト
 * 
 * @description Claude API接続テスト
 * @usage node test-claude-api.js
 * @version 1.0.0
 * @date 2025-10-26
 */

import Anthropic from '@anthropic-ai/sdk';

console.log('🔱 TriHexΦ - Claude API 接続テスト\n');

// 環境変数チェック
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY が設定されていません');
  console.error('\n設定方法:');
  console.error('  export ANTHROPIC_API_KEY="sk-ant-..."');
  process.exit(1);
}

console.log('✅ ANTHROPIC_API_KEY: ' + ANTHROPIC_API_KEY.substring(0, 20) + '...\n');

// Claude クライアント初期化
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

console.log('🌙 Claudeに接続中...\n');

try {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 100,
    messages: [{
      role: "user",
      content: "Hello, Claude! TriHexΦプロジェクトの接続テストです。簡単に挨拶してください。"
    }]
  });

  console.log('✅ 接続成功！\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Claudeからの応答:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(message.content[0].text);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📊 API情報:');
  console.log(`  Model: ${message.model}`);
  console.log(`  Role: ${message.role}`);
  console.log(`  Stop Reason: ${message.stop_reason}`);
  console.log(`  Usage:`, message.usage);
  console.log('');

  console.log('🎉 テスト完了！Claude APIは正常に動作しています。');
  console.log('');
  console.log('次のステップ:');
  console.log('  1. call-claude-api.js を使用してPRレビューをテスト');
  console.log('  2. GitHub Actionsに統合');
  console.log('');

} catch (error) {
  console.error('❌ エラー:', error.message);
  
  if (error.status === 401) {
    console.error('\n認証エラー: APIキーが無効です');
    console.error('対処法: https://console.anthropic.com/ で新しいキーを生成');
  } else if (error.status === 429) {
    console.error('\nレート制限: しばらく待ってから再試行してください');
  } else if (error.status === 500) {
    console.error('\nサーバーエラー: Anthropicのステータスを確認');
    console.error('ステータスページ: https://status.anthropic.com/');
  }
  
  process.exit(1);
}

