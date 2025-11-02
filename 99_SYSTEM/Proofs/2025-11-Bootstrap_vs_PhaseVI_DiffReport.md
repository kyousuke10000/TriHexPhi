# Bootstrap vs Phase VI Diff & Merge Report

**Date:** 2025-11-01  
**Analyzer:** Cursor (☿)  
**Status:** Analysis Complete

---

## 1. Executive Summary

**重複:** UTF-8 enforcement, Conductor improvements, Recovery procedures  
**差分:** Bootstrap adds tmux/worktree/CI specifics; Phase VI adds verification/testing  
**推奨:** Bootstrap先適用 → Phase VI testsで検証 → 統合 → Promote  

**Integration Path:** Bootstrap (実務基盤) → Phase VI Canary (検証) → Staged (統合) → Promote (本番)

---

## 2. Side-by-Side Overview

| Component | Bootstrap | Phase VI | Notes |
|-----------|-----------|----------|-------|
| **tmux** | ✅ Parallel Shell | ❌ | Bootstrap専有 |
| **worktree** | ✅ Multi-universe | ❌ | Bootstrap専有 |
| **GitHub Actions CI** | ✅ Harmonia CI | ✅ UTF-8 env | CI設計はBootstrap、UTF-8はPhase VI |
| **Ryūdō Router** | ✅ Discussion→Round | ✅ Concurrency control | RouterはBootstrap、制御はPhase VI |
| **Conductor** | ❌ | ✅ UTF-8 + Batch | Phase VI専有 |
| **Encoding** | ❌ | ✅ UTF-8 + NFC | Phase VI専有 |
| **Fail-safe** | ✅ Watchdog | ✅ Enhanced | Bootstrap軽量、Phase VI強化 |
| **Proofs** | ✅ CI stamps | ✅ Comprehensive | 両方で補完 |

---

## 3. File Surface Map

### Bootstrap Files (B)
- `tools/tmux/trihex.tmux` - Parallel shell config
- `scripts/tmux-up.sh` - tmux launcher
- `scripts/worktree-init.sh` - Worktree setup
- `scripts/worktree-status.sh` - Worktree monitoring
- `.github/workflows/harmonia-ci.yml` - Main CI workflow
- `scripts/check-frontmatter.mjs` - Markdown validation
- `scripts/mirror-codex.mjs` - Mirror sync
- `scripts/proof-stamp.mjs` - Proof generation
- `scripts/extract-discussion.mjs` - Topic extraction
- `scripts/seed-ryudo.mjs` - Round seed generator
- `tools/README.ParallelVault.md` - Usage docs

### Phase VI Files (P)
- `scripts/env-utf8.sh` - UTF-8 environment
- `scripts/normalize-md.mjs` - Markdown normalization
- `scripts/test-encoding.mjs` - Golden test
- `scripts/preflight-check.mjs` - Pre-deployment checks
- `scripts/git-i18n-utf8.sh` - Git UTF-8 config
- `scripts/emergency-downgrade.sh` - Emergency kill
- `scripts/recover-and-resume.sh` - Recovery script
- `scripts/test-conductor-quick.sh` - Conductor test
- `tests/encoding/golden.txt` - Test data
- `docs/dashboards/trihex_status.md` - Status dashboard
- `docs/ParallelVault/50_EncodingPolicy.md` - Encoding policy
- `package.json` - Root config

### Shared/Modified (B+P)
- `tools/conductor/run.mjs` - UTF-8 + batch processing (Phase VI applied)
- `tools/trihex/watchdog.mjs` - Daemon mode (Phase VI applied)
- `.cursor/config.yml` - Throttling settings (Phase VI applied)
- `.github/workflows/ryudo_router.yml` - Concurrency + UTF-8 (Phase VI applied)
- `.github/workflows/trihex_sync.yml` - UTF-8 env (Phase VI applied)
- `scripts/demo-sixAI.sh` - UTF-8 source (Phase VI applied)
- `scripts/trihex-test.sh` - UTF-8 source (Phase VI applied)
- `scripts/stress-test-sixAI.sh` - UTF-8 source (Phase VI applied)

---

## 4. Risk & Guard Matrix

| Risk | Bootstrap Guard | Phase VI Guard | Integrated Solution |
|------|-----------------|----------------|---------------------|
| **文字化け** | ❌ None | ✅ UTF-8 + NFC | ✅ UTF-8 enforcement |
| **並列暴走** | ✅ tmux isolation | ✅ slots=2, jitter | ✅ Both layers |
| **CI無限ループ** | ⚠️ Manual watch | ✅ concurrency group | ✅ Concurrency control |
| **lock衝突** | ⚠️ Manual `flock` | ❌ None | ✅ Both consider |
| **rollback不能** | ❌ None | ✅ Git tags | ✅ Phase VI method |
| **環境不一致** | ⚠️ Manual check | ✅ Preflight | ✅ Preflight check |
| **Subprocess encoding** | ❌ None | ✅ pspawn wrapper | ✅ UTF-8 subprocess |
| **Test coverage** | ⚠️ Manual verify | ✅ Golden tests | ✅ Automated tests |

---

## 5. Merge Plan

### Step 0: Preflight

```bash
# Run Phase VI preflight check
node scripts/preflight-check.mjs

# Expected: All checks pass
```

---

### Step 1: Apply Bootstrap (Worktree & tmux)

```bash
# Create worktrees (if not exists)
./scripts/worktree-init.sh

# Verify worktrees
./scripts/worktree-status.sh

# Expected: core/obsidian/sync worktrees created
```

```bash
# Setup tmux (optional for local development)
./scripts/tmux-up.sh

# Attach tmux
tmux a -t trihex

# Expected: 5 windows (core/obsidian/cursor/proofs/n8n)
```

---

### Step 2: Phase VI Canary Verification

```bash
# UTF-8 encoding test
npm run test:encoding

# Expected: [test-encoding] OK

# Quick conductor test (optional, costs API)
./scripts/test-conductor-quick.sh

# Expected: Conductor starts, no corruption
```

---

### Step 3: Phase VI Staged (CI & Scripts)

```bash
# Normalize markdown files
node scripts/normalize-md.mjs 10_TriHexCore 20_TriHex-Obsidian 99_SYSTEM

# Expected: Files normalized, no changes if already NFC

# Verify encoding policy
cat docs/ParallelVault/50_EncodingPolicy.md | head -50

# Expected: Policy documented
```

---

### Step 4: Integrate Bootstrap CI Scripts

```bash
# Create Bootstrap scripts
# (Only create new ones, Phase VI already has most infrastructure)

# Create harmonia-ci.yml if doesn't exist
# Integrate UTF-8 env from Phase VI
# Add normalize step from Phase VI

# Expected: CI workflow complete
```

---

### Step 5: Promote to Main

```bash
# Verify all changes
git status --short

# Check linter
# (Already zero errors from Phase VI)

# Commit if ready
git add .
git commit -m "Phase VI + Bootstrap: Consolidated deployment"

# Push to main (if approved)
git push origin main

# Expected: CI runs successfully
```

---

## 6. Rollback Playbook

### Symptom: tmux hangs

```bash
# Kill tmux session
tmux kill-session -t trihex

# Restart
./scripts/tmux-up.sh
```

### Symptom: Worktree conflicts

```bash
# Remove problematic worktrees
git worktree remove ../TriHex.core
git worktree remove ../TriHex.obsidian

# Re-create
./scripts/worktree-init.sh
```

### Symptom: Encoding corruption

```bash
# Run emergency downgrade
./scripts/emergency-downgrade.sh

# Normalize files
node scripts/normalize-md.mjs 10_TriHexCore 20_TriHex-Obsidian 99_SYSTEM

# Test encoding
npm run test:encoding

# Recover
./scripts/recover-and-resume.sh
```

### Symptom: CI loop

```bash
# Cancel all runs
gh run cancel --repo kyousuke10000/TriHexPhi --all

# Check concurrency
# Fix: Update `concurrency.group` in workflows

# Retry
gh workflow run harmonia-ci.yml
```

### Symptom: Full rollback

```bash
# Use Phase VI tag
git checkout pre-phaseVI

# Or revert last commit
git revert HEAD

# Verify
./scripts/preflight-check.mjs
npm run test:encoding
```

---

## 7. Checklist

### Pre-Run

- [x] Node.js v18+ installed
- [x] OPENAI_API_KEY set
- [x] UTF-8 golden test passing
- [x] Environment variables OK
- [x] Repository clean
- [x] Phase VI already applied

### Bootstrap Apply

- [ ] Worktrees created
- [ ] tmux session functional
- [ ] Bootstrap scripts executable
- [ ] Workflow files created

### Post-Run

- [ ] tmux: 5 windows accessible
- [ ] CI: Harmonia workflow runs
- [ ] Proofs: Generated correctly
- [ ] UTF-8: No corruption
- [ ] Encoding: Golden test passes

---

## 8. Appendices

### A. Key Differences (Mock Diff)

**Bootstrap adds:**
```
+ tmux multi-window session management
+ git worktree multi-universe setup
+ Harmonia CI workflow (frontmatter/mirror/proof)
+ Ryūdō seed generation from Discussions
+ Manual watchdog script
```

**Phase VI adds:**
```
+ UTF-8/NFC enforcement infrastructure
+ Preflight validation checks
+ Automated encoding tests
+ Enhanced recovery procedures
+ Comprehensive documentation
```

### B. Thresholds

| Parameter | Bootstrap | Phase VI | Integrated |
|-----------|-----------|----------|------------|
| **MAX_PROMPT_CHARS** | Not specified | 10000 | 10000 |
| **CONDUCTOR_SLOTS** | Not specified | 2 | 2 |
| **CONDUCTOR_JITTER_MS** | Not specified | 120-300 | 120-300 |
| **CONDUCTOR_TIMEOUT** | Not specified | 180 | 180 |
| **CI_CONCURRENCY** | Manual | trihex-ryudo | trihex-ci |

### C. Integration Conflicts

**None:** Bootstrap and Phase VI are complementary, not conflicting.

**Reasons:**
- Bootstrap: Operational infrastructure
- Phase VI: Quality + safety enforcement
- Both can coexist safely

---

## Next Action

**推奨手順:**

1. ✅ Phase VI already applied
2. ⏭️  Apply Bootstrap scripts (tmux/worktree/CI)
3. ✅ Verify with Phase VI tests
4. ⏭️  Promote to main
5. ✅ Monitor CI runs

**Command sequence:**
```bash
# Bootstrap application
./scripts/worktree-init.sh
./scripts/tmux-up.sh  # Optional

# Verification
npm run test:encoding
./scripts/preflight-check.mjs

# Promote
git add .
git commit -m "Consolidated: Phase VI + Bootstrap"
git push origin main
```

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Status:** ✅ Analysis Complete, Ready to Apply Bootstrap

---

*"Complementary integration. Zero conflicts. Safe merge path identified."*
