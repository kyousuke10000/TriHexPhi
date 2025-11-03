# Tsukutsuku n8n Workflows

**Status:** Ready to implement  
**Platform:** LINE Bot  
**Target:** Zero Friction Ops

---

## 1. event-detect

**Trigger:** LINE Webhook `/kyoen/line/in`  
**Flow:**

```
LINE message
  ↓
Extract: date/time/title/ZoomURL
  ↓
Upsert: tokunoshima_events
  ↓
Generate: Flex card
  ↓
Reply: to LINE group
```

**Extraction Regex:**
- Date: `\d{4}-\d{2}-\d{2}` or `\d{1,2}/\d{1,2}`
- Time: `\d{1,2}:\d{2}(?:\s*-\s*\d{1,2}:\d{2})?`
- Zoom: `https?://(?:[^\s]+)?zoom\.us/[^\s?]+\?pwd=[^\s]+`

---

## 2. rsvp

**Trigger:** LINE Postback `{status}:{event_id}`  
**Flow:**

```
Postback
  ↓
Parse: status + event_id
  ↓
Upsert: tokunoshima_rsvp
  ↓
Reply: Snack message
```

---

## 3. reminders

**Trigger:** Cron `* * * * *`  
**Flow:**

```
Every minute
  ↓
Query: events in 24h/1h/10m
  ↓
Filter: going RSVPs only
  ↓
For each user:
  Send DM with [参加] button
```

---

## 4. cards

**Trigger:** LINE Command `カード`  
**Flow:**

```
Command received
  ↓
Query: latest 10 cards
  ↓
Generate: Flex carousel
  ↓
Reply: to user
```

---

**Generated:** 2025-11-02 / Cursor (☿)


