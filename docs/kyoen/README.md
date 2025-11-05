# KYOEN Workflows - Setup Guide

**Purpose:** LINE-based event management for ツクツク徳之島チーム  
**Target:** 10-minute initial setup

---

## Phase Status

- ✅ **Phase 1:** Event Detect v2 - Complete
- ⏳ **Phase 2:** RSVP Collector, Reminders, Slack Sync - In Progress

**Latest:** `99_SYSTEM/Proofs/KYOEN_EVENT_DETECT_v2_REPORT_2025-11-03.md`

---

## Prerequisites

- n8n instance (self-hosted or cloud)
- Supabase project
- LINE Developer account

---

## Quick Setup (10 minutes)

### 1. Environment Variables

**n8n Settings → Environment Variables:**
```env
N8N_SB_URL=https://xxxxx.supabase.co
N8N_SB_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
N8N_LINE_TOKEN=xxxxx
N8N_LINE_SECRET=xxxxx
N8N_LINE_USER_ID=xxxxx
```

### 2. Supabase Setup

**Run SQL script:**
- Location: `docs/packs/tsukutsuku/kyoen_supabase_schema.sql`
- Execute in Supabase SQL Editor
- Verify tables: `kyoen_messages`, `kyoen_events`, `kyoen_rsvp`, `kyoen_cards`, `kyoen_push_queue`

### 3. Import Workflows

**n8n UI → Import:**
1. `workflows/kyoen/KYOEN_Event_Detect_v2.json`
2. `workflows/kyoen/KYOEN_RSVP.json`
3. `workflows/kyoen/KYOEN_Reminders.json`
4. `workflows/kyoen/KYOEN_Cards.json`
5. `workflows/kyoen/KYOEN_Push_Retry.json`

### 4. Configure Webhooks

**LINE Developers Console:**
- Webhook URL: `https://your-n8n-instance.com/webhook/kyoen-line-in`
- Verify: Test webhook returns 200

---

## Testing (3 workflows)

### Test 1: Event Detection

**Send to LINE group:**
```
11/15 10:00 オンライン勉強会
場所: Zoom
https://zoom.us/j/xxxxx?pwd=xxxxx
```

**Expected:**
- Flex card appears in group
- DB entry in `kyoen_events`
- RSVP buttons work

---

### Test 2: RSVP

**Click [参加する] button:**
- Expected: Confirmation Flex card
- DB entry in `kyoen_rsvp` with status='going'

---

### Test 3: Reminders

**Wait for T-10m window:**
- Expected: DM sent to going users
- Contains event title + zoom URL

---

## Common Issues

### Webhook Signature Invalid

**Symptom:** 403 error  
**Fix:**
- Enable "Raw Request Data" in Webhook node
- Verify `N8N_LINE_SECRET` matches LINE Developers Console

### Database Connection Failed

**Symptom:** 401/404 errors  
**Fix:**
- Check `N8N_SB_URL` and `N8N_SB_KEY`
- Verify RLS policies allow service role

### Reply Token Expired

**Symptom:** Reply fails after 30s  
**Fix:**
- Use Push API instead of Reply API
- Queue message for later delivery

---

## Workflow Architecture

```
Classify → Quick Reply → Save → Route → Push
```

**Common Components:**
- `code_verify_signature.md`: HMAC-SHA256 verification
- `code_classify_intent.md`: Intent classification
- `quick_reply.json`: Quick response templates
- `sb_requests.md`: Supabase HTTP presets

**Flex Templates:**
- `event_notice.flex.json`: Event announcement
- `rsvp_confirm.flex.json`: RSVP confirmation
- `meeting_recap.flex.json`: Meeting summary draft

---

## Monitoring

**Daily Checks:**
- 09:00 JST: Daily digest sent
- Weekly: Error log review
- Monthly: KPI summary

**Alerts:**
- Failures > 5/hour → LINE notification
- DB query time > 5s → Alert

---

## Next Steps

1. Import all workflows
2. Test 3 scenarios above
3. Enable cron triggers
4. Monitor first week

---

**Generated:** 2025-11-03 / Cursor (☿)  
**Version:** 1.0

*"Future-focused. Zero friction."*

