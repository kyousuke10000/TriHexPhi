# GitHub Workflows Scan

**Date:** 2025-11-01  
**Phase:** Phase IV Rubedo  
**Observer:** Cursor (☿)

---

## Workflows Overview

### Total: 12 Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ai_review_discussions_v2.yml` | manual/push | AI review integration |
| `ai_review_discussions.yml` | manual/push | AI review discussions |
| `ai_review_v2.yml` | manual | AI review system |
| `ai_sync.yml` | schedule/push | Knowledge auto-sync |
| `chl_monitor.yml` | schedule | CHL monitoring |
| `cursor-notifier.yml` | push | Cursor notifications |
| `janitor.yml` | push/PR | File routing (gentle) |
| `patent_research.yml` | schedule | Patent research |
| `pr_auto_review_v3.yml` | PR | Auto-review |
| `review-request.yml` | manual | Review requests |
| `task-generator.yml` | schedule | Task generation |
| `trihex-knowledge-sync.yml` | schedule | Context bootstrap |

---

## Key Workflows Analysis

### 1. Janitor (Gentle Mode)

**File:** `.github/workflows/janitor.yml`  
**Mode:** gentle (warnings only, no auto-move)  
**Trigger:** push to `_inbox/**` or PR changes

**Actions:**
- Analyze frontmatter
- Generate routing proposals
- Comment on PRs
- Add labels

**Status:** ✅ Configured

### 2. Knowledge Auto-Sync

**File:** `.github/workflows/ai_sync.yml`  
**Trigger:** Daily cron (00:00 UTC) + push to `capture/**`

**Pipeline:**
```
capture/ → spiral_scan → cause_profile → GPT-5 review → structure/
```

**Status:** ✅ Configured

### 3. Context Bootstrap

**File:** `.github/workflows/trihex-knowledge-sync.yml`  
**Trigger:** Daily cron (00:00 UTC)

**Actions:**
- Generate `.trihex/context-bootstrap.txt`
- Archive artifact
- Auto-commit if changed

**Status:** ✅ Configured

---

## Secrets & Configuration

**Status:** Not accessible (read-only observation)

**Required Secrets (from docs):**
- `SUPABASE_URL` / `SUPABASE_KEY`
- `OPENAI_API_KEY` (for AI reviews)
- `STRIPE_SECRET_KEY`
- Publishing API keys (LINE, X, etc.)

---

## Configurations

### Janitor Config

**File:** `10_TriHexCore/configs/janitor.config.yml`  
**Mode:** `auto` (current setting)  
**Strategy:** `direct_push`

### Routing Rules

**File:** `10_TriHexCore/configs/trihex.routes.yml`  
**Version:** 1.2  
**Rules:** 7 kinds (story, spec, decision, log, summary, letter, doc)

---

## Observed Patterns

### ✅ Good Practices

- 3-mode Janitor (gentle/auto/strict)
- Knowledge Relay flow defined
- Daily sync schedules
- PR commenting for transparency

### ⚠️ Gaps

- No Supabase write actions observed
- No pgvector embeddings workflow
- No Obsidian sync trigger
- Limited error handling in workflows

---

## Recommendations

### Immediate

1. Add Supabase sync workflow
2. Add embeddings generation step
3. Add error notification handling
4. Document secrets requirements

### Future

5. Add monitoring dashboard
6. Implement retry logic
7. Add dry-run capabilities

---

*Generated: 2025-11-01 / Cursor (☿)*


