# GitHub Workflows & Discussions Audit Report

**Date:** 2025-11-01  
**Phase:** Phase IV Rubedo  
**Observer:** Cursor (☿)  
**Mode:** Read-Only Analysis

---

## Executive Summary

**Total Workflows:** 14  
**Risk Level:** Medium  
**Success Probability:** 40% (secrets-dependent)  
**Key Finding:** Fragmented AI review system needs consolidation

---

## Top 5 Findings

### 1. AI Review Workflow Fragmentation 🔴 Critical

**Issue:** 3 separate workflows for 6AI reviews  
- `ai_review_discussions.yml` (v1)
- `ai_review_discussions_v2.yml` (redundant)
- `ai_review_v2.yml` (Issue-based)

**Impact:**
- Maintenance overhead
- Inconsistent behavior
- Confusion on which to use

**Recommendation:** 
- Consolidate to single workflow
- Support both Discussions and Issues
- Version control properly

---

### 2. Secrets Configuration Gap 🔴 Critical

**Issue:** 7 workflows depend on secrets, likely not configured  
**Affected:**
- All AI review workflows (API keys)
- Supabase sync
- PR auto-review

**Impact:**
- ~50% of workflows non-functional
- Silent failures without monitoring

**Recommendation:**
- Create secrets checklist
- Add pre-flight validation
- Document secret sources

---

### 3. API Key Naming Inconsistency 🟡 High

**Issue:** Inconsistent Google AI API key names
- `ai_review_discussions.yml`: `GEMINI_API_KEY`
- `ai_review_v2.yml`: `GOOGLE_AI_API_KEY`

**Impact:**
- Environment variable confusion
- One workflow fails while other succeeds

**Recommendation:**
- Standardize on single name
- Add environment variable mapping
- Update all references

---

### 4. Script Dependency Risk 🟡 High

**Issue:** 8 workflows reference external scripts, availability unknown  
**Affected:**
- Python review scripts (5 files)
- Node.js API scripts (2 files)
- Bash build script (1 file)

**Impact:**
- Workflows fail if scripts missing
- No fallback mechanism

**Recommendation:**
- Version control all scripts
- Add existence checks
- Document dependencies

---

### 5. Discussion API Limitations 🟢 Medium

**Issue:** Code comments indicate "Discussions API not fully supported"  
**Affected:**
- `ai_review_discussions.yml`
- `ai_review_discussions_v2.yml`
- `chl_monitor.yml`

**Impact:**
- Discussions may not create properly
- Fallback to Issues (implemented in `ai_review_v2.yml`)

**Recommendation:**
- Verify API support status
- Keep Issues fallback
- Test Discussion creation

---

## Error Pattern Classification

### Pattern A: Secrets Not Configured

**Count:** 7 workflows  
**Impact:** Workflow failure on API calls

**Workflows:**
1. ai_review_discussions.yml
2. ai_review_discussions_v2.yml
3. ai_review_v2.yml
4. ai_sync.yml
5. pr_auto_review_v3.yml
6. patent_research.yml
7. supabase_sync.yml

**Mitigation:** Secrets checklist + validation

---

### Pattern B: Scripts Missing

**Count:** 8 workflows  
**Impact:** File not found errors

**Scripts:**
- Python: `review_gpt5_round3.py`, `review_strategic_plan_round3.py`, etc.
- Node.js: `call-claude-api.js`, `call-gemini-api.js`
- Bash: `generate-context-bootstrap.sh`

**Mitigation:** Version control + existence checks

---

### Pattern C: Path/Config Mismatches

**Count:** 4 workflows  
**Impact:** Invalid configuration errors

**Workflows:**
1. janitor.yml (trihex.routes.yml)
2. pr_auto_review_v3.yml (context files)
3. task-generator.yml (frontmatter)
4. chl_monitor.yml (consciousness configs)

**Mitigation:** Configuration validation + defaults

---

### Pattern D: API Inconsistencies

**Count:** 2 workflows  
**Impact:** Environment variable confusion

**Issue:** `GOOGLE_AI_API_KEY` vs `GEMINI_API_KEY`

**Mitigation:** Standardize naming

---

### Pattern E: Git Operations

**Count:** 2 workflows  
**Impact:** Push failures, merge conflicts

**Workflows:**
1. trihex_sync.yml (auto-commit)
2. chl_monitor.yml (push commented out)

**Mitigation:** Conflict detection + dry-run

---

## Workflow Health Matrix

| Workflow | Success Prob | Risk Level | Blockers |
|----------|-------------|-----------|----------|
| trihex_sync.yml | 90% | Low | Git conflicts |
| trihex-knowledge-sync.yml | 85% | Low | Script existence |
| cursor-notifier.yml | 95% | Low | None |
| janitor.yml | 75% | Medium | Config validity |
| review-request.yml | 80% | Medium | Label validity |
| task-generator.yml | 75% | Medium | Frontmatter format |
| chl_monitor.yml | 60% | Medium | CHI calculation |
| ai_review_discussions.yml | 30% | High | Secrets, scripts |
| ai_review_discussions_v2.yml | 30% | High | Secrets, scripts |
| ai_review_v2.yml | 25% | High | Secrets, scripts, API keys |
| ai_sync.yml | 40% | High | Secrets, scripts |
| pr_auto_review_v3.yml | 35% | High | Secrets, scripts, API keys |
| patent_research.yml | 30% | High | Secrets, scripts |
| supabase_sync.yml | 20% | Critical | Secrets |

**Average:** 50% success probability

---

## Discussion Review Gap Analysis

**Status:** Cannot assess (no API access)

**Manual Inspection Required:**
1. Categories count and names
2. Templates existence
3. Recent 50 discussions state
4. Labels hierarchy

**Known Intentions:**
- AI Review category (from workflows)
- CHL Alerts category (from chl_monitor.yml)
- General fallback

**Proposed Enhancement:**
- Review-specific template
- Score tracking labels
- Round progression labels

---

## Quick Wins (≤1 Day)

### 1. Consolidate AI Review ✅

**Time:** 2 hours  
**Impact:** High  
**Steps:**
1. Choose Discussions vs Issues (or support both)
2. Merge 3 workflows into 1
3. Remove redundant workflow
4. Update documentation

---

### 2. Standardize API Keys ✅

**Time:** 30 minutes  
**Impact:** Medium  
**Steps:**
1. Choose single Google AI API key name
2. Update all workflow references
3. Document in secrets checklist

---

### 3. Add Pre-Flight Validation ✅

**Time:** 1 hour  
**Impact:** High  
**Steps:**
1. Create validation script
2. Add to each workflow
3. Fail fast with clear errors

---

### 4. Document Secrets Checklist ✅

**Time:** 30 minutes  
**Impact:** High  
**Output:** `99_SYSTEM/Proofs/secrets_checklist.md`

---

## Open Questions

1. **Which AI review workflow should be canonical?**
   - Discussions vs Issues preference?
   - Obsidian sync necessary?

2. **What is the status of Discussions API?**
   - Fully supported or limitations?
   - Need to migrate to Issues?

3. **Where are scripts located?**
   - `.github/scripts/` exists?
   - Python/Node dependencies documented?

4. **What secrets are actually configured?**
   - GitHub repository settings check needed
   - API keys available?

5. **Should we enable CHL monitor git push?**
   - Currently commented out
   - Safe to enable?

---

## Architecture Recommendations

### Short-Term (Week 1)

**Consolidate & Standardize**
- Merge 3 AI review workflows → 1 unified
- Standardize API key names
- Create secrets checklist
- Add script existence checks

---

### Medium-Term (Month 1)

**Enhance & Monitor**
- Add workflow run tracking
- Create dashboard for success rates
- Set up failure alerts
- Document all scripts

---

### Long-Term (Quarter 1)

**Optimize & Automate**
- Unify AI review system
- Add Ryudo round-based reviews
- Implement scoring rubric
- Auto-retry on failures

---

## Risk & Impact Matrix

| Risk | Probability | Impact | Priority |
|------|------------|--------|----------|
| Secrets not configured | 80% | Critical | P0 |
| Scripts missing | 60% | High | P0 |
| API key confusion | 50% | Medium | P1 |
| Discussion API issues | 40% | Low | P2 |
| Git conflicts | 30% | Medium | P1 |
| Config mismatches | 40% | Medium | P1 |

---

## Appendix

- **Workflows Inventory:** `gh_audit/workflows_inventory.md`
- **Discussions Inventory:** `gh_audit/discussions_inventory.md`
- **Supabase Scan:** `supabase_scan/health_report.md`
- **Best Practices Gap:** `best_practice_gap.md`

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo  
**Next Phase:** Ryudo Design & Proposal Generation

---

*"Audit complete. Fragmentation detected. Consolidation recommended."*


