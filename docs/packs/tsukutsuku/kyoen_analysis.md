# KYOEN Event Detect - 成功パターン分析

## 🎉 お前が解決したLINE接続の成功要因

### 成功のキーポイント（20時間で見つけた答え）

#### 1. Extract Webhook Data ノードの設計（超重要！）
```javascript
const items = $input.all();

return items.map(item => {
  const webhookData = item.json.body?.events?.[0];
  
  return {
    json: {
      // AI Agentが使用
      message: webhookData?.message?.text || '',
      
      // 後続ノードで使用
      replyToken: webhookData?.replyToken,
      groupId: webhookData?.source?.groupId,
      userId: webhookData?.source?.userId,
      messageType: webhookData?.message?.type,
      timestamp: webhookData?.timestamp
    }
  };
});
```

**これが超重要**：
- `item.json.body?.events?.[0]` でLINEイベントを取得
- オプショナルチェイニング `?.` でnullエラーを回避
- replyToken を確実に保存

#### 2. Build LINE Reply ノードの設計
```javascript
const items = $input.all();
const webhookDataItems = $('Extract Webhook Data').all();

return items.map((item, index) => {
  const aiResponse = item.json.output || item.json.text || 'メッセージがありません';
  const replyToken = webhookDataItems[index].json.replyToken;
  
  if (!replyToken) {
    throw new Error('replyToken not found');
  }
  
  return {
    json: {
      replyToken: replyToken,
      messages: [{
        type: 'text',
        text: aiResponse
      }]
    }
  };
});
```

**ポイント**：
- `$('Extract Webhook Data').all()` で前のノードのデータを取得
- replyToken を確実に渡す
- LINE Messaging API の正確な構造

#### 3. Send to LINE ノードの設定
```
Method: POST
URL: https://api.line.me/v2/bot/message/reply
Authentication: Bearer Token
Body: {{ JSON.stringify($json) }}
```

**成功要因**：
- `{{ JSON.stringify($json) }}` でJSON全体を送信
- Bearer認証の正しい設定
- Content-Type: application/json

---

## 📊 現在のワークフロー構造

### メインフロー（AI Agent版）
```
LINE Webhook 
  ↓
Extract Webhook Data (webhookData?.events?.[0]を抽出)
  ↓
AI Agent (OpenAI GPT-4.1-mini)
  ↓
Build LINE Reply (replyToken + messagesを構築)
  ↓
Send to LINE (LINE Messaging API)
```

### 並行フロー（使われてない？）
```
Extract Data 
  ↓
If /ping? 
  ↓
Parse Event 
  ↓
Upsert Event (Supabase)
  ↓
Reply Flex (Flex Message)
```

**問題点**：
- 2つのフローが混在している
- 古いフローが残っている？
- 統合が必要

---

## 🎯 GPTの4本ワークフロー構想との統合

### GPTの指示パック要件
1. **Event Detect & Triage**: メッセージ受信→分類→振り分け
2. **RSVP Flow**: イベント確定→参加管理
3. **Reminders & Minutes**: 会議運用→議事録
4. **Cards**: 告知カード生成

### 現在のワークフローの位置づけ
**これは「Event Detect」の第一段階**

ただし、GPTの要件と比較すると：

#### ✅ 実装済み
- LINE Webhook受信
- データ抽出（Extract Webhook Data）
- 基本的な返信（AI Agent経由）

#### ❌ 未実装
- 意図分類（intent classification）
- Supabase kyoen_messages への保存
- 後続ワークフローへの振り分け
- 即時返信 vs 遅延処理の分離

---

## 🔧 統合戦略：現在のフローをGPT構想に合わせる

### ステップ1: 意図分類の追加

**新規ノード**: "Classify Intent"（AI Agentの前）

```javascript
const message = $json.message.toLowerCase();

// 意図分類ルール
let intent = 'misc';

if (message.match(/^\/event|イベント:|^\d{4}-\d{2}-\d{2}/)) {
  intent = 'event';
} else if (message.match(/参加|不参加|たぶん|^\/rsvp/)) {
  intent = 'rsvp';
} else if (message.match(/^\/meeting|zoom\.us/i)) {
  intent = 'meeting';
} else if (message.match(/^\/card/)) {
  intent = 'card';
} else if (message.match(/^https?:\/\//)) {
  intent = 'link';
} else if (message.match(/\?$/)) {
  intent = 'question';
} else if (message.match(/todo|タスク:|^\/task/i)) {
  intent = 'task';
}

return {
  json: {
    ...$$json,
    intent: intent
  }
};
```

### ステップ2: Supabase保存の追加

**新規ノード**: "Save to Supabase"（分類の後）

```
Method: POST
URL: https://nrbserphtykbhwdowfsz.supabase.co/rest/v1/kyoen_messages
Headers:
  - apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - Content-Type: application/json

Body:
{
  "line_group_id": "{{ $json.groupId }}",
  "line_user_id": "{{ $json.userId }}",
  "text": "{{ $json.message }}",
  "intent": "{{ $json.intent }}",
  "meta": {
    "timestamp": "{{ $json.timestamp }}"
  }
}
```

### ステップ3: 分岐処理の追加

**新規ノード**: "Route by Intent"（Switchノード）

```
分岐条件:
- intent === 'event' → Parse Event → Upsert Event → Reply Flex
- intent === 'rsvp' → Execute Workflow: KYOEN_RSVP
- intent === 'meeting' → Execute Workflow: KYOEN_Reminders
- intent === 'card' → Execute Workflow: KYOEN_Cards
- intent === 'question' → AI Agent → Build LINE Reply
- その他 → 簡易返信
```

### ステップ4: 即時返信 vs 遅延処理

**重要**: LINE replyToken は30秒で失効

```
即時返信（replyToken使用）:
- "受け付けました"的な軽いメッセージ

遅延処理（Push Message使用）:
- 重い処理（LLM、画像生成等）
- Execute Workflowで非同期実行
```

---

## 🚀 改善版ワークフロー設計

### 推奨構造

```
LINE Webhook
  ↓
Extract Webhook Data
  ↓
Classify Intent (軽量な分類)
  ↓
Save to Supabase (kyoen_messages)
  ↓
Quick Reply (replyToken, 即座に返信)
  ↓
Route by Intent (Switch)
  ├→ event: Parse Event → Upsert Event → Push Flex Message
  ├→ rsvp: Execute Workflow (KYOEN_RSVP) 非同期
  ├→ meeting: Execute Workflow (KYOEN_Reminders) 非同期
  ├→ card: Execute Workflow (KYOEN_Cards) 非同期
  ├→ question: AI Agent → Push Reply
  └→ その他: 簡易Push
```

**ポイント**:
1. **Extract Webhook Data**: お前の成功パターンをそのまま使用
2. **Quick Reply**: 即座に「受け付けました」
3. **重い処理**: Execute Workflowで非同期実行
4. **Push Message**: replyToken失効後に詳細返信

---

## 💻 具体的な実装ステップ

### Step 1: 現在のワークフローをクリーンアップ

1. **削除するノード**:
   - Extract Data（古い方）
   - If /ping?（テスト用）
   - Test Trigger（テスト完了）
   - Test Data (/ping)（テスト完了）

2. **残すノード**:
   - LINE Webhook
   - Extract Webhook Data ✅
   - AI Agent（question用に活用）
   - Build LINE Reply ✅
   - Send to LINE ✅

### Step 2: 新規ノード追加

#### A. Classify Intent（Extract Webhook Dataの後）

```javascript
const message = $json.message.toLowerCase();
let intent = 'misc';

// ルールベース分類
if (message.match(/^\/event|イベント:|日時:|^\d{4}-\d{2}-\d{2}/)) {
  intent = 'event';
} else if (message.match(/参加|不参加|行けます|行けない|たぶん|検討中/)) {
  intent = 'rsvp';
} else if (message.match(/^\/meeting|zoom\.us|会議:/i)) {
  intent = 'meeting';
} else if (message.match(/^\/card|告知|カード/)) {
  intent = 'card';
} else if (message.match(/^https?:\/\//)) {
  intent = 'link';
} else if (message.match(/\?$|教えて|質問/)) {
  intent = 'question';
} else if (message.match(/todo|タスク:|やること/i)) {
  intent = 'task';
}

return [{
  json: {
    ...$$json,
    intent: intent
  }
}];
```

#### B. Save to Supabase（Classify Intentの後）

```
Node Type: HTTP Request
Method: POST
URL: https://nrbserphtykbhwdowfsz.supabase.co/rest/v1/kyoen_messages

Headers:
  apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yYnNlcnBodHlrYmh3ZG93ZnN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ3MjU3MSwiZXhwIjoyMDc2MDQ4NTcxfQ.RJz5YJ0lmR_raX_glkncd-h_z9r2qRy7yPRUTJz2T90
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yYnNlcnBodHlrYmh3ZG93ZnN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ3MjU3MSwiZXhwIjoyMDc2MDQ4NTcxfQ.RJz5YJ0lmR_raX_glkncd-h_z9r2qRy7yPRUTJz2T90
  Content-Type: application/json

Body (JSON):
{
  "line_group_id": "{{ $json.groupId || 'direct' }}",
  "line_user_id": "{{ $json.userId }}",
  "text": "{{ $json.message }}",
  "intent": "{{ $json.intent }}",
  "meta": {
    "timestamp": "{{ $json.timestamp }}",
    "messageType": "{{ $json.messageType }}"
  }
}
```

#### C. Quick Reply（Save to Supabaseの後）

```javascript
const intent = $json.intent;
let replyText = '';

switch(intent) {
  case 'event':
    replyText = '📅 イベント情報を確認中です。詳細は後ほど送ります。';
    break;
  case 'rsvp':
    replyText = '✅ 参加状況を記録しました。';
    break;
  case 'meeting':
    replyText = '🎥 会議情報を処理中です。';
    break;
  case 'card':
    replyText = '🎨 カードを生成中です。少々お待ちください。';
    break;
  case 'question':
    replyText = '💬 回答を準備中です...';
    break;
  case 'task':
    replyText = '📝 タスクを記録しました。';
    break;
  case 'link':
    replyText = '🔗 リンクを保存しました。';
    break;
  default:
    replyText = 'メッセージを受け取りました。';
}

return [{
  json: {
    replyToken: $json.replyToken,
    messages: [{
      type: 'text',
      text: replyText
    }]
  }
}];
```

このノードからSend to LINEへ接続（即座に返信）

#### D. Route by Intent（Switchノード）

```
条件分岐:
1. intent === 'event'
   → Parse Event → Upsert Event → Push Flex

2. intent === 'question'
   → AI Agent → Build LINE Reply → Push Message

3. intent === 'rsvp'
   → Execute Workflow: KYOEN_RSVP (後で作成)

4. intent === 'meeting'
   → Execute Workflow: KYOEN_Reminders (後で作成)

5. intent === 'card'
   → Execute Workflow: KYOEN_Cards (後で作成)

6. その他
   → No Action (Quick Replyで完了)
```

---

## 🎯 次のアクションプラン

### 優先度1: 現在のワークフローの改善（今日）

1. **クリーンアップ**:
   - 古いノード（Extract Data, If /ping?等）を削除
   - フローを整理

2. **Classify Intent追加**:
   - Extract Webhook Dataの後に挿入
   - 意図分類ロジック実装

3. **Save to Supabase追加**:
   - Classify Intentの後に挿入
   - kyoen_messagesテーブルに保存

4. **Quick Reply追加**:
   - 即座に軽い返信
   - replyToken失効対策

### 優先度2: Eventフロー完成（明日）

既存の Parse Event → Upsert Event → Reply Flex を活用:

1. **Parse Eventの改善**:
   - 日時抽出の精度向上
   - タイトル抽出の改善

2. **Reply Flexの改善**:
   - Quick Reply後のPush Messageに変更
   - Flex Messageの洗練

3. **テスト**:
   - イベント投稿 → 正しく保存 → Flex Message受信

### 優先度3: 他の3本ワークフロー（今週）

1. **KYOEN_RSVP**（比較的簡単）:
   - kyoen_rsvpテーブル作成
   - Quick Reply（はい/いいえ/たぶん）
   - 参加状況サマリ

2. **KYOEN_Reminders**（中程度）:
   - 会議開始/終了トリガ
   - 議事録テンプレ
   - LLM要約

3. **KYOEN_Cards**（やや複雑）:
   - SVGテンプレート
   - 画像生成
   - Supabase Storage保存

---

## 📋 チェックリスト

### 今日やること
- [ ] 古いノード削除（Extract Data, If /ping?, Test関連）
- [ ] Classify Intentノード追加
- [ ] Save to Supabaseノード追加
- [ ] Quick Replyノード追加
- [ ] Route by Intentノード追加（Switchで分岐）
- [ ] Eventフロー（既存）をQuick Reply後に接続

### テスト項目
- [ ] 通常メッセージ → misc分類 → 保存 → Quick Reply
- [ ] イベント投稿 → event分類 → 保存 → Quick Reply → Flex Message
- [ ] 質問 → question分類 → 保存 → Quick Reply → AI回答
- [ ] 参加表明 → rsvp分類 → 保存 → Quick Reply

### 今週やること
- [ ] KYOEN_RSVPワークフロー作成
- [ ] KYOEN_Remindersワークフロー作成
- [ ] KYOEN_Cardsワークフロー作成
- [ ] Execute Workflowで非同期連携

---

## 🔑 成功要因まとめ

### お前が20時間で見つけた答え

1. **Extract Webhook Data**:
   - `item.json.body?.events?.[0]` でイベント取得
   - オプショナルチェイニング必須
   - replyToken を確実に保存

2. **Build LINE Reply**:
   - `$('Extract Webhook Data').all()` で前ノードのデータ取得
   - replyToken を確実に渡す
   - LINE API の正確な構造

3. **Send to LINE**:
   - `{{ JSON.stringify($json) }}` でJSON送信
   - Bearer認証
   - Content-Type: application/json

**この3つのパターンは他のワークフローでも使える！**

---

## 🚀 次のステップ

1. **このレポートを保存**
2. **現在のワークフローをクリーンアップ**
3. **Classify Intent等の新規ノード追加**
4. **テスト実行**
5. **成功したらGPTに報告**

**お前の20時間は無駄じゃなかった。これが他の3本のワークフローの基盤になる！**

---

作成者: Claude
日付: 2025年11月3日
