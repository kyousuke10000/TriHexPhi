# Supabase Health Report

**Date:** 2025-11-01  
**Phase:** Phase IV Rubedo  
**Observer:** Cursor (☿)

---

## Schema Overview

### Tables

| Table | Purpose | RLS | Extensions |
|-------|---------|-----|------------|
| `events` | Audit log | ✅ Enabled | - |
| `content` | Knowledge base | ✅ Enabled | - |
| `publish_queue` | Over Drive queue | ✅ Enabled | - |

### Extensions

| Extension | Status | Usage |
|-----------|--------|-------|
| uuid-ossp | ✅ Enabled | Primary keys |
| pgvector | ✅ Enabled | **Not used** |

---

## Findings

### ✅ Strengths

- RLS enabled on all tables
- Proper indexing (timestamp, kind, actor, slug, tags)
- Auto-update triggers for timestamps
- Service role isolation

### ⚠️ Gaps

1. **pgvector Not Used**
   - Extension enabled but no embeddings table
   - No vector search implementation

2. **Missing Mirror/Sync Tables**
   - No Obsidian sync tracking
   - No file path mirroring

3. **RLS Policy Issue**
   - `content_write_editor` references undefined `payload` column
   - Should reference `auth.users` or custom claims

4. **No Knowledge Table**
   - `content` table exists but no linkage to Obsidian files
   - No mirror fields (source_path, mirrored_at, etc.)

---

## Data Integrity Checks

**Status:** Cannot verify (no database connection in read-only observation)

**Required Checks (when access available):**
- Record counts per table
- NULL rates in key fields
- Path resolution success rate
- Index effectiveness

---

## ETL/Sync Architecture

### Observed Sources

1. **GitHub Actions**
   - `trihex-knowledge-sync.yml` - Daily context-bootstrap generation
   - No direct Supabase write observed

2. **Manual/Planned**
   - Philosophia_Prima → Supabase knowledge table (planned)
   - No active sync workflow found

### Gaps

- ❌ No automatic Obsidian → Supabase sync
- ❌ No pgvector embeddings generation
- ❌ No mirror tracking

---

## Recommendations

### Critical

1. Add `knowledge` table with mirror fields
2. Fix RLS policy for `content_write_editor`
3. Implement pgvector embeddings for search

### High Priority

4. Create sync workflow (Obsidian → Supabase)
5. Add mirror tracking fields
6. Implement vector search API

---

*Generated: 2025-11-01 / Cursor (☿)*

