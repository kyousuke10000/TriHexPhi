# KYOEN Workflows Deployed

**Date:** 2025-11-02  
**Status:** ✅ Deployed

---

## Deployment Summary

**All 4 workflows deployed successfully:**

1. ✅ **event-detect**: `z80YkaQJp2MYnfxS` (Inactive)
2. ✅ **rsvp**: `lwCmzHJNKCxW0FPk` (Inactive)
3. ✅ **reminders**: `2MzPMvOuCiQQSJpW` (Inactive)
4. ✅ **cards**: `Q9nWlfMWee4ldKpd` (Inactive)

---

## Fixes Applied

### 1. Webhook Configuration
- ✅ Added `httpMethod: 'POST'` to all webhook nodes
- ✅ Added `path` parameter for proper routing

### 2. Bearer Token
- ✅ Fixed spacing: `Bearer ${token}` (not `Bearer${token}`)
- ✅ Applied to all LINE HTTP Request nodes

### 3. /ping Handler
- ✅ Added "If /ping?" IF node
- ✅ Added "Reply Pong" node
- ✅ Routing: Extract → IF → (true: pong, false: event)

### 4. Connections
- ✅ Webhook → Extract → IF
- ✅ IF → Reply Pong (true)
- ✅ IF → Parse Event → Upsert → Reply Flex (false)

---

## Next Steps

1. Activate workflows in n8n UI
2. Test `/ping` in LINE
3. Test event detection

---

**Generated:** 2025-11-02 / Cursor (☿)


