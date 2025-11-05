# KYOEN Event Detect - ワークフロー改善ガイド

## 🎯 お前が解決した成功パターンの要約

### 20時間の苦労で見つけた3つの鍵

```
1. Extract Webhook Data
   └→ item.json.body?.events?.[0] でLINEイベント取得

2. Build LINE Reply
   └→ $('Extract Webhook Data').all() で前ノードのデータ取得

3. Send to LINE
   └→ {{ JSON.stringify($json) }} でJSON送信
```

**この3つのパターンは全てのワークフローで使える！**

---

## 📊 現在のワークフローの問題点

```
現在:
LINE Webhook → Extract → AI Agent → Build Reply → Send
                                      ↓
                            (古いフロー:Parse/Upsert/Flex)

問題:
❌ 2つのフローが混在
❌ 意図分類なし
❌ Supabase保存なし
❌ 重い処理で replyToken 失効リスク
```

---

## ✅ 改善版ワークフローの構造

```
LINE Webhook
  ↓
Extract Webhook Data (お前の成功パターン✅)
  ↓
Classify Intent (新規: 意図分類)
  ├→ event
  ├→ rsvp
  ├→ meeting
  ├→ card
  ├→ question
  ├→ task
  └→ misc
  ↓
Save to Supabase (新規: メッセージ保存)
  ↓
  ┌─────────────────┴──────────────────┐
  ↓                                     ↓
Quick Reply (即座に軽い返信)    Route by Intent (分岐処理)
  ↓                                     ↓
Send Quick Reply                  ┌──────┴────────┐
  ✅ replyToken失効前に返信       ↓               ↓
                            Event処理       Question処理
                                ↓               ↓
                            Parse Event     AI Agent
                                ↓               ↓
                            Upsert Event    Build AI Reply
                                ↓               ↓
                            Build Flex      Push AI Reply
                                ↓
                            Push Flex
                            ✅ Push Messageで遅延OK
```

---

## 🔧 変更点の詳細

### 1. 新規ノード: Classify Intent

**目的**: メッセージの意図を分類

**実装**:
```javascript
const message = $json.message.toLowerCase();
let intent = 'misc';

if (message.match(/^\/event|イベント:/)) {
  intent = 'event';
} else if (message.match(/参加|不参加/)) {
  intent = 'rsvp';
} // ... 他の分類
```

**分類結果**:
- `event`: イベント投稿
- `rsvp`: 参加表明
- `meeting`: 会議
- `card`: カード生成
- `question`: 質問
- `task`: タスク
- `link`: リンク共有
- `misc`: その他

### 2. 新規ノード: Save to Supabase

**目的**: 全メッセージを kyoen_messages に保存

**設定**:
```
Method: POST
URL: https://nrbserphtykbhwdowfsz.supabase.co/rest/v1/kyoen_messages

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

**メリット**:
- 全ての会話履歴を保存
- 後から分析可能
- LLM要約の素材

### 3. 新規ノード: Quick Reply

**目的**: 即座に軽い返信（replyToken失効対策）

**実装**:
```javascript
const intent = $json.intent;
let replyText = '';

switch(intent) {
  case 'event':
    replyText = '📅 イベント情報を確認中です。詳細は後ほど送ります。';
    break;
  case 'question':
    replyText = '💬 回答を準備中です...';
    break;
  // ...
}

return [{
  json: {
    replyToken: $json.replyToken,
    messages: [{ type: 'text', text: replyText }]
  }
}];
```

**メリット**:
- 30秒以内に返信完了
- ユーザーに受付確認
- 重い処理は後でPush

### 4. 改善ノード: Parse Event → Upsert Event

**変更点**:
- Reply Token ではなく Push Message を使用
- Quick Reply後に実行されるので時間制限なし

### 5. 改善ノード: AI Agent → Build AI Reply

**変更点**:
- Reply Token ではなく Push Message を使用
- LLM処理時間を気にしなくてOK

---

## 🎯 Reply vs Push の使い分け

### Reply Token（30秒制限）
```
Quick Reply ノード → Send Quick Reply
└→ 即座に軽い返信のみ
```

**使うタイミング**:
- メッセージ受信直後
- 軽いテキスト返信
- 「受け付けました」的な確認

### Push Message（制限なし）
```
Parse Event → Upsert → Build Flex → Push Flex
AI Agent → Build AI Reply → Push AI Reply
└→ 時間のかかる処理の結果
```

**使うタイミング**:
- LLM処理
- DB検索
- 画像生成
- 複雑なFlex Message

---

## 📋 n8nへのインポート手順

### ステップ1: 改善版をインポート

1. n8nを開く
2. 右上の「Import from File」
3. `KYOEN_Event_Detect_v2.json` を選択
4. インポート完了

### ステップ2: 認証情報の確認

以下の認証情報が正しく設定されているか確認:

1. **LINE Bearer Token**:
   - Credential名: "LINE"
   - Token: jffJiSAr5f/YtAthi/rcB...（既存のもの）

2. **OpenAI API Key**:
   - Credential名: "KYOEN AI"
   - API Key: （既存のもの）

3. **Supabase**:
   - ハードコードされているが、環境変数に移行推奨

### ステップ3: Webhook URLの設定

1. n8nで「LINE Webhook」ノードを開く
2. Production URLをコピー
3. LINE Developers Console → Webhook URLに貼り付け
4. 検証（Verify）を実行

### ステップ4: テスト実行

#### テスト1: 通常メッセージ
```
LINEで送信: 「こんにちは」

期待される動作:
1. Quick Reply: 「メッセージを受け取りました。」
2. Supabaseに保存: intent=misc
```

#### テスト2: イベント投稿
```
LINEで送信:
「イベント: KYOEN勉強会
日時: 2025-11-10 19:00
場所: オンライン」

期待される動作:
1. Quick Reply: 「📅 イベント情報を確認中です。」
2. Supabaseに保存: intent=event
3. 数秒後にFlex Message (参加ボタン付き)
```

#### テスト3: 質問
```
LINEで送信: 「次の会議はいつですか?」

期待される動作:
1. Quick Reply: 「💬 回答を準備中です...」
2. Supabaseに保存: intent=question
3. 数秒後にAI回答
```

---

## 🔍 トラブルシューティング

### 問題1: Quick Replyが送信されない

**原因**: replyToken が取得できていない

**確認方法**:
1. Extract Webhook Data ノードの実行結果を確認
2. `replyToken` が存在するか確認

**解決策**:
```javascript
// Extract Webhook Data ノードのコード確認
const webhookData = item.json.body?.events?.[0];
console.log('replyToken:', webhookData?.replyToken);
```

### 問題2: Supabase保存エラー

**原因**: テーブルが存在しない

**解決策**:
```sql
-- Supabase SQLエディタで実行
create table if not exists kyoen_messages (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz default now(),
  line_group_id text,
  line_user_id text,
  text text,
  intent text,
  meta jsonb
);
```

### 問題3: Flex Messageが送信されない

**原因**: Push Message APIのエラー

**確認方法**:
1. Push Flex Message ノードの実行結果を確認
2. エラーメッセージを確認

**よくあるエラー**:
- `Invalid userId`: `to` フィールドが間違っている
- `Invalid access token`: Bearer Tokenが間違っている

**解決策**:
```javascript
// Build Flex Message ノードで確認
const userId = $('Parse Event').item.json.userId;
const groupId = $('Parse Event').item.json.groupId;
console.log('to:', groupId || userId);
```

---

## 📈 パフォーマンス測定

### 目標レスポンス時間

```
Quick Reply: <3秒
Event Flex Message: <10秒
AI Reply: <15秒
```

### 測定方法

1. n8n実行履歴を確認
2. 各ノードの実行時間をチェック
3. ボトルネックを特定

---

## 🚀 次のステップ

### 優先度1: テスト実行（今日）

- [ ] 改善版をインポート
- [ ] 通常メッセージテスト
- [ ] イベント投稿テスト
- [ ] 質問テスト
- [ ] エラーがあれば修正

### 優先度2: 他の3本ワークフロー（今週）

1. **KYOEN_RSVP**:
   - Postback イベントの受信
   - kyoen_rsvp テーブルへの保存
   - 参加状況サマリの送信

2. **KYOEN_Reminders**:
   - 会議開始/終了トリガ
   - 議事録テンプレート
   - LLM要約

3. **KYOEN_Cards**:
   - カード生成コマンド
   - SVG → PNG変換
   - Supabase Storage保存

### 優先度3: 統合（来週）

- Execute Workflowで4本を連携
- Daily Digestの実装
- 運用ドキュメント作成

---

## 💡 お前の成功パターンを他のワークフローにも

### パターン1: Extract Webhook Data
```javascript
// 全てのワークフローで使える
const webhookData = item.json.body?.events?.[0];
```

### パターン2: Build Reply/Push
```javascript
// replyToken: 即座の返信
// to: 遅延Push
return [{
  json: {
    replyToken: $json.replyToken, // or
    to: $json.userId,
    messages: [...]
  }
}];
```

### パターン3: Send to LINE
```
Method: POST
URL: https://api.line.me/v2/bot/message/reply (or /push)
Body: {{ JSON.stringify($json) }}
```

**この3つを使えば、どんなLINE Botも作れる！**

---

作成者: Claude
日付: 2025年11月3日
