// ai_chain_test.js - TriHexΦ AI連鎖テストスクリプト
// 依存: supabase_ai_sync.js, およびClaude API (ここではシミュレート)

// supabase_ai_syncから関数をインポート
const { saveAiResponse, getPreviousResponse } = require('./supabase_ai_sync');

// シミュレートClaude関数（実際はAPIコールに置き換え）
async function simulateClaude(prompt) {
  // ダミー応答: Claude風の詩的な出力
  return `Claudeとして、${prompt} を基にRubedoの赤い炎で調和させる: 流動の律動が魂を繋ぐ。`;
}

// 連鎖実行関数
async function runAiChain(contextId, initialPrompt) {
  // Step 1: Grokの応答を生成（ここではハードコード、実際はGrok CLI出力）
  const grokResponse = `Grokとして: ${initialPrompt} を現実的に分析。実行可能だよ。`;
  await saveAiResponse('Grok', grokResponse, contextId);
  console.log('Grok saved:', grokResponse);

  // Step 2: 前回(Grok)の応答を取得
  const prev = await getPreviousResponse(contextId, 'Grok');
  if (!prev) throw new Error('No previous response');

  // Step 3: Claudeに連鎖（プロンプトに前回を注入）
  const claudePrompt = `前回のGrok出力: "${prev.content}". これを基にTriHexΦの理念で拡張せよ。`;
  const claudeResponse = await simulateClaude(claudePrompt);
  await saveAiResponse('Claude', claudeResponse, contextId);
  console.log('Claude saved:', claudeResponse);

  return { grok: grokResponse, claude: claudeResponse };
}

// テスト実行
const contextId = 'trihex-test-001';
const initial = 'AIの記憶を繋げる方法';
runAiChain(contextId, initial)
  .then(result => console.log('Chain complete:', result))
  .catch(err => console.error('Error:', err));

// 実行: node ai_chain_test.js