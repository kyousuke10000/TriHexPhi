# KYOEN Workflows v1 - Operational Manual

**Target:** ツクツク徳之島チーム  
**Purpose:** Event detection → RSVP → Auto reminders → Card shelf  
**Status:** Operational Ready  
**Future-only:** No history export

---

## Non-Operational Notice

**本稿は運用規定です。**  
参加は常に任意（Opt-in）で、境界は膜として尊重されます。Harmoniaは"場"のメタファであり、権威ではありません。

---

## Architecture Overview

```
LINE Group Message
  ↓ Webhook → n8n
event-detect (extract & upsert)
  ↓ Flex Message → Group
[参加][検討][聞かせ][カレンダー]
  ↓ Postback → n8n
rsvp (save status)
  ↓ Cron (minutely) → n8n
reminders (query going users)
  ↓ Individual DM → Users
"あと 10分で開始: {title}"
```

---

## Workflows

### WF-1: event-detect

**Trigger:** LINE Webhook `/kyoen/line/in`  
**Type:** HTTP POST from LINE

**Extraction:**
- Date: `YYYY-MM-DD` or `MM/DD`
- Time: `HH:MM` or `HH:MM-HH:MM`
- Title: First line or `[タイトル]`
- Zoom: URL containing `zoom.us` and `?pwd=`

**Actions:**
1. Parse message text
2. Upsert: same title + date → update existing
3. Generate: Flex card with RSVP buttons
4. Post: back to LINE group

**Flex Card:**
```json
{
  "type": "flex",
  "altText": "{title} - {date} {time}",
  "contents": {
    "type": "bubble",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        { "type": "text", "text": "{title}" },
        { "type": "text", "text": "{date} {time}" }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        { "type": "button", "action": { "type": "postback", "label": "参加する", "data": "going:{event_id}" }},
        { "type": "button", "action": { "type": "postback", "label": "検討中", "data": "maybe:{event_id}" }},
        { "type": "button", "action": { "type": "postback", "label": "聞かせて", "data": "mute:{event_id}" }},
        { "type": "button", "action": { "type": "uri", "label": "カレンダー", "uri": "{ics_url}" }}
      ]
    }
  }
}
```

---

### WF-2: rsvp

**Trigger:** LINE Postback `{status}:{event_id}`  
**Type:** POST from LINE

**Statuses:** `going` / `maybe` / `mute`

**Actions:**
1. Parse postback data
2. Upsert: `tokunoshima_rsvp` (event_id + user_id → status)
3. Reply: "記録しました"

**SQL:**
```sql
INSERT INTO tokunoshima_rsvp (event_id, user_id, status, ts)
VALUES ('{event_id}', '{user_id}', '{status}', NOW())
ON CONFLICT (event_id, user_id) DO UPDATE
SET status = EXCLUDED.status, ts = NOW();
```

---

### WF-3: reminders

**Trigger:** Cron `* * * * *` (every minute)  
**Type:** Scheduled

**Query:**
```sql
SELECT 
  e.id, 
  e.title, 
  e.start_at, 
  e.zoom_url,
  array_agg(DISTINCT r.user_id) as going_users
FROM tokunoshima_events e
LEFT JOIN tokunoshima_rsvp r 
  ON e.id = r.event_id AND r.status = 'going'
WHERE (
  (e.start_at BETWEEN NOW() + INTERVAL '10 minutes' AND NOW() + INTERVAL '11 minutes')
  OR (e.start_at BETWEEN NOW() + INTERVAL '1 hour' AND NOW() + INTERVAL '1 hour 1 minute')
  OR (e.start_at BETWEEN NOW() + INTERVAL '24 hours' AND NOW() + INTERVAL '24 hours 1 minute')
)
GROUP BY e.id, e.title, e.start_at, e.zoom_url
HAVING COUNT(r.user_id) > 0;
```

**Actions:**
- For each event: Send DM to each going user
- DM: "あと {interval} で開始: {title}" + zoom_url
- Times: T-24h, T-1h, T-10m

---

### WF-4: cards

**Trigger:** LINE Command `カード`  
**Type:** POST from LINE (text match)

**Query:**
```sql
SELECT * FROM line_cards
ORDER BY updated_at DESC
LIMIT 10;
```

**Actions:**
1. Query latest cards
2. Generate: Flex carousel
3. Display: List of announcements

---

## Environment Variables

**Required in n8n:**

```env
N8N_LINE_TOKEN=<LINE_CHANNEL_ACCESS_TOKEN>
N8N_LINE_SECRET=<LINE_CHANNEL_SECRET>
N8N_SB_URL=<SUPABASE_URL>
N8N_SB_KEY=<SUPABASE_SERVICE_KEY>
```

**Location:** n8n Settings → Environment Variables

---

## Database Tables

### tokunoshima_events

```sql
CREATE TABLE IF NOT EXISTS tokunoshima_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  zoom_url TEXT,
  ics_url TEXT,
  created_by TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_start_at ON tokunoshima_events(start_at);
```

### tokunoshima_rsvp

```sql
CREATE TABLE IF NOT EXISTS tokunoshima_rsvp (
  event_id UUID REFERENCES tokunoshima_events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'mute')),
  ts TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

CREATE INDEX idx_rsvp_event_id ON tokunoshima_rsvp(event_id);
```

### line_cards

```sql
CREATE TABLE IF NOT EXISTS line_cards (
  key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT,
  meta JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cards_updated_at ON line_cards(updated_at DESC);
```

**RLS:** Service role full access, authenticated read-only

---

## Storage

**Bucket:** `events-ics`  
**Public:** false  
**Signed URLs:** Yes (7-day expiry)  
**Usage:** ICS calendar files

---

## Testing

### Smoke Tests

**1. Event Detection:**
- Send test message to LINE group
- Verify Flex card appears
- Check DB: `SELECT * FROM tokunoshima_events ORDER BY created_at DESC LIMIT 1;`

**2. RSVP:**
- Click [参加する] button
- Verify snack message "記録しました"
- Check DB: `SELECT * FROM tokunoshima_rsvp WHERE status = 'going';`

**3. Reminders:**
- Wait for T-10m window
- Verify DM received
- Check zoom_url is valid

**4. Cards:**
- Send "カード" command
- Verify carousel appears

---

## Error Handling

### Known Issues

**1. Reply Token Expiry:**
- Symptom: `replyToken expired` error
- Cause: > 30 seconds delay
- Fix: No-op, record failure in logs

**2. JSON Format Errors:**
- Symptom: `Invalid JSON` error
- Cause: Message parsing failure
- Fix: Graceful fallback, continue

**3. Database Connection:**
- Symptom: Timeout / connection refused
- Fix: Retry x3, exponential backoff
- Fallback: Store in temp queue

---

## Monitoring

**Daily Checks:**
- 09:00 JST: Daily digest sent
- Weekly: Error log review
- Monthly: KPI summary

**Alerts:**
- Failures > 5 per hour → Slack notification
- DB query time > 5s → Alert

---

## Rollout Checklist

See: `99_SYSTEM/Proofs/KYOEN_ROLLOUT_CHECKLIST.md`

---

**Generated:** 2025-11-03 / Cursor (☿)  
**Status:** Operational  
**Version:** 1.0

*"Future-focused. Zero friction."*

