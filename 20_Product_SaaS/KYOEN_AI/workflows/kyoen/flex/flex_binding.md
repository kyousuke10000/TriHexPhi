# Flex Message - データバインディング

## 1. イベント一覧（event_list.flex.json）のバインディング

### n8n Codeノード用

```javascript
// Supabaseから取得したイベントデータをFlex Messageに変換
function buildEventListFlex(events) {
  const fs = require('fs');
  const path = require('path');
  
  // Flex雛形を読み込み（実際は外部ファイルまたは環境変数から）
  const flexTemplate = JSON.parse(fs.readFileSync('/path/to/event_list.flex.json', 'utf8'));
  
  // イベントごとにbubbleを生成
  const bubbles = events.map(event => {
    const bubble = JSON.parse(JSON.stringify(flexTemplate.contents[0])); // Deep copy
    
    // プレースホルダーを実データで置換
    const bubbleString = JSON.stringify(bubble);
    const replaced = bubbleString
      .replace(/{{EVENT_ID}}/g, event.id)
      .replace(/{{EVENT_TITLE}}/g, event.title || '無題のイベント')
      .replace(/{{START_DATE}}/g, formatDate(event.start_at))
      .replace(/{{LOCATION}}/g, event.location || '未定')
      .replace(/{{YES_COUNT}}/g, event.yes_count || 0)
      .replace(/{{NO_COUNT}}/g, event.no_count || 0)
      .replace(/{{MAYBE_COUNT}}/g, event.maybe_count || 0);
    
    return JSON.parse(replaced);
  });
  
  return {
    type: 'carousel',
    contents: bubbles.slice(0, 10) // LINE Flex Carouselは最大10個まで
  };
}

// 日時フォーマット（YYYY/MM/DD HH:mm形式）
function formatDate(isoString) {
  if (!isoString) return '日時未定';
  
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}/${month}/${day} ${hour}:${minute}`;
}

// 使用例
const events = $json.body; // Supabaseからのレスポンス
const flexMessage = buildEventListFlex(events);

return {
  flexMessage,
  messageType: 'flex',
  altText: `今後のイベント一覧（${events.length}件）`
};
```

## 2. 参加者詳細（rsvp_detail.flex.json）のバインディング

### n8n Codeノード用

```javascript
// 参加者データをFlex Messageに変換
function buildRSVPDetailFlex(event, rsvps) {
  const fs = require('fs');
  const flexTemplate = JSON.parse(fs.readFileSync('/path/to/rsvp_detail.flex.json', 'utf8'));
  
  // 参加者をステータスごとに分類
  const yesUsers = rsvps.filter(r => r.status === 'yes');
  const maybeUsers = rsvps.filter(r => r.status === 'maybe');
  const noUsers = rsvps.filter(r => r.status === 'no');
  
  // ユーザーIDを短縮表示（最後4文字）
  const formatUserId = (userId) => `...${userId.slice(-4)}`;
  
  // ユーザーリストを文字列に変換
  const yesUsersList = yesUsers.length > 0 
    ? yesUsers.map(u => formatUserId(u.line_user_id)).join(', ')
    : 'なし';
  
  const maybeUsersList = maybeUsers.length > 0
    ? maybeUsers.map(u => formatUserId(u.line_user_id)).join(', ')
    : 'なし';
  
  const noUsersList = noUsers.length > 0
    ? noUsers.map(u => formatUserId(u.line_user_id)).join(', ')
    : 'なし';
  
  // メモ・コメントを集約
  const notes = rsvps
    .filter(r => r.note && r.note.trim() !== '')
    .map(r => `${formatUserId(r.line_user_id)}: ${r.note}`)
    .join('\n');
  
  const notesText = notes || '特になし';
  
  // プレースホルダーを実データで置換
  const flexString = JSON.stringify(flexTemplate);
  const replaced = flexString
    .replace(/{{EVENT_TITLE}}/g, event.title || '無題のイベント')
    .replace(/{{START_DATE}}/g, formatDate(event.start_at))
    .replace(/{{LOCATION}}/g, event.location || '未定')
    .replace(/{{YES_COUNT}}/g, yesUsers.length)
    .replace(/{{MAYBE_COUNT}}/g, maybeUsers.length)
    .replace(/{{NO_COUNT}}/g, noUsers.length)
    .replace(/{{YES_USERS}}/g, yesUsersList)
    .replace(/{{MAYBE_USERS}}/g, maybeUsersList)
    .replace(/{{NO_USERS}}/g, noUsersList)
    .replace(/{{NOTES}}/g, notesText);
  
  return JSON.parse(replaced);
}

// 使用例
const event = $json.event; // イベント基本情報
const rsvps = $json.rsvps; // 参加者データ配列

const flexMessage = buildRSVPDetailFlex(event, rsvps);

return {
  flexMessage,
  messageType: 'flex',
  altText: `${event.title} - 参加者詳細`
};
```

## 3. リマインダー（reminder.flex.json）のバインディング

### n8n Codeノード用

```javascript
// リマインダーFlex Messageを生成
function buildReminderFlex(event, rsvps, reminderType) {
  const fs = require('fs');
  const flexTemplate = JSON.parse(fs.readFileSync('/path/to/reminder.flex.json', 'utf8'));
  
  // リマインダータイプに応じた設定
  const reminderConfig = {
    'day_before': {
      icon: '🔔',
      type: '明日のイベントリマインダー',
      color: '#17c950',
      message: '明日開催されるイベントのお知らせです。参加予定の方は準備をお願いします。',
      additionalInfo: '参加状況の変更は下のボタンから行えます。'
    },
    'morning': {
      icon: '☀️',
      type: '本日のイベント最終案内',
      color: '#ffa500',
      message: '本日開催されるイベントです。お気をつけてお越しください。',
      additionalInfo: '何かご不明な点がありましたらグループでお知らせください。'
    },
    'after': {
      icon: '📝',
      type: 'イベント議事録',
      color: '#3498db',
      message: 'イベントの議事録をお送りします。内容をご確認ください。',
      additionalInfo: '追加・修正がありましたら返信してください。'
    }
  };
  
  const config = reminderConfig[reminderType] || reminderConfig['day_before'];
  
  // 参加者数を集計
  const yesCount = rsvps.filter(r => r.status === 'yes').length;
  const maybeCount = rsvps.filter(r => r.status === 'maybe').length;
  const noCount = rsvps.filter(r => r.status === 'no').length;
  
  // プレースホルダーを実データで置換
  const flexString = JSON.stringify(flexTemplate);
  const replaced = flexString
    .replace(/{{REMINDER_TYPE_ICON}}/g, config.icon)
    .replace(/{{REMINDER_TYPE}}/g, config.type)
    .replace(/{{REMINDER_COLOR}}/g, config.color)
    .replace(/{{EVENT_TITLE}}/g, event.title || '無題のイベント')
    .replace(/{{START_DATETIME}}/g, formatDateTime(event.start_at))
    .replace(/{{LOCATION}}/g, event.location || '未定')
    .replace(/{{REMINDER_MESSAGE}}/g, config.message)
    .replace(/{{YES_COUNT}}/g, yesCount)
    .replace(/{{MAYBE_COUNT}}/g, maybeCount)
    .replace(/{{NO_COUNT}}/g, noCount)
    .replace(/{{ADDITIONAL_INFO}}/g, config.additionalInfo)
    .replace(/{{EVENT_ID}}/g, event.id);
  
  return JSON.parse(replaced);
}

// 日時フォーマット（詳細版）
function formatDateTime(isoString) {
  if (!isoString) return '日時未定';
  
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  
  return `${year}/${month}/${day}（${weekday}）${hour}:${minute}`;
}

// 使用例
const event = $json.event;
const rsvps = $json.rsvps;
const reminderType = $json.reminderType; // 'day_before' | 'morning' | 'after'

const flexMessage = buildReminderFlex(event, rsvps, reminderType);

return {
  flexMessage,
  messageType: 'flex',
  altText: `${event.title} - リマインダー`
};
```

## 4. LINE Push API呼び出し

### n8n HTTP Requestノード設定

**URL**: `https://api.line.me/v2/bot/message/push`

**Method**: POST

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{$env.N8N_LINE_TOKEN}}"
}
```

**Body**:
```json
{
  "to": "{{$json.groupId || $json.userId}}",
  "messages": [
    {
      "type": "flex",
      "altText": "{{$json.altText}}",
      "contents": {{$json.flexMessage}}
    }
  ]
}
```

## 5. 統合使用例（n8n ワークフロー）

### RSVP Collector ワークフロー

```
Webhook → Code(コマンド検出)
   ↓
HTTP Request(Supabase: イベント一覧取得)
   ↓
Code(Flex生成: buildEventListFlex)
   ↓
HTTP Request(LINE Push API)
   ↓
Code(ログ記録)
```

### 参加者詳細ワークフロー（postback）

```
Webhook(postback) → Code(event_id抽出)
   ↓
HTTP Request(Supabase: イベント情報取得)
   ↓
HTTP Request(Supabase: 参加者取得)
   ↓
Code(Flex生成: buildRSVPDetailFlex)
   ↓
HTTP Request(LINE Push API)
```

### リマインダーワークフロー（Cron）

```
Schedule Trigger(Cron: 前日18:00)
   ↓
HTTP Request(Supabase: 明日のイベント取得)
   ↓
Code(対象イベント判定)
   ↓
HTTP Request(Supabase: 参加者取得)
   ↓
Code(Flex生成: buildReminderFlex)
   ↓
HTTP Request(LINE Push API: グループ全員)
```
