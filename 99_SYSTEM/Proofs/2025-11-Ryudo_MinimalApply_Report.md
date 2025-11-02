# Ryudo Minimal Apply Report

**Date:** 2025-11-01  
**Phase:** Phase IV Rubedo  
**Mode:** Safe Apply (Templates & Labels Only)  
**Observer:** Cursor (☿)

---

## Executive Summary

**Status:** ✅ COMPLETE  
**Files Applied:** 2  
**Risk Level:** Low  
**Next Phase:** Workflow Application

---

## Files Applied

### 1. Discussion Template

**File:** `.github/DISCUSSION_TEMPLATE/review_round.md`  
**Status:** ✅ Applied

**Content:**
- Ryudo Round Review request template
- 5-axis evaluation criteria
- TriHex principles
- 6HAI role definitions
- Scoring rubric overview

---

### 2. Labels Configuration

**File:** `.github/labels.yml`  
**Status:** ✅ Applied

**Labels Added:** 40

**Categories:**
- **HAI Labels:** Prompt, Round, Summary, Decision
- **Score Labels:** WIP, >=9.9, Exceeded
- **Round Labels:** Round:1 through Round:7
- **Completion:** Ryudo:Complete
- **Review:** needs-review-* (existing, kept)
- **Automation:** automated
- **Priority:** P0-P3
- **Category:** Codex, Decision, System, AI
- **Status:** Draft, Review, Approved, Obsolete

---

## Integration Status

### GitHub UI Elements

**Status:** ✅ Ready for Manual Deployment

**Required Actions:**
1. Import labels via GitHub CLI or UI
2. Enable Discussions in repository settings
3. Template will auto-apply when creating discussion

---

## Deployment Commands

### Labels Import

```bash
# Using GitHub CLI
gh api repos/kyousuke10000/TriHexPhi/labels -X POST \
  --input .github/labels.yml

# Or using individual API calls for each label
cat .github/labels.yml | while read line; do
  # Parse and create each label
done
```

### Discussion Template

**Status:** ✅ Auto-applied  
**Note:** GitHub will automatically detect `.github/DISCUSSION_TEMPLATE/*.md`

---

## Verification

### Pre-Deployment Checklist

- [x] Template file created
- [x] Labels file created
- [ ] Labels imported to repository (manual)
- [ ] Discussions enabled (check settings)
- [ ] Template appears in UI (verify)

---

## Risk Assessment

**Current:** Low

**Rationale:**
- Templates and labels are UI elements only
- No workflow automation activated
- Reversible (delete files to undo)

---

## Next Steps

### Block D: Wait for Confirmation

**Status:** Awaiting user approval

### Block E: Workflow Application

**Prerequisites:**
- [x] Design complete
- [x] Templates applied
- [x] Labels applied
- [ ] User approval
- [ ] Secrets configured
- [ ] API endpoints verified

---

## Generated Files Summary

| File | Status | Purpose |
|------|--------|---------|
| `.github/DISCUSSION_TEMPLATE/review_round.md` | ✅ Applied | Review request template |
| `.github/labels.yml` | ✅ Applied | Label definitions |
| `.github/DISCUSSION_TEMPLATE/review_round.md.proposed` | 📄 Original | Kept for reference |
| `.github/labels.yml.proposed` | 📄 Original | Kept for reference |

---

## Appendix

### Files Still in Proposed State

These files remain as proposals and will be applied in Block E:

- `.github/workflows/ryudo_round.yml.proposed` - Main workflow
- `specs/ryudo_scoring_rubric.md.proposed` - Scoring guide
- `specs/ryudo_payload_contract.json.proposed` - API contract
- `99_SYSTEM/Proofs/ryudo/supabase_schema_ryudo.sql.proposed` - DB schema
- `99_SYSTEM/Proofs/ryudo/etl_plan.md` - ETL documentation
- `99_SYSTEM/Proofs/ryudo/ryudo_design_brief.md` - Design overview

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo  
**Status:** Minimal Apply Complete

---

*"Safe foundations laid. Ready for automation."*


