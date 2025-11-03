# Reactivation vs Sync Protocol

**Purpose:** Role separation and convergence  
**Date:** 2025-11-03

---

## Overview

| Axis | Reactivation (Context Portal) | Sync Protocol (CI) |
|------|------------------------------|-------------------|
| **Purpose** | Restore when lost | Keep canonical up-to-date |
| **Input** | Memory Anchors, Snapshot | Git/Obsidian diffs, Seeds |
| **Output** | References, links, activation guides | Sync, validation, proofs |
| **Timing** | Manual / on-demand | Continuous / scheduled |
| **Authority** | Documentation (read-only) | CI/Workflows (executable) |
| **Metaphor** | Map | Road |

---

## Principle

**Reactivation is a map. Sync is the road.**

- Map: Explains structure, but doesn't build roads
- Road: Connects places, but doesn't explain geography

**Convergence Rule:** Reactivation provides entry points. Sync executes operations.

---

## Reactivation (Context Portal)

**Role:** Navigation hub for context restoration

**When to use:**
- New session (lost context)
- Architecture overview needed
- Memory anchors required

**Contents:**
- Vault Architecture (8 layers)
- Core Documents (Memory Anchors)
- Quick Start Commands
- Reference Links

**Files:**
- `TriHex_Master_Reactivation.md` (root portal)
- `99_SYSTEM/MemorySeeds/reactivation_seed.json`
- `scripts/emit-context-snapshot.mjs`

---

## Sync Protocol (CI)

**Role:** Continuous synchronization and validation

**When to run:**
- Push to main
- Scheduled (hourly/nightly)
- Manual trigger

**Contents:**
- Proofs auto-sync
- Structure validation
- Night Safe Auto scan
- Mirror integrity checks

**Files:**
- `.github/workflows/proofs_sync.yml`
- `.github/workflows/trihex_sync.yml`
- `.github/workflows/night_safe_auto.yml`

---

## Integration

### Night Safe Auto + Context Snapshot

```yaml
# .github/workflows/night_safe_auto.yml
- name: Emit context snapshot
  run: node scripts/emit-context-snapshot.mjs
```

**Output:** `99_SYSTEM/Proofs/Context_Snapshot_YYYY-MM-DD.md`

**Purpose:** Nightly context photo for historical reference

---

## Entry Points

### Quick Start (Reactivation → Sync)

1. **Lost?** → Read `TriHex_Master_Reactivation.md`
2. **Structure?** → Check `index.md` / `specs/architecture.yml`
3. **Status?** → Check `99_SYSTEM/Proofs/` for latest
4. **Operations?** → All handled by CI workflows

---

## Migration Guide

### Before (Confused Roles)

- Reactivation defined structures (duplicated with specs)
- Manual sync procedures (error-prone)
- Disconnected documentation

### After (Clear Separation)

- Reactivation: Entry portal only
- Sync: Automated execution
- Unified definition: `specs/architecture.yml` (single source)

---

**Generated:** 2025-11-03 / Cursor (☿)  
**Status:** Canonical

*"Map explains. Road connects."*


