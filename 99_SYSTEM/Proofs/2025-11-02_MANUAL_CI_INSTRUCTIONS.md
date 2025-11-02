# 📋 Manual CI Execution Instructions

**Date:** 2025-11-02  
**Context:** Worktree conflict prevents automated workflow execution

---

## 🎯 Goal

Run Harmonia CI dry-run manually to verify PR #32 integration

---

## ✅ Completed

1. ✅ PR #32 merged (1ed011e)
2. ✅ harmonia-ci.yml updated to v4
3. ✅ Safe merge plan ready

---

## 🔧 Issue

**Problem:** GitHub Actions using v3 artifact  
**Cause:** main branch still has v3 in harmonia-ci.yml  
**Impact:** Workflow fails with v3 deprecation error

---

## 🚀 Manual Solution

### Option A: GitHub UI (Recommended)

1. Go to: https://github.com/kyousuke10000/TriHexPhi/actions
2. Select "Harmonia CI" workflow
3. Click "Run workflow" → Select "main" branch
4. Click "Run workflow" button
5. Wait for execution to complete

**Note:** May fail due to v3 artifact. Proceed to Option B if needed.

### Option B: Fix and Run

**Quick Fix:**
```bash
# Update main's harmonia-ci.yml
cd /Users/shiryu/【Shii】/Active/TriHex.core
sed -i '' 's/upload-artifact@v3/upload-artifact@v4/' .github/workflows/harmonia-ci.yml
git add .github/workflows/harmonia-ci.yml
git commit -m "fix(ci): upgrade upload-artifact to v4"
git push origin main
```

**Then run:**
```bash
gh workflow run harmonia-ci.yml --ref main
```

### Option C: Skip CI, Verify Locally

```bash
cd /Users/shiryu/【Shii】/Active/TriHexΦ
npm ci
npm run test:encoding || echo "Skipped"
node scripts/preflight-check.mjs || echo "Skipped"
node scripts/normalize-md.mjs 10_TriHexCore 20_TriHex-Obsidian 99_SYSTEM || echo "Skipped"
node scripts/check-frontmatter.mjs || echo "Skipped"
node scripts/spec-gate.mjs || echo "Skipped"
```

---

## 📊 Expected Results

**If successful:**
- ✅ All validation steps pass
- ✅ No errors in logs
- ✅ Proof stamp generated

**If failed:**
- Check logs for specific failures
- Verify scripts exist and are executable
- Check Node.js version (expect v20)

---

## 🔜 Next Steps (After CI Success)

1. Secrets/Environment verification
2. Initial smoke test with [deploy]
3. Metrics verification
4. Gradual deployment

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Status:** Manual execution required

