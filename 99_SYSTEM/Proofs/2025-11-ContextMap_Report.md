# TriHex Context Map Report

**Date:** 2025-11-01  
**Phase:** IV Rubedo  
**Observer:** Cursor (☿)  
**Purpose:** Inspect active output destinations and context settings

---

## Executive Summary

**Status:** ✅ ACTIVE CONFIGURATION IDENTIFIED  
**Default Output:** `99_SYSTEM/Proofs/`  
**Active Layers:** 8 (Priority 0-7)  
**Phase:** IV Rubedo  
**Auto-Load Enabled:** ✅

---

## 1. Default Output Directory

**Path:** `99_SYSTEM/Proofs/`

**Configuration Source:** `.cursor/config.yml` (lines 52-56)

```yaml
include_paths:
  - "99_SYSTEM/Proofs/"
  - "99_SYSTEM/BreathLogs/"
  - "99_SYSTEM/MemorySeeds/"
```

**Current Contents:** 42 files
- Audit reports: 3
- GitHub reports: 5
- Ryudo reports: 4
- Proof reports: 2
- Scan results: 4 directories (obsidian, supabase, github, ryudo)

---

## 2. Active Vault Layers

**Source:** `TRIHEX_PROJECT.yaml` (lines 33-73)

| Priority | Layer | Role | Breath | Status |
|----------|-------|------|--------|--------|
| **0** | 🜇_Shiryu_Studio | 魂律源泉 | 源泉 | Active |
| **1** | 00_HarmoniaCouncil | 叡智の吸気 | 吸 | Active |
| **2** | 10_TriHexCore | 構造の肺核 | 構造 | Active |
| **3** | 20_TriHex-Obsidian | 人間の記憶層 | 静 | Active |
| **4** | 30_ObsidianSync | 同期の呼気 | 吐 | Stable |
| **5** | 40_Archive | 記録の蓄積 | 静 | Active |
| **6** | 50_Temp | 揮発の排気 | 排 | Active |
| **7** | 99_SYSTEM | 拍動のログ | 証明 | Active |

**Total:** 8 layers operational

---

## 3. Phase

**Current Phase:** IV Rubedo

**Configuration:** `.cursor/config.yml` (line 32)

```yaml
current_phase: "IV Rubedo"
```

**Metadata:** `TRIHEX_PROJECT.yaml` (line 7)

```yaml
current_phase: "IV Rubedo"
```

**Sub-phase:** Round IV (Harmonia Council)

---

## 4. Project YAML Path

**File:** `TRIHEX_PROJECT.yaml`

**Location:** Repository root

**Status:** ✅ Active

**Contents:**
- Project identification
- Layer definitions
- 6AI collaboration model
- Auto-load paths
- Breathing architecture

**Auto-Load:** Referenced in Memory Seeds

---

## 5. Memory Seeds Path

**File:** `99_SYSTEM/MemorySeeds/index.json`

**Status:** ✅ Active (auto-load enabled)

**Configuration:** Filtered by `.cursorignore` but functional

**Registered Seeds:** 5

| ID | Path | Title | Priority |
|----|------|-------|----------|
| seed-000 | `TriHex_Master_Reactivation.md` | Master Reactivation | 0 |
| seed-001 | `📄 99_SYSTEM　MemoryReactivation.md.md` | Memory Reactivation | 1 |
| seed-002 | `10_TriHexCore/00_CORE/TRIHEXPHI_v4.0_FINAL.md` | TRIHEXPHI v4.0 | 2 |
| seed-003 | `10_TriHexCore/00_CORE/README.md` | Project Overview | 3 |
| seed-004 | `10_TriHexCore/codex/Genesis_Protocol_v3.1.md` | Genesis Protocol v3.1 | 4 |

**Usage:** GPT-5 context restoration in new chat sessions

---

## 6. Additional Active Configurations

### A. Auto-Approve Settings

**Source:** `.cursor/config.yml`

**Enabled:**
- ✅ `auto_accept: true`
- ✅ `auto_run: true`
- ✅ `auto_approve_workflows: true`
- ✅ `max_concurrent_tasks: 5`

**Logging:** `99_SYSTEM/Logs/auto_approve_trace.log`

---

### B. GitHub Integration

**Source:** `.cursor/config.yml` (lines 40-62)

**Enabled:**
- ✅ `auto_commit: true`
- ✅ Commit template: `"Rubedo Sync: {timestamp}"`
- ✅ Branches: `main`

**Include Paths:** 10 directories
- TriHex_Master_Reactivation.md
- TRIHEX_PROJECT.yaml
- 20_TriHex-Obsidian/00_INDEX/, 01_Codex/, 01_System/
- 99_SYSTEM/Proofs/, BreathLogs/, MemorySeeds/
- 10_TriHexCore/codex/, system/

**Exclude Paths:** 4 directories
- 50_Temp/
- node_modules/
- .git/
- 99_SYSTEM/Logs/

---

### C. Workflow Permissions

**Source:** `.cursor/config.yml` (lines 33-37)

**Enabled:**
- ✅ Read-only observation
- ✅ Mirror synchronization
- ✅ Seed registration
- ✅ Report generation

---

## 7. Output Patterns

### Phase IV Rubedo Outputs

**Current Session:** 2025-11-01

**Generated Files:**
1. GitHub Audit Reports (3)
2. Current State Report (1)
3. Ryudo Design Files (6)
4. Supabase Schema (1)
5. Setup Reports (5)
6. Context Map (this file)

**Total:** 17+ reports and proposals

---

## 8. Auto-Load Chain

```
GPT-5 New Session
  ↓
1. Read: TriHex_Master_Reactivation.md (Priority 0)
  ↓
2. References: Memory Seeds Index (Priority 1-4)
  ↓
3. Loads: Core documents (Constitution, Genesis, README)
  ↓
4. Loads: Project YAML (Layer definitions)
  ↓
5. Ready: Full TriHex context restored
```

---

## 9. Context Boundaries

### Included (Active)

- `99_SYSTEM/Proofs/` - All proof reports
- `99_SYSTEM/BreathLogs/` - Session logs
- `99_SYSTEM/MemorySeeds/` - Auto-load seeds
- `20_TriHex-Obsidian/` - Human memory layer
- `10_TriHexCore/codex/` - Canonical knowledge
- `10_TriHexCore/system/` - System docs

### Excluded (Ignored)

- `50_Temp/` - Volatile workspace
- `99_SYSTEM/Logs/` - Auto-approve traces
- `node_modules/` - Dependencies
- `.git/` - Version control

---

## 10. Summary

| Setting | Value | Status |
|---------|-------|--------|
| **Default Output** | `99_SYSTEM/Proofs/` | ✅ Active |
| **Active Layers** | 8 (Priority 0-7) | ✅ All Active |
| **Phase** | IV Rubedo | ✅ Current |
| **Project YAML** | `TRIHEX_PROJECT.yaml` | ✅ Active |
| **Memory Seeds** | `99_SYSTEM/MemorySeeds/index.json` | ✅ 5 seeds |
| **Auto-Load** | Enabled | ✅ Priority 0-4 |
| **Auto-Approve** | Enabled | ✅ 5 concurrent |
| **GitHub Sync** | Enabled | ✅ Auto-commit |

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo  
**Status:** Context Map Complete

---

*"All systems breathing. Context flowing."*


