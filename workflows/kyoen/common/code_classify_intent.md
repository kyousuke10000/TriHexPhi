# Intent Classification

**Purpose:** Classify user message intent from text  
**Output:** `event` | `question` | `other`

---

## Implementation

```javascript
const t = ($json.message_text || '').trim();

let intent = 'other';

// Event patterns: date/time/location/start/participation
if (/[日月火水木金土]|(\d{1,2}[:時]\d{0,2})|場所|会場|開始|開場|参加/.test(t)) {
  intent = 'event';
}
// Question patterns: question marks, interrogatives
else if (/[?？]|いつ|どこ|どうやって|方法|値段|費用|誰/.test(t)) {
  intent = 'question';
}

$json.intent = intent;
return $input.all();
```

---

## Test Cases

### Event Intent (10 cases)

1. `"11/3 15:00 オンライン会議"` → `event`
2. `"来週月曜日に開催"` → `event`
3. `"会場は徳之島コミュニティセンター"` → `event`
4. `"開始は9時から"` → `event`
5. `"参加希望者は連絡ください"` → `event`
6. `"2025年11月15日 10:00-12:00"` → `event`
7. `"明日の14時から"` → `event`
8. `"場所はZoomです"` → `event`
9. `"開場は30分前から"` → `event`
10. `"参加者募集"` → `event`

### Question Intent (10 cases)

1. `"いつですか？"` → `question`
2. `"どこで開催？"` → `question`
3. `"どうやって参加？"` → `question`
4. `"方法を教えて"` → `question`
5. `"値段はいくら？"` → `question`
6. `"費用はかかりますか"` → `question`
7. `"誰が主催？"` → `question`
8. `"何時から？"` → `question`
9. `"どこで？"` → `question`
10. `"参加方法は？"` → `question`

### Other Intent (10 cases)

1. `"こんにちは"` → `other`
2. `"ありがとう"` → `other`
3. `"了解です"` → `other`
4. `"よろしく"` → `other`
5. `"お疲れさま"` → `other`
6. `"失礼します"` → `other`
7. `"確認しました"` → `other`
8. `"承知しました"` → `other`
9. `"おはようございます"` → `other`
10. `"おやすみなさい"` → `other`

---

## Acceptance Criteria

- ✅ All 30 test cases pass
- ✅ Output: `$json.intent` set to one of `event`, `question`, `other`
- ✅ Returns all items unchanged

---

**Generated:** 2025-11-03 / Cursor (☿)

