# KYOEN AI LINE Setup - Zero Friction Ops

**Date:** 2025-11-02  
**Status:** ✅ Base Ready  
**Target:** ツクツク 徳之島チーム

---

## ✅ Completed

### SQL Schema

**Tables:** ✅ Applied via Supabase CLI
- `tokunoshima_events` (id, title, start_at, zoom_url, ics_url, created_by, meta, created_at)
- `tokunoshima_rsvp` (event_id, user_id, status, ts)
- `line_cards` (key, title, url, meta, updated_at)

**Indexes:** ✅ Created
- events(start_at)
- rsvp(event_id)
- line_cards(updated_at)

**RLS Policies:** ✅ Enabled
- Authenticated users: read/write
- Service role: full access

---

### Documentation

**Runbook:** ✅ `docs/ops/kyoen_line_zero_friction.md`
- Architecture diagram
- Workflow specifications
- Flex card templates
- DM message formats

**Pack Docs:** ✅ `docs/packs/tsukutsuku/README.md`
- Purpose & scope
- Dependencies
- Operational notes

**Deployment Guide:** ✅ `docs/packs/tsukutsuku/n8n_deployment.md`
- Quick setup steps
- Secret configuration
- Storage setup

---

### Cleanup

**Archived:** ✅ History export code
- Moved to `archived/line_export/`
- Focus: Future-only operations

---

## ⏳ Pending Manual Setup

### n8n Workflows

**Required:** 4 workflows
1. event-detect (Webhook → extract → upsert → reply)
2. rsvp (Postback → save → reply)
3. reminders (Cron → query → DM)
4. cards (Command → list)

**Setup:** Manual in n8n UI (recommended for flexibility)

**Reference:** `docs/packs/tsukutsuku/n8n_deployment.md`

---

### Supabase Storage

**Bucket:** `events-ics`  
**Status:** ⏳ Manual creation needed  
**Public:** false  
**Signed URLs:** Yes

---

### LINE Bot

**Permissions:** ⏳ Manual verification needed
- Webhook active: Check 200 response
- Group invite: Bot joined
- Allow group chats: Enabled

---

## 🎯 Acceptance Criteria

**Auto-checks (after deployment):**

✅ Zoom: Full URL with `?pwd=` → One-tap join from Flex  
✅ RSVP: Button press → `tokunoshima_rsvp` upsert  
✅ DM: T-10m sent only to `going` users  
✅ ICS: Valid signed URL → Calendar registration works  
✅ Commands: `カード` → Latest announcements list

---

## 📋 Decisions Confirmed

1. ✅ RSVP reminders: 24h / 1h / 10m
2. ✅ ICS storage: Supabase Storage (not LFS)
3. ✅ Card overwrite: Yes (same title+date or URL)
4. ✅ DM frequency: 3x per event (going only)

---

## 🔗 Next Actions

**shiryu:**
1. Create n8n workflows (manual or import JSON)
2. Create Supabase `events-ics` bucket
3. Verify LINE webhook
4. Test event detection
5. Run acceptance checks

---

## 📝 Secrets Required

**Location:** `.secrets/line.env`

**Required:**
- `LINE_CHANNEL_TOKEN`
- `LINE_CHANNEL_SECRET`
- `LINE_USER_ID`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

**Status:** ⏳ Setup in n8n credentials

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Base ready. Manual n8n setup needed. Zero friction ahead."*


