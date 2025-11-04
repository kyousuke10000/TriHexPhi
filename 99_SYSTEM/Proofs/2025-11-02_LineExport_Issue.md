# LINE Export Issue

**Date:** 2025-11-02  
**Status:** Character corruption detected

---

## :::brief

**Problem:** Copied text has mojibake (文字化け)  
**Affected:** ~752 messages partially parsed  
**Root cause:** LINE desktop app copy-paste encoding

---

## :::decision

**Options:**
1. ❌ Continue with corrupted data (not recommended)
2. ✅ iPhone backup extraction
3. ✅ Try different export method
4. ✅ Focus on zero-friction ops without history

**Recommendation:** Skip history export for now. Build zero-friction system.

---

## :::fact

**Current state:**
- Parser: 752 messages detected
- Encoding: Mojibake
- SQL: ✅ All tables applied
- Import: ❌ Blocked by encoding

**Next focus:**
- Event detection (n8n)
- RSVP system
- Reminders
- Card shelf

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Encoding issue. Pivot to zero-friction ops."*


