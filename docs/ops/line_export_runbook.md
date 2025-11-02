# LINE Export Runbook

**Purpose:** Export 5 years of LINE group chat to Supabase  
**Target:** ツクツク徳之島チーム  
**Schedule:** 23:00 JST daily (or manual)

---

## Quick Start

### Manual Run (Now)

```bash
node scripts/chat_export/main_run.mjs
```

### Automated (23:00 JST)

```bash
# Add to crontab
0 23 * * * cd /path/to/TriHex && node scripts/chat_export/main_run.mjs >> logs/line_export.log 2>&1
```

---

## Pipeline

1. **AppleScript** → Scroll to top → Copy to chat_raw.txt
2. **Parser** → Parse to chat.json
3. **Import** → Upsert to Supabase line_messages
4. **Report** → Generate proof

---

## Validation

- ✅ chat.json: ≥50k lines or oldest ≤2019
- ✅ Supabase: All imported
- ✅ Report: Generated in Proofs

---

## Recovery

**If interrupted:**
- metadata.json tracks progress
- Re-run from beginning (upsert handles duplicates)

**If too slow:**
- Try iPhone backup method (fallback)
- Or limit to last 2 years

---

**Generated:** 2025-11-02 / Cursor (☿)

