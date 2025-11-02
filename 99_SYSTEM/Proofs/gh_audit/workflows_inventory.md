# GitHub Actions Workflows Inventory

**Date:** 2025-11-01  
**Phase:** Phase IV Rubedo  
**Observer:** Cursor (☿)  
**Total Workflows:** 14

---

## Executive Summary

**Status:** Active repository with comprehensive automation  
**Pattern:** Multi-workflow setup for AI collaboration, review, sync, and monitoring  
**Risk Level:** Medium (secrets-dependent workflows)

---

## Workflow Inventory

### 1. ai_review_discussions.yml

**Purpose:** 6AI collaborative review via GitHub Discussions  
**Triggers:** `workflow_dispatch`  
**Permissions:** contents, issues, pull-requests, discussions (write)

**Jobs:**
- `ai-review`: Sequential 6AI reviews (GPT-5, Claude, Gemini, Grok, DeepSeek)

**Required Secrets:**
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `GROK_API_KEY`
- `DEEPSEEK_API_KEY`

**Scripts:**
- `.github/scripts/review_gpt5_round3.py`
- `.github/scripts/review_strategic_plan_round3.py`
- `.github/scripts/review_gemini_round3.py`
- `.github/scripts/review_grok_round3.py`
- `.github/scripts/review_deepseek_round3.py`

**Features:**
- Creates Discussion for each review
- Posts AI responses as comments
- Saves to Obsidian (`10_CAPTURE_MIZUKAGAMI/GitHub/Discussions/`)

**Failure Pattern:** Scripts missing or API key not set

---

### 2. ai_review_discussions_v2.yml

**Purpose:** Simplified 6AI review (v2)  
**Triggers:** `workflow_dispatch`  
**Permissions:** contents, issues, pull-requests, discussions (write)

**Jobs:**
- `ai-review`: Same as v1 but without Obsidian sync

**Required Secrets:** Same as v1

**Difference:** No Obsidian sync step

**Status:** Appears to be redundant with v1

---

### 3. ai_review_v2.yml

**Purpose:** 6AI review via Issues (not Discussions)  
**Triggers:** `workflow_dispatch`  
**Permissions:** contents, issues, pull-requests (write)

**Jobs:**
- `ai-review`: Sequential AI reviews posted as Issue comments

**Required Secrets:**
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_AI_API_KEY` (note: different from GEMINI_API_KEY)
- `GROK_API_KEY`
- `DEEPSEEK_API_KEY`

**Scripts:**
- `.github/scripts/review_gpt5.py`
- `.github/scripts/review_claude.py`
- `.github/scripts/review_gemini.py`
- `.github/scripts/grok_review_final.py`
- `.github/scripts/review_deepseek.py`

**Features:**
- Creates Issue for tracking
- Posts progress bars
- Saves artifacts

**Failure Pattern:** Inconsistent API key naming (GOOGLE_AI_API_KEY vs GEMINI_API_KEY)

---

### 4. chl_monitor.yml

**Purpose:** CHL (Conscious Harmonic Layer) monitoring  
**Triggers:** 
- Schedule: Every 5 minutes (`*/5 * * * *`)
- `workflow_dispatch` with mode input

**Permissions:** Not specified (default read)

**Jobs:**
- `monitor-consciousness`: CHI calculation, focus check, phase_map update

**Scripts:**
- `consciousness/chi_calculator.js`

**Config:**
- `consciousness/config/focus.yml`
- `consciousness/config/phase_map.yml`

**Features:**
- CHI calculation every 5 minutes
- Creates Discussion on tuning needed
- Commits to consciousness/ directory (push commented out)

**Failure Pattern:** 
- CHI calculation fails silently
- Discussion API not fully working
- Git push disabled (line 144)

---

### 5. cursor-notifier.yml

**Purpose:** Notify Cursor about issues requiring action  
**Triggers:** Issues (opened, labeled)

**Permissions:** issues (write)

**Jobs:**
- `notify-cursor-action`: When `cursor-action-required` label
- `notify-review-needed`: When AI review labels

**Features:**
- Webhook to Discord (optional)

**Required Secrets:**
- `DISCORD_WEBHOOK_URL` (optional)

**Failure Pattern:** Silent if no webhook configured

---

### 6. janitor.yml

**Purpose:** Route `_inbox/` files based on frontmatter  
**Triggers:**
- Push to `_inbox/**`
- Push to `configs/trihex.routes.yml`
- PR with inbox changes
- `workflow_dispatch`

**Permissions:** contents (read), issues, pull-requests (write)

**Jobs:**
- `analyze-inbox`: Gentile mode routing

**Scripts:**
- `.github/scripts/route-inbox.js`

**Config:**
- `configs/trihex.routes.yml`

**Features:**
- Gentle mode (proposes only)
- Comments on PR
- Reports errors

**Failure Pattern:** Invalid frontmatter, missing config

---

### 7. patent_research.yml

**Purpose:** 6AI patent research via Discussions  
**Triggers:** `workflow_dispatch` with topic selection

**Permissions:** contents, issues, discussions (write)

**Jobs:**
- `patent-research`: Sequential 6AI patent analysis

**Required Secrets:** Same as ai_review_discussions.yml

**Features:**
- Creates Discussion
- Multiple research topics
- Saves artifacts

**Failure Pattern:** API keys missing

---

### 8. pr_auto_review_v3.yml

**Purpose:** Auto-review PRs with Claude & Gemini  
**Triggers:** Pull request (opened, synchronize, reopened)

**Permissions:** contents (read), pull-requests, issues (write)

**Jobs:**
- `claude-review`: Ethical review
- `gemini-review`: Aesthetic review

**Required Secrets:**
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY` (and `GOOGLE_API_KEY` alias)

**Scripts:**
- `.github/scripts/call-claude-api.js`
- `.github/scripts/call-gemini-api.js`

**Context:**
- `TRIHEXPHI.md`
- `10_CAPTURE_MIZUKAGAMI/続きから始める.md`

**Features:**
- Context bootstrap
- Posts reviews as comments

**Failure Pattern:** Context files missing, API keys not set

---

### 9. review-request.yml

**Purpose:** Generate review request Issues from PR labels  
**Triggers:** Pull request (opened, labeled, synchronize)

**Permissions:** contents (read), issues (write), pull-requests (read)

**Jobs:**
- `generate-review-requests`: Label-based review issue creation

**Labels:**
- `needs-review-claude`
- `needs-review-gemini`
- `needs-review-grok`
- `needs-review-deepseek`
- `needs-review-gpt5`

**Features:**
- Creates issues per AI reviewer
- Includes PR diff
- Provides context

**Failure Pattern:** Invalid labels, PR parsing errors

---

### 10. supabase_sync.yml

**Purpose:** Sync mirror index to Supabase  
**Triggers:** 
- Schedule: Every hour at :15 (`15 * * * *`)
- `workflow_dispatch` with dry_run input

**Permissions:** contents (read)

**Jobs:**
- `sync-db`: Mirror index → Supabase upsert

**Required Secrets:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Scripts:** Inline JavaScript

**Features:**
- Secrets validation
- Dry-run support
- Always generates report

**Failure Pattern:** Secrets not configured

---

### 11. task-generator.yml

**Purpose:** Generate task Issues from new files  
**Triggers:** 
- Push to `decisions/**`, `stories/**`, `_inbox/**`
- Branches: main, feature/**

**Permissions:** contents (read), issues (write)

**Jobs:**
- `generate-tasks`: Auto-issue creation

**Features:**
- Tier 1 → translation tasks
- Decision draft → review tasks
- Frontmatter parsing

**Failure Pattern:** Invalid frontmatter, trihex field missing

---

### 12. trihex-knowledge-sync.yml

**Purpose:** Daily context bootstrap generation  
**Triggers:**
- Schedule: Daily at 00:00 UTC (`0 0 * * *`)
- `workflow_dispatch`

**Permissions:** Not specified

**Jobs:**
- `sync`: Build context-bootstrap.txt

**Scripts:**
- `.trihex/scripts/generate-context-bootstrap.sh`

**Output:**
- `.trihex/context-bootstrap.txt`

**Features:**
- Auto-commit if changed
- Artifact upload

**Failure Pattern:** Script missing, bash errors

---

### 13. trihex_sync.yml

**Purpose:** Vault auto-sync to GitHub  
**Triggers:**
- Push to selected paths
- Schedule: Every hour (`0 * * * *`)
- `workflow_dispatch`

**Permissions:** contents, pull-requests (write)

**Jobs:**
- `sync`: Vault structure verification, mirror checks, auto-commit

**Features:**
- Vault verification
- Mirror integrity checks
- Sync summary generation

**Failure Pattern:** Git push failures, mirror conflicts

---

### 14. ai_sync.yml

**Purpose:** Knowledge Relay auto-sync  
**Triggers:**
- Schedule: Daily at 00:00 UTC (`0 0 * * *`)
- Push to `capture/**`, `structure/**`
- `workflow_dispatch`

**Permissions:** contents, issues, pull-requests (write)

**Jobs:**
- `sync-capture-to-structure`: Spiral scan, cause profile, GPT-5 review issues

**Scripts:**
- `tools/spiral_scan.py`
- `tools/cause_profile.py`

**Features:**
- Processes new capture files
- Generates review issues

**Failure Pattern:** Python dependencies, script errors

---

## Common Failure Patterns

### Pattern 1: Secrets Not Configured

**Affected:** 7 workflows  
**Impact:** High  
**Symptom:** API calls fail, workflows exit with error

**Workflows:**
- ai_review_discussions.yml
- ai_review_discussions_v2.yml
- ai_review_v2.yml
- ai_sync.yml
- pr_auto_review_v3.yml
- patent_research.yml
- supabase_sync.yml

---

### Pattern 2: Script Files Missing

**Affected:** 8 workflows  
**Impact:** Medium  
**Symptom:** File not found errors

**Workflows:**
- ai_review_*.yml (5 Python scripts)
- pr_auto_review_v3.yml (Node.js scripts)
- trihex-knowledge-sync.yml (bash script)
- ai_sync.yml (Python tools)

---

### Pattern 3: API Inconsistencies

**Affected:** 2 workflows  
**Impact:** Low  
**Symptom:** Different environment variable names

**Issues:**
- `GOOGLE_AI_API_KEY` vs `GEMINI_API_KEY`
- `ai_review_v2.yml` uses `GOOGLE_AI_API_KEY`

---

### Pattern 4: Path/Config Mismatches

**Affected:** 4 workflows  
**Impact:** Medium  
**Symptom:** Files not found, invalid config

**Workflows:**
- janitor.yml (configs/trihex.routes.yml)
- pr_auto_review_v3.yml (context files)
- task-generator.yml (frontmatter format)
- chl_monitor.yml (consciousness/ configs)

---

### Pattern 5: Discussion API Limitations

**Affected:** 3 workflows  
**Impact:** Low  
**Symptom:** Discussions not created or errors

**Note:** According to comments, Discussions API "not fully supported"  
**Workflows:**
- ai_review_discussions.yml
- ai_review_discussions_v2.yml
- chl_monitor.yml

---

## Success/Failure Analysis

**Note:** Read-only audit, no live execution data available

**Estimation:**
- High success probability: 3 workflows
  - trihex_sync.yml (Git-only operations)
  - trihex-knowledge-sync.yml (simple build)
  - cursor-notifier.yml (notifications only)

- Medium success probability: 4 workflows
  - janitor.yml (frontmatter parsing)
  - review-request.yml (label-based)
  - task-generator.yml (frontmatter parsing)
  - chl_monitor.yml (CHI calculation)

- Low success probability: 7 workflows
  - All AI review workflows (secrets-dependent)
  - supabase_sync.yml (secrets-dependent)
  - pr_auto_review_v3.yml (secrets-dependent)

---

## Recommendations

### 1. Immediate

**Consolidate AI Review Workflows**
- Remove `ai_review_discussions_v2.yml` (redundant)
- Standardize API key names
- Choose Discussions vs Issues consistently

**Configure Secrets**
- Create checklist of required secrets
- Document secret sources
- Add secret validation to workflows

---

### 2. Short-term

**Script Management**
- Version control all scripts
- Add error handling to all scripts
- Document script dependencies

**Test Coverage**
- Add dry-run modes to all workflows
- Create test scenarios
- Document expected outputs

---

### 3. Long-term

**Monitoring**
- Add workflow run tracking
- Create dashboard for success rates
- Set up alerts for failures

**Consolidation**
- Merge similar workflows
- Create unified AI review system
- Standardize error handling

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo  
**Next:** GitHub Discussions inventory


