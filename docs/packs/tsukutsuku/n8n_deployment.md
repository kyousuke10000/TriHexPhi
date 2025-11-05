# KYOEN n8n Deployment Guide

**Date:** 2025-11-02  
**Status:** Ready for manual setup

---

## 📋 Quick Setup

**n8n:** Import these 4 workflows (create manually or use JSON)

### 1. event-detect

**Trigger:** LINE Webhook  
**URL:** `/kyoen/line/in`  
**Flow:** message → extract → upsert → reply Flex

**Extract Logic:**
- Date: `\d{4}-\d{2}-\d{2}` or `\d{1,2}/\d{1,2}`
- Time: `\d{1,2}:\d{2}`
- Zoom: `zoom\.us.*\?pwd=`

**Upsert:** `POST {{SUPABASE_URL}}/rest/v1/tokunoshima_events`

**Reply:** Flex card with [参加][検討][聞かせ][カレンダー]

---

### 2. rsvp

**Trigger:** LINE Postback  
**Data:** `{status}:{event_id}`  
**Flow:** parse → upsert → reply snack

**Upsert:** `POST {{SUPABASE_URL}}/rest/v1/tokunoshima_rsvp`

**Reply:** "記録しました"

---

### 3. reminders

**Trigger:** Cron `* * * * *`  
**Query:** events in 24h/1h/10m + going RSVPs  
**Flow:** query → filter → DM each user

**DM:** "あと {interval} で開始: {title}" + [参加]

---

### 4. cards

**Trigger:** LINE Command `カード`  
**Flow:** query → carousel → reply

**Query:** `SELECT * FROM line_cards ORDER BY updated_at DESC LIMIT 10`

---

## 🔐 Secrets (n8n Credentials)

**LINE:**
- `LINE_CHANNEL_TOKEN`
- `LINE_CHANNEL_SECRET`
- `LINE_USER_ID`

**Supabase:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

---

## 📦 Storage

**Supabase:** Create bucket `events-ics`  
**Public:** false  
**Usage:** Signed URLs

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Ready for manual n8n setup. JSON files in repo."*


