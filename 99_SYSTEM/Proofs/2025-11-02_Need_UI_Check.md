# Need n8n UI Check

**Date:** 2025-11-02  
**Status:** Can't debug via API, need UI

---

## Problem

- Workflow receives webhook ✅
- Immediately errors out ❌
- No detailed error in API response

---

## What We Need to See

**In n8n UI:**
1. Open workflow: KYOEN Event Detect
2. Go to Executions tab
3. Open execution ID: 399 (or latest)
4. Check **which node failed**
5. Check **error message**

---

## Likely Issues

### 1. Data Structure Mismatch
**Extract Data node expects:**
```javascript
const events = $input.item.json.events;
const event = events[0];
const message = event.message.text;
```

**But webhook might send:**
- Different structure
- Missing `events` array
- Different nesting

### 2. Code Node Syntax
- Template string escaping issues
- Missing variables
- Runtime errors

### 3. Node Reference
**Parse Event node uses:**
```javascript
const message = $('Extract Data').item.json.message;
```

**Issue:** Reference might fail if Extract Data errors

---

## Quick Fix Test

**Option:** Simplest test first
1. Add a "Respond to Webhook" node after webhook
2. Always return 200 OK
3. Test if webhook reaches n8n
4. Then add logic gradually

---

**Next:** Check n8n UI for detailed error message

---

**Generated:** 2025-11-02 / Cursor (☿)


