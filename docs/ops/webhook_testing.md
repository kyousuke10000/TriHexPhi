# Webhook Testing Guide

**Date:** 2025-11-02  
**Status:** ✅ Working

---

## Webhook URL

**Production:**  
`https://primary-production-14b0.up.railway.app/webhook/kyoen-line-in`

**Method:** POST (for LINE webhooks)

---

## Test

```bash
curl -X POST "https://primary-production-14b0.up.railway.app/webhook/kyoen-line-in" \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"Test"}}]}'
```

---

**Generated:** 2025-11-02 / Cursor (☿)


