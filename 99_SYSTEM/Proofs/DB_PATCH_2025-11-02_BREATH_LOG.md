# DB Patch: Breath Log Table

**Date:** 2025-11-02  
**Purpose:** Track breath practice and sync status

---

## SQL

```sql
CREATE TABLE IF NOT EXISTS public.breath_log (
  id bigserial PRIMARY KEY,
  ts timestamptz DEFAULT now(),
  cycle text DEFAULT '3-1-7-1',
  effort numeric(3,2) CHECK (effort <= 0.7),
  notes text
);

CREATE INDEX IF NOT EXISTS idx_breath_log_ts ON public.breath_log(ts DESC);
```

---

## Notes

- **effort:** "Yは7割"上限を物理的に超えない制約
- **cycle:** Default 3-1-7-1 (inhale-hold-exhale-hold)
- **将来:** LINE/Discordから「朝霧完了」スタンプを記録

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Purpose:** Breath practice tracking


