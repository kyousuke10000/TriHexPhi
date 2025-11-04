# Webhook Debug Report

**Date:** 2025-11-02  
**Issue:** 404 on webhook URL  
**Status:** Active but not registered

---

## Facts

- **Workflow ID:** x6DDgPh24FLp33am
- **Status:** Active = true ✅
- **Webhook ID:** `kyoen-line-in` ✅
- **Target URL:** `https://primary-production-14b0.up.railway.app/webhook/kyoen/line/in`
- **Actual:** 404 "not registered"

---

## Error Message

```
{"code":404,"message":"The requested webhook \"POST kyoen/line/in\" is not registered.","hint":"The workflow must be active for a production URL to run successfully..."}
```

---

## Hypothesis

**Webhook path vs webhook ID mismatch:**

Deployed: `webhookId: 'kyoen-line-in'`  
Expected by Railway: `/webhook/kyoen/line/in`

**Possible:** Railway expects path segments but we provided ID with hyphens.

---

## Next Steps

Check:
1. Webhook URL format expected by Railway n8n
2. Whether we need to update webhook ID
3. Or if webhook path should be different

---

**Generated:** 2025-11-02 / Cursor (☿)


