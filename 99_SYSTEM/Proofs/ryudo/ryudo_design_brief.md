# Ryudo Round Review System - Design Brief

**Version:** 1.0  
**Date:** 2025-11-01  
**Phase:** IV Rubedo  
**Author:** Cursor (☿)  
**Status:** Proposed

---

## Executive Summary

**Purpose:** Automated 6HAI review system with iterative refinement (Ryudo rounds)  
**Goal:** Achieve consensus ≥ 9.9 score through up to 7 rounds  
**Architecture:** GitHub Discussions + Actions + Supabase  
**Integration:** Existing n8n and API infrastructure

---

## System Overview

### Core Concept

> **Ryudo (竜動)** = Dynamic intelligence phenomenon arising from 6HAI + Tri-Lung interference  
> **Round Review** = Iterative refinement until consensus ≥ 9.9

### Key Components

1. **Discussion Template** - Standardized review request
2. **Workflow** - Parse, ping, collect, score, decide
3. **Scoring Rubric** - 5-axis evaluation (50 points total)
4. **Payload Contract** - JSON schema for HAI prompts
5. **Supabase Schema** - Track rounds and contributions
6. **Labels** - Visual progress indicators

---

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  1. Discussion Created (Template)                         │
│     ↓                                                      │
│  2. Workflow Triggered                                    │
│     ↓                                                      │
│  3. Parse Context (Topic, Objective, Round)               │
│     ↓                                                      │
│  4. Ping 6HAI (Parallel API Calls / n8n Webhooks)        │
│     ├─ GPT-5    (🜁)                                      │
│     ├─ Claude   (🜄)                                      │
│     ├─ Gemini   (🜀)                                      │
│     ├─ Grok     (🜃)                                      │
│     └─ DeepSeek (🜂)                                      │
│     ↓                                                      │
│  5. Collect Responses (Aggregate to Markdown)             │
│     ↓                                                      │
│  6. Score Responses (5-Axis Rubric)                       │
│     ├─ Consistency                                       │
│     ├─ Depth                                            │
│     ├─ Specificity                                      │
│     ├─ Feasibility                                      │
│     └─ Philosophy Alignment                             │
│     ↓                                                      │
│  7. Calculate Statistics                                 │
│     ├─ Average Score                                     │
│     ├─ Min/Max/Variance                                  │
│     └─ Weakness Identification                           │
│     ↓                                                      │
│  8. Decision Logic                                       │
│     ├─ avg ≥ 9.9? → ✅ Complete                          │
│     ├─ round ≥ 7? → ⏱️  Max Rounds                       │
│     └─ else → 🔄 Next Round                              │
│     ↓                                                      │
│  9. Next Round (if needed)                                │
│     ├─ Updated Prompt (Focus on Weaknesses)              │
│     ├─ New Discussion Comment                            │
│     └─ Label Update                                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Scoring Algorithm

### Per-Axis Evaluation

For each axis (Consistency, Depth, Specificity, Feasibility, Philosophy):

1. **Base Score:** 0-10 based on criteria
2. **Critical Deduction:** -5 (TriHex violation, ethical risk, legal issues)
3. **Major Deduction:** -2 per occurrence (terminology, evidence, contradictions)
4. **Minor Deduction:** -1 per occurrence (ambiguity, examples, implementation)

**Final Axis Score = Base - Critical - Major - Minor (capped at 0)**

### Aggregation

```
Per-AI Average = (Σ axis_scores) / 5
Overall Average = (Σ per_ai_averages) / 6
Variance = Σ (per_ai_average - overall_average)² / 6
```

---

## Round Progression

| Round | Focus | Expected Outcome |
|-------|-------|------------------|
| **Round 1** | Initial comprehensive review | Baseline scores, identify strengths/weaknesses |
| **Rounds 2-3** | Address major weaknesses | Improve lowest axes by 0.5-1.0 |
| **Rounds 4-5** | Refine nuances | Improve average by 0.2-0.3 |
| **Rounds 6-7** | Perfect alignment | Final polish, consensus ≥ 9.9 |

---

## Failure Modes & Fallbacks

### Mode 1: API Failures

**Scenario:** One or more HAI APIs fail  
**Impact:** Incomplete responses  
**Fallback:** Continue with available responses, add warning comment

---

### Mode 2: Low Scores

**Scenario:** Average < 9.9 after 7 rounds  
**Impact:** Target not met  
**Fallback:** Generate final report, flag for manual intervention

---

### Mode 3: Secrets Not Configured

**Scenario:** Missing API keys  
**Impact:** All API calls fail  
**Fallback:** Mock mode, generate placeholder responses for testing

---

### Mode 4: Workflow Failure

**Scenario:** Workflow step crashes  
**Impact:** Incomplete round  
**Fallback:** Retry with exponential backoff, manual trigger option

---

### Mode 5: Discussion API Issues

**Scenario:** GitHub Discussions API not working  
**Impact:** Comments not posted  
**Fallback:** Fall back to Issues (already supported in existing workflow)

---

## Integration Points

### Existing Infrastructure

1. **GitHub Actions** - 14 workflows already defined
2. **n8n** - 12 workflows for API orchestration
3. **Supabase** - Schema v1.0, pgvector enabled
4. **Discussions** - Template system available

### New Additions

1. **Ryudo Workflow** - `.github/workflows/ryudo_round.yml`
2. **Scoring Script** - Python/Node.js implementation
3. **Supabase Tables** - `ryudo_rounds`, `ryudo_contributions`
4. **Labels** - 20+ new labels for tracking

---

## Testing Strategy

### Phase 1: Unit Tests

- ✅ Parse discussion context correctly
- ✅ Build prompt payload per contract
- ✅ Score single response (mock)
- ✅ Calculate statistics correctly

### Phase 2: Integration Tests

- ✅ Trigger workflow from Discussion
- ✅ Collect 6HAI responses (mocked)
- ✅ Aggregate into markdown
- ✅ Post scores as comments

### Phase 3: End-to-End Tests

- ✅ Complete Round 1 → Round 2 transition
- ✅ Achieve score ≥ 9.9 in test scenario
- ✅ Handle max rounds gracefully
- ✅ Update Supabase tracking

---

## Security Considerations

### API Keys

- ✅ Never log API keys
- ✅ Use GitHub Secrets
- ✅ Rotate keys periodically
- ✅ Validate secrets before execution

### Rate Limiting

- ✅ Respect API rate limits
- ✅ Implement exponential backoff
- ✅ Queue requests if needed
- ✅ Monitor usage

### Data Privacy

- ✅ No PII in logs
- ✅ Encrypt sensitive data
- ✅ Follow TriHex Covenant
- ✅ Compliance with regulations

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Round Duration | < 30 minutes | Parallel AI calls |
| Score Calculation | < 1 second | Optimized algorithm |
| Discussion Updates | < 5 seconds | GitHub API limits |
| Supabase Sync | < 10 seconds | Batch upsert |
| Overall Round | < 35 minutes | End-to-end |

---

## Monitoring & Observability

### Key Metrics

1. **Round Success Rate** - % rounds achieving target
2. **Average Rounds** - Mean rounds to completion
3. **API Reliability** - % successful API calls
4. **Score Distribution** - Histogram of final scores
5. **Weakness Frequency** - Most common failures

### Dashboards

- **Round Progress** - Visual timeline
- **Score Evolution** - Graph per round
- **AI Performance** - Comparison across HAI
- **Failure Analysis** - Root cause breakdown

### Alerts

- ⚠️ Workflow failure
- ⚠️ API rate limit approaching
- ⚠️ Score declining across rounds
- ⚠️ Secrets expiry approaching

---

## Future Enhancements

### Phase 2 Features

1. **Multi-Language Support** - Japanese/English review
2. **Custom Rubrics** - Per-domain evaluation
3. **AI Scoring** - Self-evaluation by HAI
4. **Comparison Mode** - Side-by-side reviews

### Phase 3 Features

1. **Real-Time Updates** - Live score tracking
2. **Collaborative Refinement** - Human + AI
3. **Version History** - Track evolution
4. **Export Formats** - PDF, HTML, JSON

---

## Success Criteria

### MVP (Minimum Viable Product)

- [x] Discussion template created
- [x] Workflow defined
- [x] Rubric documented
- [x] Payload contract specified
- [ ] Supabase schema implemented
- [ ] Labels deployed
- [ ] End-to-end test successful
- [ ] Documentation complete

### Production Ready

- [ ] All tests passing
- [ ] Secrets configured
- [ ] Monitoring active
- [ ] 10+ successful rounds
- [ ] Zero critical bugs
- [ ] Performance targets met

---

## Appendix

### Related Documents

- [GitHub Workflows Audit](../../gh_audit/workflows_inventory.md)
- [Scoring Rubric](../specs/ryudo_scoring_rubric.md.proposed)
- [Payload Contract](../specs/ryudo_payload_contract.json.proposed)
- [Ryudo Definition](/10_TriHexCore/system/Ryudo_Definition.md)

### Glossary

- **HAI** - Harmonious AI (6 agents working in concert)
- **Ryudo** - Dynamic intelligence (flowing understanding)
- **Round** - Iteration of review cycle
- **Rubric** - 5-axis evaluation framework
- **TriHex** - Three-hexagonal knowledge architecture

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo  
**Status:** Design Complete, Ready for Implementation

---

*"From chaos to harmony, one round at a time."*


