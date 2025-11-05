# LINE /ping Debug

**Date:** 2025-11-02  
**Status:** ✅ Workflow updated

---

## Update Applied

**Changes:**
- Added "If /ping?" IF node ✅
- Added "Reply Pong" node ✅
- Routing: Extract Data → IF → (true: Pong, false: Event flow)

**Flow:**
```
LINE Webhook
  ↓
Extract Data (outputs message)
  ↓
If /ping? ($json.message === '/ping')
  ├─ true → Reply Pong
  └─ false → Upsert Event → Reply Flex
```

---

## Test

**Expected:** `/ping` → `pong` response

**Status:** Ready for testing

---

**Generated:** 2025-11-02 / Cursor (☿)


