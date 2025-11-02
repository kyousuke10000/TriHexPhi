# Zero Friction Ops - Ready

**Date:** 2025-11-02  
**Status:** ✅ SQL Applied, Next: n8n Workflows

---

## ✅ Completed

**SQL Tables:**
- ✅ `tokunoshima_events` (event detection)
- ✅ `tokunoshima_rsvp` (responses)
- ✅ `line_cards` (card shelf)

**Base Tables:**
- ✅ `line_messages` (message storage)
- ✅ `members` (user management)
- ✅ `generations` (KYOEN AI)
- ✅ `leads` (lead gen)
- ✅ `points_history` (visualization)
- ✅ `rank_snapshots` (tracking)

---

## ⏳ Next Steps

**n8n Workflows (4):**

1. `event-detect` - Webhook → extract → upsert → Flex
2. `rsvp` - Postback → save → reply
3. `reminders` - Cron → query → DM
4. `cards` - Command → list

---

## 📋 Questions

**Your answers needed:**
1. RSVP reminder times OK? (24h/1h/10m)
2. iCS storage? (LFS vs storage)
3. Card shelf overwrite OK?
4. DM reminder frequency OK?

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Base ready. Awaiting your answers to build workflows."*

