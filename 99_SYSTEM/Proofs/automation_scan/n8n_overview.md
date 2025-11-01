# n8n Automation Overview

**Date:** 2025-11-01  
**Phase:** Phase IV Rubedo  
**Observer:** Cursor (☿)

---

## Workflows Inventory

### Total: 12 Completed Workflows (documented)

| # | Name | Type | Status | Files |
|---|------|------|--------|-------|
| 1 | 6AI Parallel Review | AI協働 | ✅ Done | `6AI並列相互検証システム（完全版）.json` |
| 2 | ChatWork FAQ Bot | ChatWork | ✅ Done | `Phase 3.6 - ChatWork FAQ Bot.json` |
| 3 | FAQ Collector | ChatWork | ✅ Done | `🤖 Chatwork FAQ Collector (Phase 3.4).json` |
| 4 | Answer Collector | ChatWork | ✅ Done | `🤖 FAQ Answer Collector (Phase 3.5).json` |
| 5 | FAQ Embeddings | Knowledge | ✅ Done | `🧠 FAQ Embeddings Upsert (Phase 3.6-2).json` |
| 6 | Notion KB Generator | Knowledge | ✅ Done | `📊 Notion - 💡 Knowledge Base Auto Generator copy.json` |
| 7 | Failure KB Generator | Knowledge | ✅ Done | `🔥 Failure KB Auto Generator (Phase 3.6-KB).json` |
| 8 | MIZUKAGAMI Reflection | MIZUKAGAMI | ✅ Done | `💠 Phase 1&2_MIZUKAGAMI - Reflection.json` |
| 9 | Spiral Promotion | 六螺旋 | ✅ Done | `🔮 Phase 3.2-alpha_Spiral Promotion System.json` |
| 10 | Continuum Analyzer | 六螺旋 | ✅ Done | `🌊 Phase 3.3.1_ Continuum Analyzer.json` |
| 11 | Resonance Builder | 六螺旋 | ✅ Done | `🌊 Phase 3.3.2_ Resonance Builder.json` |
| 12 | Coherence Tracker | 六螺旋 | ✅ Done | `🔮 Phase 3.3.3_ Coherence Tracker.json` |

---

## Data Flow Analysis

### Observed Connections

```
ChatWork/Discord/Zoom
  ↓ Webhook
n8n Workflows
  ↓
Supabase (FAQ/KB) / Notion / Git
```

**Key Integrations:**
- **ChatWork** → FAQ Bot → Embeddings → Supabase pgvector
- **6AI Reviews** → Parallel processing → Notion/Git
- **MIZUKAGAMI** → Auto-reflection → Storage

---

## Supabase Read/Write Directions

| Workflow | Reads From | Writes To | Direction |
|----------|-----------|-----------|-----------|
| FAQ Bot | Supabase (pgvector) | ChatWork | R → W |
| FAQ Collector | ChatWork | Supabase | R → W |
| FAQ Embeddings | Supabase | Supabase (vectors) | R → W |
| Notion KB | Git/External | Notion | R → W |
| MIZUKAGAMI | AIs/Chat | Storage | R → W |

**Observation:** No Obsidian ↔ Supabase sync workflows found.

---

## Error Handling

**Status:** Read-only observation (no error logs accessible)

**Expected (from docs):**
- Retry strategies with backoff
- Failure notifications
- Error logs to Supabase

---

## GitHub Actions vs n8n

### Current Split

**GitHub Actions (12 workflows):**
- Git-triggered automation
- Daily schedules
- CI/CD
- Context bootstrap
- Knowledge relay

**n8n (12 workflows):**
- Real-time webhooks
- ChatWork integration
- FAQ automation
- MIZUKAGAMI reflection
- 六螺旋 analysis

**Hybrid Strategy:** ✅ Complementary

---

## Gaps & Risks

### ❌ Missing

1. **No Obsidian Sync**
   - No n8n workflow for Obsidian ↔ Supabase
   - No mirror tracking

2. **No Error History**
   - Cannot verify retry effectiveness
   - Unknown failure rates

3. **Files Not in Repo**
   - JSON workflow files not in version control
   - Manual deployment only

### ⚠️ Risks

- Workflow files not in Git
- No automated deployment
- Reliance on manual n8n configuration

---

## Recommendations

### Critical

1. Export n8n workflows to `10_TriHexCore/tools/workflows/`
2. Version control all `.json` files
3. Add Obsidian sync workflow

### High Priority

4. Add error monitoring
5. Document secrets requirements
6. Create deployment automation

---

*Generated: 2025-11-01 / Cursor (☿)*


