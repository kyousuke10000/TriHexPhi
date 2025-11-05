# KYOEN Rollout Checklist

**Target:** ツクツク徳之島チーム  
**Purpose:** Event detection → RSVP → Auto reminders → Card shelf  
**Date:** 2025-11-03

---

## Non-Operational Notice

**本稿は運用チェックリストです。**  
参加は常に任意（Opt-in）で、境界は膜として尊重されます。Harmoniaは"場"のメタファであり、権威ではありません。

---

## Pre-Deployment

- [ ] **LINE Developers:** Webhook URL(Production)設定 & 検証OK
  - [ ] `https://{n8n-domain}/webhook/kyoen/line/in` returns 200
  - [ ] LINE Developers Console: Verify webhook active
  - [ ] Test webhook: `curl -X POST ...`

- [ ] **n8n Environment Variables:**
  - [ ] `N8N_LINE_TOKEN` set
  - [ ] `N8N_LINE_SECRET` set
  - [ ] `N8N_SB_URL` set
  - [ ] `N8N_SB_KEY` set

- [ ] **Supabase Tables:**
  - [ ] `tokunoshima_events` created
  - [ ] `tokunoshima_rsvp` created
  - [ ] `line_cards` created
  - [ ] Indexes created
  - [ ] RLS policies enabled

- [ ] **Supabase Storage:**
  - [ ] Bucket `events-ics` created
  - [ ] Public: false
  - [ ] Signed URLs: enabled

---

## Workflow Verification

- [ ] **WF-1: event-detect**
  - [ ] Message sent to LINE group
  - [ ] Flex card appeared
  - [ ] DB entry created: `SELECT * FROM tokunoshima_events ORDER BY created_at DESC LIMIT 1;`

- [ ] **WF-2: rsvp**
  - [ ] [参加する] button clicked
  - [ ] Snack message "記録しました" received
  - [ ] DB entry created: `SELECT * FROM tokunoshima_rsvp WHERE status = 'going';`

- [ ] **WF-3: reminders**
  - [ ] T-24h DM sent
  - [ ] T-1h DM sent
  - [ ] T-10m DM sent
  - [ ] Only to `going` users

- [ ] **WF-4: cards**
  - [ ] Command "カード" sent
  - [ ] Carousel appeared
  - [ ] Latest cards displayed

---

## Daily Operations

- [ ] **09:00 Daily Digest** received
  - [ ] Check timezone: Asia/Tokyo
  - [ ] Verify content delivered

- [ ] **Error Monitoring:**
  - [ ] Slack or LINE notification flow active
  - [ ] Error log aggregation working
  - [ ] Alert threshold: 5 failures/hour

---

## Failure Scenarios

### Reply Token Expiry

- [ ] **Test:**
  1. Send event message
  2. Wait 31+ seconds
  3. Click RSVP button

- [ ] **Expected:** Silent failure (no-op)
- [ ] **Actual:** [Result logged]

### JSON Format Errors

- [ ] **Test:**
  1. Send malformed message (emojis, special chars)
  2. Trigger event-detect

- [ ] **Expected:** Graceful fallback
- [ ] **Actual:** [Result logged]

### Database Connection

- [ ] **Test:**
  1. Temporarily block DB access
  2. Trigger workflow

- [ ] **Expected:** Retry x3, exponential backoff
- [ ] **Actual:** [Result logged]

---

## Edge Cases

### Duplicate Events

- [ ] **Test:**
  1. Send same event twice
  2. Verify upsert (not duplicate)

- [ ] **Expected:** Update existing, not create new
- [ ] **Actual:** [Result logged]

### Zoom URL Format

- [ ] **Test:**
  1. Send Zoom URL with `?pwd=`
  2. Verify one-tap join works

- [ ] **Expected:** URL clickable, opens Zoom
- [ ] **Actual:** [Result logged]

### ICS Generation

- [ ] **Test:**
  1. Generate ICS file
  2. Upload to storage
  3. Test signed URL

- [ ] **Expected:** Valid .ics file, 7-day expiry
- [ ] **Actual:** [Result logged]

---

## Acceptance Criteria

### Must Have

- [x] Zoom: One-tap join from Flex card
- [x] RSVP: Button press → DB upsert
- [x] DM: T-10m to going users only
- [x] ICS: Valid signed URL
- [x] Commands: `カード` lists latest

### Nice to Have

- [ ] Analytics dashboard
- [ ] Webhook retry logic
- [ ] Multi-language support

---

## Sign-Off

**Deployed by:** [Name]  
**Date:** [YYYY-MM-DD]  
**Status:** [Pending / In Progress / Complete]

**Notes:**
```
[Any observations or issues]
```

---

**Generated:** 2025-11-03 / Cursor (☿)  
**Status:** Checklist  
**Version:** 1.0

*"Future-focused. Zero friction."*

