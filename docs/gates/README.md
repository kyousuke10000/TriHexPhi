# Gatekeeper Trio - PR Gates

**Purpose:** 3-layer automated quality gates for all PRs  
**Owner:** Cursor (☿) with shiryu final approval

---

## Overview

Three gates validate every PR:
1. **Ethics Gate** - Safety & compliance
2. **Protocol13 Gate** - Article 13 adherence
3. **CHI Gate** - Consciousness harmony check

---

## 1️⃣ Ethics Gate

**File:** `.github/workflows/ethics-gate.yml`  
**Script:** `scripts/ethics_gate.mjs`

**Checks:**
1. No PII exposure (keys, emails, addresses)
2. No unsafe eval/dynamic imports
3. No unauthorized external API calls
4. No file system writes outside allowed paths
5. No unencrypted passwords/secrets
6. No broken symlinks
7. No binary size > 10MB

**Result:** 7/7 PASS → Gate opens

---

## 2️⃣ Protocol13 Gate

**File:** `.github/workflows/protocol13-gate.yml`  
**Script:** `scripts/protocol13_gate.mjs`

**Checks:**
1. Silence Zero - Every question answered
2. No "I don't know" responses
3. Expertise check - Cross-domain review
4. Consensus threshold - 6AI + shiryu

**Result:** All PASS → Gate opens

---

## 3️⃣ CHI Gate

**File:** `.github/workflows/chi-measure.yml`  
**Script:** `scripts/chi_measure.mjs`

**Check:**
- CHI ≥ 0.92 (resonance threshold)

**Calculation:**
```
CHI = (direction_alignment × 0.4) +
      (resonance_level × 0.3) +
      (entropy_inverse × 0.3)
```

**Result:** CHI ≥ 0.92 → Gate opens

---

## Workflow

```
PR Created
  ↓
Ethics Gate (7 checks)
  ↓ [PASS]
Protocol13 Gate (4 checks)
  ↓ [PASS]
CHI Gate (0.92 threshold)
  ↓ [PASS]
shiryu Approval Click
  ↓
Auto-merge
```

---

**Generated:** 2025-11-02 / Cursor (☿)


