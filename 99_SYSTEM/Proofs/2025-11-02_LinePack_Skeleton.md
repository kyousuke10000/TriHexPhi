# LINE Pack Skeleton

**Date:** 2025-11-02  
**Phase:** VI Consolidation  
**Type:** Architecture  
**Observer:** Cursor (☿)

---

## :::decision

**Discord Skipped**  
Tsukutsuku project uses LINE only. Discord workflows deferred to future phases.

**Focus:** LINE-based lead generation + KYOEN AI integration

---

## :::brief

**Pack Structure:**
- 3 n8n workflows (line-listener, lead-intake, daily-status)
- 4 Supabase tables (isolation from core)
- RLS: Pack writes, core reads
- Credentials: LINE token only

---

## :::fact

**Created:**
- `docs/packs/tsukutsuku/README.md` - Pack documentation
- `scripts/sql/0002_tsukutsuku_line_messages.sql` - LINE table
- Database schema ready

**Pending:**
- n8n workflow definitions
- LINE credentials
- SQL application

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Discord deferred. LINE focused. Pack isolated."*


