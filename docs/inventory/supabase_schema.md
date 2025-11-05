# Supabase Schema Inventory

**Generated:** 2025-11-01  
**Status:** Read from health report

---

## Current Tables

| Table | Purpose | RLS | Extensions |
|-------|---------|-----|------------|
| `events` | Audit log | ✅ Enabled | - |
| `content` | Knowledge base | ✅ Enabled | - |
| `publish_queue` | Over Drive queue | ✅ Enabled | - |

---

## Extensions

| Extension | Status | Usage |
|-----------|--------|-------|
| uuid-ossp | ✅ Enabled | Primary keys |
| pgvector | ✅ Enabled | **Not used** |

---

## Gaps

### ❌ Missing for TriHex Core

1. **No Discord tables**
   - `discord_messages`
   - `discord_reactions`
   - `members`

2. **No generation tracking**
   - `generations`

3. **No lead management**
   - `leads`

4. **No rank tracking** (Tsukutsuku)
   - `rank_snapshots`

---

## Recommendations

**Immediate:**
1. Create Discord listener tables
2. Add generation tracking
3. Add lead management

**High Priority:**
4. Fix RLS policy bugs
5. Implement pgvector embeddings
6. Add mirror tracking fields

---

**Generated:** 2025-11-01 / Cursor (☿)


