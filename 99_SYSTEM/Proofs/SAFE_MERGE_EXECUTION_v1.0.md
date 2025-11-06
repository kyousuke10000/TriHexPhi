# 🔐 Safe Merge Execution Plan v1.0

**Date:** 2025-11-02  
**PR:** #32 (feature/spec-as-code-v1)  
**Status:** MERGE_READY → Execution Phase

---

## 📋 Execution Checklist

### 1️⃣ PR Merge ([skip ci] で自動停止)

**Action:** GitHub → PR #32 "Squash and merge"  
**Message:** `feat(spec): Spec-as-Code v1.0 + Breath Blueprint + HOC-001 [skip ci]`

**Expected:**
- ✅ All files merged to main
- ✅ No auto-execution triggered ([skip ci])
- ✅ Clean history (squash)

---

### 2️⃣ Dry-run Manual CI

**Actions → Run workflow:**
- ✅ Harmonia CI (branch: main)
  - Expected: Spec Gate PASS, validation OK
- ✅ Proofs Sync (branch: main)
  - Expected: No auto-commit (already up to date)

---

### 3️⃣ Secrets/Environment Check

**GitHub Settings → Secrets and variables → Actions**

**Required:**
- STG: SUPABASE_URL_STG / SUPABASE_KEY_STG
- PROD: SUPABASE_URL_PROD / SUPABASE_KEY_PROD
- (Optional) LINE_* / N8N_*

**Environments:**
- ✅ stg: No approval required
- ✅ prod: Manual approval enabled

---

### 4️⃣ Initial Smoke Test (READ-only)

**Commit:**
```
chore(release): READ smoke test for Shinsen [deploy]
```

**Expected:**
- ✅ Shinsen Push runs
- ✅ Supabase connection OK
- ✅ No writes (READ-only test)

---

### 5️⃣ Metrics Verification

**Check Proofs:**
- ✅ SPEC_AS_CODE_v1.0_COMPLETE.md
- ✅ BREATH_BLUEPRINT_v1.md
- ✅ HOC_AIOBSERVER_INTEGRATION_v1.md
- ✅ MERGE_READY_2025-11-02.md

**Check Actions:**
- ✅ Spec Gate: PASS
- ✅ No errors in logs

---

### 6️⃣ Gradual Deployment

**WRITE解放:**
```
feat(shinsen): enable write pipeline [deploy][shinsen]
```

**n8n配備:**
```
feat(n8n): deploy KYOEN routes to stg [deploy][n8n]
```

**LINE Push (最後):**
```
feat(line): enable prod push [deploy][line][env:prod]
```

---

## 🧯 Rollback Plan

**If issues:**
```bash
# Option 1: GitHub Revert
# PR #32 → Revert pull request

# Option 2: Tag rollback
git checkout pre_phase_vi_2025-11-02
git push origin main --force-with-lease
```

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Status:** Execution Plan

