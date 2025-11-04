# Decisions Needed

**Date:** 2025-11-02  
**Phase:** VI Consolidation  
**Purpose:** Quick decisions from shiryu

---

## ⚡ Quick Questions

### Q1: SQL Apply Now?

**Status:** Ready  
**Files:** 
- `scripts/sql/0001_trihex_base.sql` (base tables)
- `scripts/sql/0002_tsukutsuku_line_messages.sql` (LINE)

**Action:**
- [ ] Yes, apply both now
- [ ] No, wait

---

### Q2: Discord Bot?

**Status:** Missing token

**If YES:**
- Provide: Bot token + Guild ID + Channel IDs

**If NO:**
- Skip Discord for now
- Focus on Supabase + KYOEN AI

**Action:**
- [ ] Yes, I have Discord bot
- [ ] No, skip Discord

---

### Q3: LINE Token?

**Status:** Missing token

**If YES:**
- Provide: Channel token + secret

**If NO:**
- Build workflows without credentials
- You can add later

**Action:**
- [ ] Yes, I have LINE token
- [ ] No, build skeleton only

---

## 🎯 Current State

**Ready:**
- ✅ All schemas written
- ✅ All workflows designed
- ✅ All Proofs documented

**Waiting:**
- ⏳ Your decisions (Q1-Q3)
- ⏳ Credentials (if available)

---

## 💡 Recommendation

**My suggestion:**

1. **Q1: Yes** - Apply SQL. We can adjust later.
2. **Q2: Skip** - Build Discord workflows later when ready.
3. **Q3: Skip** - Build LINE skeleton, add credentials later.

**Result:** You get working base immediately. Credentials can be added anytime.

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Just answer 3 questions. Then we proceed."*


