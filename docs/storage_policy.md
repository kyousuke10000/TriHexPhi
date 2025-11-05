# TriHex Storage Policy

**Version:** 1.0.0  
**Date:** 2025-11-01  
**SPoT:** /docs/storage_policy.md

---

## 原則

### Unidirectional Sync: Git → Supabase Only

**Source of Truth:** Git repository (`/50_CHL/system/`)  
**Search Cache:** Supabase (ephemeral, disposable)

---

## Sync Direction

```
Git Repository (SPoT)
    ↓
  [One-way sync]
    ↓
Supabase (Search Cache)
```

**Reverse sync (Supabase → Git) is PROHIBITED.**

---

## Supabase Role

1. **Search & Query Cache:** Fast retrieval for AI/Clipper
2. **Temporary Store:** Ephemeral data, disposable on rebuild
3. **NOT a Backup:** Never trust as persistent storage
4. **NOT authoritative:** Always validate against Git SPoT

---

## Rebuild Procedure

If Supabase data is lost or corrupted:

```bash
# Rebuild from Git SPoT
# 1. Clear Supabase tables
# 2. Re-sync from Git HEAD
# 3. Re-index embeddings
# 4. Verify consistency
```

**No manual intervention required.**  
Supabase can be dropped and recreated without data loss.

---

## Sync Frequency

- **Initial Sync:** On first deployment
- **Continuous Sync:** Git commit hooks → Supabase
- **Full Rebuild:** Weekly (or on demand)

---

## Data Mapping

| Git Layer | Supabase Table | Purpose |
|-----------|----------------|---------|
| system/ | canonical_docs | Main documents |
| HarmonyCouncil/ | rounds | Council logs |
| ObsidianSync/ | ephemeral | Temporary notes |
| Archive/ | archive_* | Historical records |

---

## Safety Controls

- **TTL:** 3 syncs or 24h (whichever first)
- **KILL:** 2-signature protocol
- **Rollback:** Always available to previous Git state
- **Snapshot:** SNAPSHOT@ALLOW-1 before major syncs

---

## Compliance

- **SPoT:** `/50_CHL/system/` remains authoritative
- **Audit:** All changes traceable via Git history
- **Proof:** manifest.json + reproduce.sh for validation
- **Covenant:** Harmonia Operating Covenant v1.1 applies

---

**Reference:**  
- Constitution.md  
- Harmonia_Operating_Covenant_v1.1.md  
- INDEX.md

---

*Generated: 2025-11-01 / Cursor (☿)*




