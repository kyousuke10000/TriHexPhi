# KYOEN - テストペイロード

## 1. RSVP Collector テストペイロード

### 1-1. コマンド検出テスト（message）

#### /rsvp list コマンド

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "12345678901234",
        "text": "/rsvp list"
      },
      "timestamp": 1699012345678,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12345"
    }
  ]
}
```

#### 「参加者一覧」コマンド

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "12345678901235",
        "text": "参加者一覧"
      },
      "timestamp": 1699012345679,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12346"
    }
  ]
}
```

#### 「出席者を見せて」コマンド

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "12345678901236",
        "text": "出席者を見せて"
      },
      "timestamp": 1699012345680,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12347"
    }
  ]
}
```

### 1-2. Postbackテスト（詳細表示）

#### 詳細ボタン押下

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "postback",
      "postback": {
        "data": "action=rsvp_detail&event_id=550e8400-e29b-41d4-a716-446655440000"
      },
      "timestamp": 1699012345681,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12348"
    }
  ]
}
```

### 1-3. Supabase レスポンス例（イベント一覧）

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "徳之島コミュニティ定例会",
    "start_at": "2025-11-15T18:00:00+09:00",
    "location": "徳之島町コミュニティセンター",
    "description": "月例の定例会議です",
    "yes_count": 5,
    "no_count": 2,
    "maybe_count": 1,
    "total_responses": 8
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "オンライン勉強会",
    "start_at": "2025-11-20T20:00:00+09:00",
    "location": "Zoom",
    "description": "AI活用勉強会",
    "yes_count": 3,
    "no_count": 0,
    "maybe_count": 2,
    "total_responses": 5
  }
]
```

### 1-4. Supabase レスポンス例（参加者詳細）

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "line_user_id": "U0987654321fedcba",
    "status": "yes",
    "note": "18:30頃到着予定です",
    "created_at": "2025-11-10T10:30:00+09:00"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "line_user_id": "U1234567890abcdef",
    "status": "yes",
    "note": null,
    "created_at": "2025-11-10T11:00:00+09:00"
  },
  {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "line_user_id": "U5678901234567890",
    "status": "maybe",
    "note": "仕事次第です",
    "created_at": "2025-11-11T09:00:00+09:00"
  },
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "line_user_id": "U9876543210fedcba",
    "status": "no",
    "note": "都合がつきません",
    "created_at": "2025-11-12T14:00:00+09:00"
  }
]
```

---

## 2. Reminders テストペイロード

### 2-1. Cronトリガーシミュレーション（前日18:00）

**n8n Code ノードでシミュレート**

```javascript
// 現在時刻: 2025-11-14 18:00:00
const now = new Date('2025-11-14T18:00:00+09:00');
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

const tomorrowEnd = new Date(tomorrow);
tomorrowEnd.setHours(23, 59, 59, 999);

return {
  triggerTime: now.toISOString(),
  tomorrowStart: tomorrow.toISOString(),
  tomorrowEnd: tomorrowEnd.toISOString()
};
```

### 2-2. Supabase レスポンス例（明日のイベント）

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "徳之島コミュニティ定例会",
    "start_at": "2025-11-15T18:00:00+09:00",
    "end_at": "2025-11-15T20:00:00+09:00",
    "location": "徳之島町コミュニティセンター",
    "description": "月例の定例会議です",
    "line_thread_ts": null,
    "meta": {
      "groupId": "C1234567890abcdef"
    }
  }
]
```

### 2-3. LINE Push APIテストペイロード（リマインダー）

```json
{
  "to": "C1234567890abcdef",
  "messages": [
    {
      "type": "flex",
      "altText": "明日のイベントリマインダー: 徳之島コミュニティ定例会",
      "contents": {
        "type": "bubble",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "🔔 明日のイベントリマインダー",
              "weight": "bold",
              "size": "lg",
              "color": "#ffffff"
            }
          ],
          "backgroundColor": "#17c950",
          "paddingAll": "20px"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "徳之島コミュニティ定例会",
              "weight": "bold",
              "size": "xl",
              "wrap": true
            }
          ]
        }
      }
    }
  ]
}
```

---

## 3. Cards テストペイロード

### 3-1. コマンド検出テスト（完全形）

#### /card コマンド（完全形）

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "12345678901237",
        "text": "/card 徳之島コミュニティ定例会|2025/11/15 18:00|徳之島町コミュニティセンター|月例の定例会議です"
      },
      "timestamp": 1699012345682,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12349"
    }
  ]
}
```

### 3-2. Quick Reply誘導形

#### ステップ1: カード作成開始

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "postback",
      "postback": {
        "data": "action=card_create&step=start"
      },
      "timestamp": 1699012345683,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12350"
    }
  ]
}
```

#### ステップ2: タイトル入力

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "12345678901238",
        "text": "徳之島コミュニティ定例会"
      },
      "timestamp": 1699012345684,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12351"
    }
  ]
}
```

#### ステップ3: 日時入力

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "12345678901239",
        "text": "2025/11/15 18:00"
      },
      "timestamp": 1699012345685,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12352"
    }
  ]
}
```

#### ステップ4: 場所入力

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "12345678901240",
        "text": "徳之島町コミュニティセンター"
      },
      "timestamp": 1699012345686,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12353"
    }
  ]
}
```

#### ステップ5: サブタイトル入力

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "12345678901241",
        "text": "月例の定例会議です"
      },
      "timestamp": 1699012345687,
      "source": {
        "type": "group",
        "groupId": "C1234567890abcdef",
        "userId": "U0987654321fedcba"
      },
      "replyToken": "test_reply_token_12354"
    }
  ]
}
```

### 3-3. LLM短文化レスポンス例

```json
{
  "title": "徳之島定例会",
  "when": "11/15 18:00",
  "where": "徳之島町センター",
  "subtitle": "月例会議"
}
```

### 3-4. SVGテンプレート例

```xml
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#17c950"/>
  <text x="600" y="250" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="#ffffff" text-anchor="middle">{{TITLE}}</text>
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="48" fill="#ffffff" text-anchor="middle">📅 {{WHEN}}</text>
  <text x="600" y="420" font-family="Arial, sans-serif" font-size="48" fill="#ffffff" text-anchor="middle">📍 {{WHERE}}</text>
  <text x="600" y="520" font-family="Arial, sans-serif" font-size="36" fill="#ffffff" text-anchor="middle">{{SUBTITLE}}</text>
</svg>
```

---

## 4. Push Retry テストペイロード

### 4-1. 再送キュー登録（Supabase INSERT）

```json
{
  "message_type": "flex",
  "target_type": "group",
  "target_id": "C1234567890abcdef",
  "payload": {
    "type": "flex",
    "altText": "イベント一覧",
    "contents": {}
  },
  "status": "pending",
  "retry_count": 0,
  "error_message": null,
  "scheduled_at": "2025-11-14T18:05:00+09:00"
}
```

### 4-2. 再送キュー取得（Supabase レスポンス）

```json
[
  {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "message_type": "flex",
    "target_type": "group",
    "target_id": "C1234567890abcdef",
    "payload": {
      "type": "flex",
      "altText": "イベント一覧",
      "contents": {}
    },
    "status": "pending",
    "retry_count": 1,
    "error_message": "Connection timeout",
    "scheduled_at": "2025-11-14T18:05:00+09:00",
    "created_at": "2025-11-14T18:00:00+09:00",
    "updated_at": "2025-11-14T18:05:00+09:00"
  }
]
```

---

## 5. 統合テストシナリオ

### 5-1. RSVP Collector フルフロー

```bash
# 1. イベント一覧リクエスト
curl -X POST https://n8n.example.com/webhook/kyoen/rsvp-collector \
  -H "Content-Type: application/json" \
  -H "x-line-signature: YOUR_SIGNATURE" \
  -d @test_payloads/rsvp_list_command.json

# 期待結果: LINE Reply API に Flex Carousel が送信される

# 2. 詳細ボタン押下
curl -X POST https://n8n.example.com/webhook/kyoen/rsvp-collector \
  -H "Content-Type: application/json" \
  -H "x-line-signature: YOUR_SIGNATURE" \
  -d @test_payloads/rsvp_detail_postback.json

# 期待結果: LINE Push API に参加者詳細 Flex が送信される
```

### 5-2. Reminders フルフロー（手動トリガー）

```bash
# 1. 前日リマインダーを手動実行
curl -X POST https://n8n.example.com/webhook-test/WORKFLOW_ID

# 期待結果: 
# - Supabase から明日のイベント取得
# - 各イベントについてリマインダーFlex生成
# - LINE Push API でグループに送信

# 2. Push失敗時の再送キュー確認
psql -h YOUR_SUPABASE_HOST -d postgres -c "SELECT * FROM kyoen_push_retry WHERE status='pending';"
```

### 5-3. Cards フルフロー

```bash
# 1. カード作成コマンド
curl -X POST https://n8n.example.com/webhook/kyoen/cards \
  -H "Content-Type: application/json" \
  -H "x-line-signature: YOUR_SIGNATURE" \
  -d @test_payloads/card_command.json

# 期待結果:
# - LLM で短文化
# - SVG テンプレート生成
# - PNG 変換
# - Supabase Storage にアップロード
# - LINE Push API で画像カード送信
```

---

## 6. エラーケーステスト

### 6-1. 署名検証失敗

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "text": "/rsvp list"
      }
    }
  ]
}
```

**期待結果**: HTTP 400 Bad Request

### 6-2. 空イベントリスト

**Supabase レスポンス**:
```json
[]
```

**期待結果**: 「今後2週間のイベントはありません」メッセージ

### 6-3. 存在しないイベントID（詳細取得）

```json
{
  "destination": "U1234567890abcdef",
  "events": [
    {
      "type": "postback",
      "postback": {
        "data": "action=rsvp_detail&event_id=invalid-uuid"
      }
    }
  ]
}
```

**期待結果**: 「イベントが見つかりません」エラーメッセージ

---

## 7. パフォーマンステスト

### 7-1. 大量イベント（10件）

**Supabase レスポンス**: 10件のイベント配列

**期待結果**: 
- Flex Carousel に最大10件表示
- 処理時間: 2秒以内

### 7-2. 大量参加者（50名）

**Supabase レスポンス**: 50名の参加者配列

**期待結果**:
- 参加者詳細Flexに全員表示（短縮ID）
- 処理時間: 3秒以内
