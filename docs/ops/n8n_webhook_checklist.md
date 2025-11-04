# LINE Webhook Setup Checklist

**Date:** 2025-11-02  
**Status:** Debugging

---

## ✅ Verified

- n8n webhook: `kyoen-line-in` ✅
- Reply auth: Bearer token set ✅
- Workflow: Active ✅

---

## ⏳ To Check

**LINE Developers Console:**

1. Channel: KSC Ai強化チーム
2. Messaging API settings
3. Webhook URL field
   - **Should be:** `https://primary-production-14b0.up.railway.app/webhook/kyoen-line-in`
   - **Actual:** Check current value

**If using test URL:**
- Update to production URL above
- Save
- Verify webhook

---

**Generated:** 2025-11-02 / Cursor (☿)


