# Database Manual Application Guide

**Date:** 2025-11-02  
**Status:** Manual SQL application required

---

## ⚠️ Issue

Supabase REST API doesn't have `exec_sql` function.  
Need manual application via Dashboard or psql.

---

## 📋 Manual Steps

### Option 1: Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/nrbserphtykbhwdowfsz
2. SQL Editor → New Query
3. Paste each SQL file and run:

**File 1:** `scripts/sql/0001_trihex_base.sql`  
**File 2:** `scripts/sql/0002_tsukutsuku_line_messages.sql`  
**File 3:** `scripts/sql/0003_points_history.sql`

---

### Option 2: psql Command

```bash
# Install psql first
brew install postgresql@16

# Run SQL
psql "$DATABASE_URL" < scripts/sql/0001_trihex_base.sql
psql "$DATABASE_URL" < scripts/sql/0002_tsukutsuku_line_messages.sql
psql "$DATABASE_URL" < scripts/sql/0003_points_history.sql
```

---

## ✅ Verification

After applying, verify tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN ('line_messages', 'members', 'events', 'rsvp', 'line_cards', 'points_history');
```

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Manual SQL application needed. See above steps."*


