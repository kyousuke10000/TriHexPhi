# KYOEN LINE Zero Friction Ops

**Target:** ツクツク徳之島チーム  
**Purpose:** Event detection → RSVP → Auto reminders → Card shelf  
**Future-only:** No history export

---

## Architecture

```
LINE Group Message
  ↓ Webhook
event-detect (n8n)
  ↓ Extract: date/time/title/ZoomURL
tokunoshima_events
  ↓ Flex Message
[参加][検討][聞かせ][カレンダー]
  ↓ Postback
tokunoshima_rsvp
  ↓ Cron (minutely)
reminders
  ↓ T-24h/-1h/-10m
Individual DM (going only)
```

---

## Workflows

### 1. event-detect

**Trigger:** LINE Webhook `/kyoen/line/in`  
**Extraction:**
- Date: `YYYY-MM-DD` or `MM/DD` format
- Time: `HH:MM` or `HH:MM-HH:MM`
- Title: First line or `[タイトル]`
- Zoom: URL containing `zoom.us` and `?pwd=`

**Actions:**
- Upsert: same title + date → update
- Generate: Flex card
- Post: to LINE group

**Flex Card Structure:**
```
[Bubble]
  [Header]
    - Title
    - Date/Time
    - Zoom URL (if available)
  [Footer]
    - [参加する] (going:{event_id})
    - [検討中] (maybe:{event_id})
    - [聞かせて] (mute:{event_id})
    - [カレンダー] (ics_url if available)
```

---

### 2. rsvp

**Trigger:** LINE Postback `{status}:{event_id}`  
**Statuses:** `going` / `maybe` / `mute`  
**Actions:**
- Upsert: `tokunoshima_rsvp` (event_id + user_id → status)
- Reply: "記録しました"

---

### 3. reminders

**Trigger:** Cron `* * * * *` (every minute)  
**Query:**
```sql
SELECT e.*, array_agg(r.user_id) as going_users
FROM tokunoshima_events e
LEFT JOIN tokunoshima_rsvp r ON e.id = r.event_id AND r.status = 'going'
WHERE e.start_at BETWEEN NOW() + INTERVAL '10 minutes' AND NOW() + INTERVAL '11 minutes'
   OR e.start_at BETWEEN NOW() + INTERVAL '1 hour' AND NOW() + INTERVAL '1 hour 1 minute'
   OR e.start_at BETWEEN NOW() + INTERVAL '24 hours' AND NOW() + INTERVAL '24 hours 1 minute'
GROUP BY e.id
HAVING COUNT(r.user_id) > 0;
```

**Actions:**
- For each user: Send DM with [参加] button
- DM: "あと {interval} で開始: {title}" + zoom_url
- Times: T-24h, T-1h, T-10m

---

### 4. cards

**Trigger:** LINE Command `カード`  
**Query:**
```sql
SELECT * FROM line_cards
ORDER BY updated_at DESC
LIMIT 10;
```

**Display:** Flex carousel

---

## Tables

**tokunoshima_events:**
- id UUID
- title TEXT
- start_at TIMESTAMPTZ
- zoom_url TEXT
- ics_url TEXT
- created_by TEXT
- meta JSONB
- created_at TIMESTAMPTZ

**tokunoshima_rsvp:**
- event_id UUID
- user_id TEXT
- status TEXT (going/maybe/mute)
- ts TIMESTAMPTZ

**line_cards:**
- key TEXT (primary)
- title TEXT
- url TEXT
- meta JSONB
- updated_at TIMESTAMPTZ

---

## Storage

**Bucket:** `events-ics` (Supabase Storage)  
**Public:** false  
**Signed URLs:** Yes  
**Usage:** ICS file uploads

---

## Secrets

**n8n Credentials:**
- `LINE_CHANNEL_TOKEN`
- `LINE_CHANNEL_SECRET`
- `LINE_USER_ID`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

**Location:** `.secrets/line.env`

---

## Deployment

**Manual Steps:**

1. **Supabase:**
   - Verify tables exist
   - Create `events-ics` bucket
   - Set public=false

2. **n8n:**
   - Import/create 4 workflows
   - Set credentials
   - Activate webhooks

3. **LINE:**
   - Enable webhook
   - Join group
   - Allow group chats

4. **Verification:**
   - Test event detection
   - Test RSVP
   - Wait for reminder check

---

## Acceptance Criteria

✅ Zoom: One-tap join from Flex (full URL)  
✅ RSVP: Upsert recorded  
✅ DM: T-10m to going only  
✅ ICS: Valid signed URL  
✅ Commands: `カード` lists latest

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Future-focused. Zero friction."*
