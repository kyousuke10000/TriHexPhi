# n8n Manual Setup - Zero Friction Ops

**Date:** 2025-11-02  
**Purpose:** 4 workflows manual deployment  
**Status:** ⏳ Ready for shiryu

---

## Quick Steps

### 1. Open n8n UI

**URL:** https://acmocracy.app  
**Login:** Your n8n credentials

---

### 2. Create Workflow: event-detect

**Step 1:** New workflow → Name: "KYOEN Event Detect"

**Step 2:** Add nodes (drag from left panel):

**Node 1: LINE Webhook**
- Type: Webhook
- Webhook path: `kyoen-line-in`
- Save and copy webhook URL

**Node 2: Extract Data (Code)**
```javascript
const events = $input.item.json.events;
const event = events[0];
const message = event.message.text;

// Date patterns
const dateMatch1 = message.match(/(\d{4})-(\d{2})-(\d{2})/);
const dateMatch2 = message.match(/(\d{1,2})\/(\d{1,2})/);
const timeMatch = message.match(/(\d{1,2}):(\d{2})(?:\s*-\s*(\d{1,2}):(\d{2}))?/);
const zoomMatch = message.match(/(https?:\/\/(?:[^\s]+)?zoom\.us\/[^\s?]+\?pwd=[^\s]+)/);

let dateStr = null;
if (dateMatch1) {
  dateStr = `${dateMatch1[1]}-${dateMatch1[2]}-${dateMatch1[3]}`;
} else if (dateMatch2) {
  const year = new Date().getFullYear();
  dateStr = `${year}-${dateMatch2[1].padStart(2, '0')}-${dateMatch2[2].padStart(2, '0')}`;
}

let timeStr = '00:00';
if (timeMatch) {
  timeStr = timeMatch[0];
}

const title = message.split('\n')[0].trim();
const zoomUrl = zoomMatch ? zoomMatch[0] : null;
const startAt = dateStr ? `${dateStr}T${timeStr}:00+09:00` : null;

return { title, startAt, zoomUrl, message, replyToken: event.replyToken };
```

**Node 3: Upsert Event (HTTP)**
- Method: POST
- URL: `https://nrbserphtykbhwdowfsz.supabase.co/rest/v1/tokunoshima_events`
- Headers:
  - `apikey`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yYnNlcnBodHlrYmh3ZG93ZnN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ3MjU3MSwiZXhwIjoyMDc2MDQ4NTcxfQ.RJz5YJ0lmR_raX_glkncd-h_z9r2qRy7yPRUTJz2T90`
  - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yYnNlcnBodHlrYmh3ZG93ZnN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ3MjU3MSwiZXhwIjoyMDc2MDQ4NTcxfQ.RJz5YJ0lmR_raX_glkncd-h_z9r2qRy7yPRUTJz2T90`
  - `Prefer`: `return=representation,resolution=merge-duplicates`
- Body (JSON):
```json
{
  "title": "={{ $json.title }}",
  "start_at": "={{ $json.startAt }}",
  "zoom_url": "={{ $json.zoomUrl }}",
  "created_by": "tokunoshima"
}
```

**Node 4: Reply Flex (HTTP)**
- Method: POST
- URL: `https://api.line.me/v2/bot/message/reply`
- Headers:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer jffJiSAr5f/YtAthi/rcB3zwP0rew1y8OXPiJH3BSNd31oxheNvg1wT1VaTM7KorLFINWDWwelf1Hx7ptKEd8a9U5clDDerK8shFJtKp1bwCt8BNQhuB5m8LSGKsUhfIX+DX+gXY0kiBhMAXWdW70AdB04t89/1O/w1cDnyilFU=`
- Body (JSON):
```json
{
  "replyToken": "={{ $json.replyToken }}",
  "messages": [{
    "type": "flex",
    "altText": "={{ $('Extract Data').item.json.title }}",
    "contents": {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {"type": "text", "text": "={{ $('Extract Data').item.json.title }}", "weight": "bold"},
          {"type": "text", "text": "={{ $('Extract Data').item.json.startAt }}"}
        ]
      },
      "footer": {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {"type": "button", "action": {"type": "postback", "data": "going:={{ $json.id }}", "label": "参加する"}},
          {"type": "button", "action": {"type": "postback", "data": "maybe:={{ $json.id }}", "label": "検討中"}},
          {"type": "button", "action": {"type": "postback", "data": "mute:={{ $json.id }}", "label": "聞かせて"}}
        ]
      }
    }
  }]
}
```

**Step 3:** Connect nodes in order: Webhook → Extract → Upsert → Reply

**Step 4:** Save and activate

---

### 3. Create Workflow: rsvp

**Similar structure:**
1. LINE Webhook (path: `kyoen-rsvp`)
2. Parse Postback (Code)
3. Upsert RSVP (HTTP → Supabase)
4. Reply Snack (HTTP → LINE)

**Parse Code:**
```javascript
const events = $input.item.json.events;
const event = events[0];
const data = event.postback.data;
const [status, event_id] = data.split(':');
const user_id = event.source.userId;

return { status, event_id, user_id, replyToken: event.replyToken };
```

**Upsert URL:** `https://nrbserphtykbhwdowfsz.supabase.co/rest/v1/tokunoshima_rsvp`  
**Reply:** "記録しました"

---

### 4. Create Workflow: reminders

**Node 1: Cron**
- Expression: `* * * * *` (every minute)

**Node 2: Query Events (HTTP)**
- Method: GET
- URL: `https://nrbserphtykbhwdowfsz.supabase.co/rest/v1/tokunoshima_events?select=*,tokunoshima_rsvp!inner(user_id)&tokunoshima_rsvp.status=eq.going`

**Node 3: Filter Timing (Code)**
```javascript
const items = $input.all();
const now = new Date();
const messages = [];

for (const item of items) {
  const startAt = new Date(item.json.start_at);
  const diffMin = (startAt - now) / (1000 * 60);
  
  let interval = null;
  if (diffMin >= 1440 - 1 && diffMin <= 1440 + 1) interval = '24時間';
  else if (diffMin >= 60 - 1 && diffMin <= 60 + 1) interval = '1時間';
  else if (diffMin >= 10 - 1 && diffMin <= 10 + 1) interval = '10分';
  
  if (interval) {
    messages.push({
      userId: item.json.tokunoshima_rsvp.user_id,
      title: item.json.title,
      zoomUrl: item.json.zoom_url,
      interval
    });
  }
}

return messages;
```

**Node 4: Send DM (HTTP)**
- Method: POST
- URL: `https://api.line.me/v2/bot/message/push`
- Headers: (same as above)
- Body:
```json
{
  "to": "={{ $json.userId }}",
  "messages": [{
    "type": "text",
    "text": "={{ $json.title }}が{{ $json.interval }}で開始です。\n{{ $json.zoomUrl }}"
  }]
}
```

---

### 5. Create Workflow: cards

**Similar to rsvp**, but:
- Webhook path: `kyoen-cards`
- Query: `SELECT * FROM line_cards ORDER BY updated_at DESC LIMIT 10`
- Reply: Simple text list

---

## Verification

After all 4 workflows are active:

1. Test event detection: Post a message in LINE group
2. Test RSVP: Click button
3. Wait for reminder: Check at T-10m
4. Test cards: Send `カード` command

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Manual setup. Fully detailed. Ready to deploy."*


