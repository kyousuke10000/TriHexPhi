# LINE Webhook Debug

**Date:** 2025-11-02  
**Issue:** Bot not responding to LINE messages

---

## Findings

### Current Status
- ✅ Webhook URL: Working (200 OK)
- ✅ Workflows: Active
- ✅ Credentials: Configured
- ❌ Execution history: API not available

### Test Results

**Manual Webhook Test:**
```bash
curl -X POST "https://primary-production-14b0.up.railway.app/webhook/kyoen-line-in" \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"test"}}]}'
```

**Response:** `{"message":"Workflow was started"}` ✅

**But:**
- No execution history in n8n
- API `/executions` endpoint returns 404

---

## Diagnosis

**Hypothesis:** Railway n8n API doesn't expose execution history endpoint.

**Next:** Check n8n UI directly for execution logs.

---

**Generated:** 2025-11-02 / Cursor (☿)


