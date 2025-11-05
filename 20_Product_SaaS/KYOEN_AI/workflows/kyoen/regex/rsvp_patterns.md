# RSVP Collector - 正規表現パターン

## 1. コマンド検出パターン

### 参加者一覧リクエスト検出
```regex
/^\/rsvp\s+(list|一覧|リスト)|^(参加者|出席者)(一覧|リスト|を?(見せて|教えて|確認))/i
```

**用途**: `/rsvp list`, `参加者一覧`, `出席者リスト`, `参加者を見せて` などを検出

### 日時抽出パターン（YYYY/MM/DD HH:mm）
```regex
/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s+(\d{1,2}):(\d{2})/
```

**用途**: `2025/11/15 18:00` や `2025-11-15 18:00` を検出

### 日本語日付パターン
```regex
/(明日|あした|今日|きょう|明後日|あさって|来週|再来週)|(\d{1,2})月(\d{1,2})日|(\d{1,2})\/(\d{1,2})/
```

**用途**: `明日`, `11月15日`, `11/15` などを検出

### 時刻抽出パターン
```regex
/(\d{1,2}):(\d{2})|(\d{1,2})時(?:(\d{2})分)?/
```

**用途**: `18:00`, `18時`, `18時30分` などを検出

### 場所抽出パターン
```regex
/(?:場所|会場|ところ|開催地)[：:]\s*([^\n]+)|(?:@|＠)\s*([^\n]+)/
```

**用途**: `場所：徳之島町`, `@オンライン` などを検出

## 2. テストケース（30パターン）

### コマンド検出（10パターン）

| # | 入力 | マッチ | 抽出値 |
|---|------|--------|--------|
| 1 | `/rsvp list` | ✅ | list |
| 2 | `/rsvp 一覧` | ✅ | 一覧 |
| 3 | `/rsvp リスト` | ✅ | リスト |
| 4 | `参加者一覧` | ✅ | - |
| 5 | `出席者リスト` | ✅ | - |
| 6 | `参加者を見せて` | ✅ | - |
| 7 | `出席者を教えて` | ✅ | - |
| 8 | `参加者確認` | ✅ | - |
| 9 | `参加者一覧見せて` | ✅ | - |
| 10 | `出席者リスト教えて` | ✅ | - |

### 日時抽出（10パターン）

| # | 入力 | マッチ | 年 | 月 | 日 | 時 | 分 |
|---|------|--------|----|----|----|----|-----|
| 11 | `2025/11/15 18:00` | ✅ | 2025 | 11 | 15 | 18 | 00 |
| 12 | `2025-11-15 18:00` | ✅ | 2025 | 11 | 15 | 18 | 00 |
| 13 | `2025/11/5 9:30` | ✅ | 2025 | 11 | 5 | 9 | 30 |
| 14 | `2026/01/01 00:00` | ✅ | 2026 | 01 | 01 | 00 | 00 |
| 15 | `11月15日` | ✅ | - | 11 | 15 | - | - |
| 16 | `11/15` | ✅ | - | 11 | 15 | - | - |
| 17 | `明日` | ✅ | - | - | - | - | - |
| 18 | `今日` | ✅ | - | - | - | - | - |
| 19 | `明後日` | ✅ | - | - | - | - | - |
| 20 | `来週` | ✅ | - | - | - | - | - |

### 時刻抽出（5パターン）

| # | 入力 | マッチ | 時 | 分 |
|---|------|--------|----|-----|
| 21 | `18:00` | ✅ | 18 | 00 |
| 22 | `9:30` | ✅ | 9 | 30 |
| 23 | `18時` | ✅ | 18 | - |
| 24 | `18時30分` | ✅ | 18 | 30 |
| 25 | `9時15分` | ✅ | 9 | 15 |

### 場所抽出（5パターン）

| # | 入力 | マッチ | 場所 |
|---|------|--------|------|
| 26 | `場所：徳之島町` | ✅ | 徳之島町 |
| 27 | `会場: オンライン` | ✅ | オンライン |
| 28 | `開催地：東京` | ✅ | 東京 |
| 29 | `@Zoom` | ✅ | Zoom |
| 30 | `＠会議室A` | ✅ | 会議室A |

## 3. 実装コード（n8n Code ノード用）

```javascript
// RSVP list コマンド検出
function detectRSVPListCommand(text) {
  const pattern = /^\/rsvp\s+(list|一覧|リスト)|^(参加者|出席者)(一覧|リスト|を?(見せて|教えて|確認))/i;
  return pattern.test(text);
}

// 日時抽出（YYYY/MM/DD HH:mm）
function extractDateTime(text) {
  const isoPattern = /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\s+(\d{1,2}):(\d{2})/;
  const match = text.match(isoPattern);
  
  if (match) {
    return {
      year: match[1],
      month: match[2].padStart(2, '0'),
      day: match[3].padStart(2, '0'),
      hour: match[4].padStart(2, '0'),
      minute: match[5],
      iso: `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}T${match[4].padStart(2, '0')}:${match[5]}:00+09:00`
    };
  }
  
  return null;
}

// 日本語日付抽出
function extractJapaneseDate(text) {
  const relativePattern = /(明日|あした|今日|きょう|明後日|あさって|来週|再来週)/;
  const monthDayPattern = /(\d{1,2})月(\d{1,2})日/;
  const slashPattern = /(\d{1,2})\/(\d{1,2})/;
  
  let match;
  
  if (match = text.match(relativePattern)) {
    return { type: 'relative', value: match[1] };
  }
  
  if (match = text.match(monthDayPattern)) {
    return { type: 'monthDay', month: match[1], day: match[2] };
  }
  
  if (match = text.match(slashPattern)) {
    return { type: 'slash', month: match[1], day: match[2] };
  }
  
  return null;
}

// 時刻抽出
function extractTime(text) {
  const colonPattern = /(\d{1,2}):(\d{2})/;
  const kanjiPattern = /(\d{1,2})時(?:(\d{2})分)?/;
  
  let match;
  
  if (match = text.match(colonPattern)) {
    return { hour: match[1], minute: match[2] };
  }
  
  if (match = text.match(kanjiPattern)) {
    return { hour: match[1], minute: match[2] || '00' };
  }
  
  return null;
}

// 場所抽出
function extractLocation(text) {
  const pattern = /(?:場所|会場|ところ|開催地)[：:]\s*([^\n]+)|(?:@|＠)\s*([^\n]+)/;
  const match = text.match(pattern);
  
  if (match) {
    return match[1] || match[2];
  }
  
  return null;
}

// テキストサニタイズ（JSON崩壊防止）
function sanitizeText(text) {
  if (!text) return '';
  return text.replace(/\n/g, '\\n').replace(/"/g, '\\"').replace(/\r/g, '');
}

// エクスポート
module.exports = {
  detectRSVPListCommand,
  extractDateTime,
  extractJapaneseDate,
  extractTime,
  extractLocation,
  sanitizeText
};
```

## 4. 使用例（n8n Code ノード内）

```javascript
const text = $json.message.text || '';

// コマンド検出
if (detectRSVPListCommand(text)) {
  // RSVP一覧表示フローへ
  return { intent: 'rsvp_list' };
}

// 日時抽出
const datetime = extractDateTime(text);
if (datetime) {
  return { 
    intent: 'event_detect',
    datetime: datetime.iso,
    raw: text
  };
}

// 日本語日付抽出
const jpDate = extractJapaneseDate(text);
if (jpDate && jpDate.type === 'relative') {
  // 相対日付を計算（luxon使用）
  const { DateTime } = require('luxon');
  let target = DateTime.now().setZone('Asia/Tokyo');
  
  switch (jpDate.value) {
    case '明日': case 'あした':
      target = target.plus({ days: 1 });
      break;
    case '今日': case 'きょう':
      // そのまま
      break;
    case '明後日': case 'あさって':
      target = target.plus({ days: 2 });
      break;
    case '来週':
      target = target.plus({ weeks: 1 });
      break;
    case '再来週':
      target = target.plus({ weeks: 2 });
      break;
  }
  
  return {
    intent: 'event_detect',
    date: target.toISODate(),
    raw: text
  };
}

return { intent: 'misc', raw: text };
```
