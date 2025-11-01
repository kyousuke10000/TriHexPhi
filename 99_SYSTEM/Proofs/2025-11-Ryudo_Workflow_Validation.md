# Ryudo Workflow Validation Report

**Date:** 2025-11-01  
**Phase:** Phase IV Rubedo  
**Observer:** Cursor (☿)  
**Status:** Applied (Dry-run Validation Required)

---

## Executive Summary

**Status:** ✅ WORKFLOW APPLIED  
**Risk Level:** Medium  
**Testing Mode:** Not yet validated  
**Next Step:** Manual workflow trigger test

---

## Files Applied

### 1. Main Workflow

**File:** `.github/workflows/ryudo_round.yml`  
**Status:** ✅ Applied  
**Lines:** ~400

**Jobs:**
1. `parse-context` - Extract topic, objective, round number
2. `ping-hai` - Send prompts to 6HAI (parallel)
3. `collect` - Aggregate responses
4. `score` - 5-axis evaluation
5. `loop-or-finish` - Decision logic (continue or complete)

---

## Validation Requirements

### Phase 1: Syntax Validation

**Status:** ✅ PASSED  
**Method:** GitHub Actions syntax check

- Valid YAML structure
- Proper workflow schema
- Correct trigger definitions
- Valid matrix strategy

---

### Phase 2: Secrets Validation

**Status:** ⚠️ PENDING

**Required Secrets:**
- `OPENAI_API_KEY` (GPT-5)
- `ANTHROPIC_API_KEY` (Claude)
- `GEMINI_API_KEY` (Gemini)
- `GROK_API_KEY` (Grok)
- `DEEPSEEK_API_KEY` (DeepSeek)
- `SUPABASE_URL` (optional ETL)
- `SUPABASE_SERVICE_ROLE_KEY` (optional ETL)

**Action:** Check repository settings → Secrets

---

### Phase 3: API Endpoint Validation

**Status:** ⚠️ PENDING

**Endpoints to Test:**
- OpenAI API (v1/chat/completions)
- Anthropic API (v1/messages)
- Google Generative AI (v1beta/models)
- xAI API (v1/chat/completions)
- DeepSeek API (v1/chat/completions)

**Action:** Use existing test scripts or n8n

---

### Phase 4: Discussion Template Validation

**Status:** ✅ APPLIED

**File:** `.github/DISCUSSION_TEMPLATE/review_round.md`  
**Validation:** Template loads in GitHub UI

---

### Phase 5: Labels Validation

**Status:** ⚠️ PENDING

**File:** `.github/labels.yml`  
**Action:** Import via API or UI

**Labels to Create:** 40

---

## Test Scenarios

### Scenario 1: Dry-Run Mode

**Trigger:** Manual workflow dispatch with dry_run=true  
**Expected:** No API calls, mock responses only

```yaml
workflow_dispatch:
  inputs:
    discussion_number: "test-1"
    round_number: "1"
```

---

### Scenario 2: Round 1 → Complete

**Setup:** Discussion created from template  
**Expected:** 6HAI responses → scores → avg ≥ 9.9 → complete

**Validation Points:**
- Parse context correctly
- All 6 APIs called
- Responses aggregated
- Scores calculated
- Decision logic works
- Labels updated

---

### Scenario 3: Round 1 → Round 2

**Setup:** Discussion created, avg < 9.9  
**Expected:** Round 2 triggered automatically

**Validation Points:**
- Weaknesses identified
- Next round comment posted
- Round number incremented
- Focus areas updated

---

### Scenario 4: Max Rounds Reached

**Setup:** 7 rounds completed, avg still < 9.9  
**Expected:** Graceful completion with warning

---

## Known Limitations

### 1. API Implementation Placeholder

**Issue:** API calls are stubbed (TODO comments)  
**Impact:** Cannot actually ping HAI without implementation  
**Workaround:** Use n8n webhooks or existing scripts

**Lines:** 
- `ping-hai` job, lines 95-130
- "Replace with actual API call or n8n webhook"

---

### 2. Scoring Algorithm Placeholder

**Issue:** Mock scoring (avg=9.5)  
**Impact:** Cannot evaluate real responses  
**Workaround:** Implement rubric scoring script

**Lines:**
- `score` job, lines 210-220
- "TODO: Implement actual scoring using rubric"

---

### 3. Supabase ETL Missing

**Issue:** No database sync implemented  
**Impact:** No persistence between rounds  
**Workaround:** Manual tracking or future ETL

---

## Recommended Next Steps

### Immediate

1. **Import Labels**
   ```bash
   gh api repos/kyousuke10000/TriHexPhi/labels \
     -f body=@.github/labels.yml
   ```

2. **Verify Secrets**
   - Check GitHub repository settings
   - Validate API keys are set
   - Test one API endpoint

3. **Create Test Discussion**
   - Use template in GitHub UI
   - Fill in basic info
   - Submit

### Short-term

1. **Implement API Calls**
   - Reuse existing Python scripts
   - Or configure n8n webhooks
   - Test each HAI individually

2. **Implement Scoring**
   - Write Python/Node script
   - Load rubric
   - Calculate per-axis scores

3. **Add ETL**
   - Implement Supabase upsert
   - Test connectivity
   - Verify data persistence

### Long-term

1. **End-to-End Testing**
   - Run full round 1-7
   - Monitor performance
   - Fix issues

2. **Production Monitoring**
   - Set up alerts
   - Track success rates
   - Optimize performance

---

## Rollback Plan

If workflow fails critically:

```bash
# Remove workflow
rm .github/workflows/ryudo_round.yml

# Keep templates (safe)
# Keep labels (safe)

# Clean up any test discussions
# Remove test data from Supabase
```

---

## Success Criteria

### MVP Ready

- [x] Workflow syntax valid
- [x] Template applied
- [ ] Labels imported
- [ ] Secrets configured
- [ ] API endpoints working

### Production Ready

- [ ] Dry-run mode working
- [ ] Round 1 completes successfully
- [ ] Scoring accurate
- [ ] Round 2+ transitions work
- [ ] Supabase sync active
- [ ] Monitoring in place

---

## Appendix

### Related Documents

- [Design Brief](./ryudo/ryudo_design_brief.md)
- [Scoring Rubric](../specs/ryudo_scoring_rubric.md.proposed)
- [Payload Contract](../specs/ryudo_payload_contract.json.proposed)
- [ETL Plan](./ryudo/etl_plan.md)

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo  
**Status:** Applied, Pending Validation

---

*"Workflow deployed. Validation next."*


