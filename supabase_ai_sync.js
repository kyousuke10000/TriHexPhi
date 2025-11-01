// supabase_ai_sync.js - TriHexΦ AI応答共有プロトタイプ
// 依存: npm install @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js');

// Supabaseクライアント初期化（環境変数から取得推奨）
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_KEY || 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// AI応答保存関数
async function saveAiResponse(aiName, content, contextId) {
  const { data, error } = await supabase
    .from('ai_responses')
    .insert([{ ai_name: aiName, content, context_id: contextId, timestamp: new Date() }]);
  
  if (error) throw error;
  return data;
}

// 前回応答取得関数（contextIdでフィルタ）
async function getPreviousResponse(contextId, aiName = null) {
  let query = supabase
    .from('ai_responses')
    .select('*')
    .eq('context_id', contextId)
    .order('timestamp', { ascending: false })
    .limit(1);
  
  if (aiName) query = query.eq('ai_name', aiName);
  
  const { data, error } = await query;
  if (error) throw error;
  return data[0] || null;
}

// 使用例（CLIから呼ぶ場合）
// node supabase_ai_sync.js save Grok "Hello from Grok" trihex-001
// node supabase_ai_sync.js get trihex-001

const [action, ...args] = process.argv.slice(2);

if (action === 'save') {
  const [aiName, content, contextId] = args;
  saveAiResponse(aiName, content, contextId)
    .then(data => console.log('Saved:', data))
    .catch(err => console.error('Error:', err));
} else if (action === 'get') {
  const [contextId, aiName] = args;
  getPreviousResponse(contextId, aiName)
    .then(data => console.log('Previous:', data))
    .catch(err => console.error('Error:', err));
} else {
  console.log('Usage: node supabase_ai_sync.js [save|get] ...');
}