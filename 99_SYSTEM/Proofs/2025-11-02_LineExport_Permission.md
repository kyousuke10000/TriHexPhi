# LINE Export - Permission Request

**Date:** 2025-11-02  
**Status:** Waiting for permission

---

## :::brief

**Permission needed:** macOS Accessibility for Terminal

**Why:** AppleScript needs to control LINE app

**Action:** You need to toggle ON in System Settings

---

## 📋 Steps (You)

1. System Settings opened (probably in background)
2. Find "Privacy & Security" → "Accessibility"
3. Scroll to find "Terminal" (or iTerm)
4. Toggle it ON
5. Tell me "done"

---

## After Permission

I will automatically run:
```bash
node scripts/chat_export/main_run.mjs
```

This will:
1. Scroll LINE to top
2. Copy all messages
3. Parse to JSON
4. Import to Supabase
5. Generate report

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Permission granted? Let me know!"*


