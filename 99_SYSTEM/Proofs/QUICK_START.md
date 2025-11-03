# QUICK START (Reactivation → Sync)

**Purpose:** Operations quick reference  
**For:** TriHex maintainers

---

## 🧭 Navigation Map

### 1. Lost Context?

**→ Read:** `TriHex_Master_Reactivation.md`

**What you get:**
- Vault Architecture (8 layers)
- Core Documents (Memory Anchors)
- Quick Start Commands
- Reference Links

---

### 2. Check Structure

**→ Check:** `index.md` / `specs/architecture.yml`

**What you get:**
- Breathing Layers definition
- 6AI Collaboration Model
- Breath Integration specs
- Guardrails

---

### 3. Nightly Maintenance

**→ Automated:** `.github/workflows/night_safe_auto.yml`

**What it does:**
- Vault scan (read-only)
- Context snapshot
- Unresolved links detection
- Duplicate slugs check

**Output:** `99_SYSTEM/Proofs/NIGHTLY_YYYY-MM-DD_HH-MM.md`

---

### 4. Check Proofs

**→ Browse:** `99_SYSTEM/Proofs/`

**What you find:**
- Latest execution reports
- Historical snapshots
- Deployment status
- Incident logs

---

## 🔄 Automated Operations

**All handled by CI workflows:**

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `proofs_sync.yml` | Push | Proofs/Docs sync |
| `trihex_sync.yml` | Schedule | Vault structure sync |
| `night_safe_auto.yml` | Nightly | Safety scan + snapshot |
| `harmonia-ci.yml` | Push | Validation gate |

---

## 🎯 Common Tasks

### New Session?

Read: `TriHex_Master_Reactivation.md`

### Architecture Questions?

Check: `specs/architecture.yml`

### Recent Changes?

Browse: `99_SYSTEM/Proofs/` (latest first)

### Manual Verification?

```bash
node scripts/nightly-safe-scan.mjs  # Scan
node scripts/emit-context-snapshot.mjs  # Snapshot
```

---

## 📚 References

**Roles:**
- `docs/ops/reactivation_vs_sync.md` - Map vs Road

**Structure:**
- `specs/architecture.yml` - YAML definition
- `index.md` - Vault overview

**Operations:**
- `docs/index.md` - Documentation hub
- `docs/dashboards/overview.md` - System status

---

**Generated:** 2025-11-03 / Cursor (☿)  
**Status:** Quick Reference

*"Map explains. Road connects."*


