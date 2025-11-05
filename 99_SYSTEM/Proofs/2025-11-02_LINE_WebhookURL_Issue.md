# LINE Webhook URL Issue

**Date:** 2025-11-02  
**Issue:** Bot using test URL instead of production

---

## Diagnosis

**User Observation:**
"全部さテストURLになっちゃってない？ Webhook"

**Issue:** Webhook nodes configured with test URLs

**Expected:** Production webhook paths  
**Actual:** Test URLs

---

## Fix Required

Update all webhook nodes to use:
- Production mode
- Correct webhook paths

---

**Generated:** 2025-11-02 / Cursor (☿)


