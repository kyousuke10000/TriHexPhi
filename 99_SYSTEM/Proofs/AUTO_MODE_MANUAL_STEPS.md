# 🔐 Auto-Mode v1 Go-Live: Manual Steps

**Date:** 2025-11-02  
**PR:** https://github.com/kyousuke10000/TriHexPhi/pull/31  
**Status:** ⏳ Manual Merge Required

---

## ⚠️ Automatic Merge Failed

**Reason:** Git worktree conflict (main already checked out in /Users/shiryu/【Shii】/Active/TriHex.core)

**Action:** Manual merge via GitHub UI required

---

## 📋 Manual Steps

### Step 1: Merge PR #31

**Via GitHub Web UI:**
1. Open: https://github.com/kyousuke10000/TriHexPhi/pull/31
2. Click "Merge pull request"
3. Confirm merge
4. Optionally delete branch

**Command (if worktree conflict resolved):**
```bash
gh pr merge 31 --merge --delete-branch
```

---

### Step 2: Configure Environments & Secrets

#### A. GitHub Environment: production

**Settings → Environments → New environment → production**

**Configuration:**
```
Environment name: production
Required reviewers: @trihex-arch
Deployment branches: Only main branch
```

#### B. GitHub Secrets: staging

**Settings → Secrets and variables → Actions → New repository secret**

**Add:**
```
SUPABASE_URL_STG=<your-staging-url>
SUPABASE_ANON_KEY_STG=<your-staging-key>
N8N_BASE_URL_STG=<optional>
N8N_API_KEY_STG=<optional>
```

#### C. GitHub Secrets: production

**Settings → Secrets and variables → Actions → New repository secret**

**Add (optional):**
```
SUPABASE_URL_PROD=<your-prod-url>
SUPABASE_ANON_KEY_PROD=<your-prod-key>
N8N_BASE_URL_PROD=<optional>
N8N_API_KEY_PROD=<optional>
```

---

### Step 3-5: Testing

**After merge + environment setup, run:**

#### 3a) LV1 Test: Proofs Auto-Sync

```bash
git checkout main
git pull origin main

# Update docs
echo "" >> docs/auto-mode-guide.md
echo "<!-- LV1 test -->" >> docs/auto-mode-guide.md

git add docs/auto-mode-guide.md
git commit -m "test: LV1 proofs auto-sync"
git push origin main

# Wait for: .github/workflows/proofs_sync.yml to run
# Check: GitHub Actions → Proofs Auto-Sync → Run ID
```

**Expected:** Bot commit with `[skip ci]` generated

---

#### 3b) LV2 Test: Staging Deployment

```bash
# Small change
echo "" >> README.md
echo "<!-- LV2 test -->" >> README.md

git add README.md
git commit -m "chore: kyoen line-bot runbook tiny fix [deploy:stg]"
git push origin main

# Wait for: n8n_cd.yml / supabase_sync.yml staging jobs
# Check: GitHub Actions → Run IDs
```

**Expected:** Staging jobs execute, skip if secrets not configured

---

#### 3c) LV3 Test: Production Gate

```bash
# Small change
echo "" >> README.md
echo "<!-- LV3 test -->" >> README.md

git add README.md
git commit -m "ops: prod gate check [deploy:prod]"
git push origin main

# Wait for: Approval gate to appear
# DO NOT approve, just verify gate appears
```

**Expected:** Approval request appears in GitHub Actions UI

---

### Step 4: Generate Reports

**After each test completes, record run IDs:**

```bash
# Create report files
cat > 99_SYSTEM/Proofs/PROOFS_SYNC_OK_$(date +%Y%m%d_%H%M%S).md << EOF
# LV1: Proofs Sync OK

**Date:** $(date)
**Run ID:** <from GitHub Actions>
**Status:** ✅ Success
**Bot Commit:** Generated with [skip ci]
EOF

cat > 99_SYSTEM/Proofs/DEPLOY_STG_OK_$(date +%Y%m%d_%H%M%S).md << EOF
# LV2: Staging Deploy OK

**Date:** $(date)
**Run ID:** <from GitHub Actions>
**Status:** ✅ Success / ⚠️ Skipped (secrets)
**Staging Jobs:** n8n_cd / supabase_sync
EOF

cat > 99_SYSTEM/Proofs/PROD_GATE_OK_$(date +%Y%m%d_%H%M%S).md << EOF
# LV3: Production Gate OK

**Date:** $(date)
**Run ID:** <from GitHub Actions>
**Status:** ✅ Gate appeared (not approved)
**Approval:** Requested but not granted
EOF
```

---

### Step 5: Update Dashboard

```bash
# Edit docs/dashboards/overview.md
# Add "Auto-Mode Status" badge section
```

---

## 🎯 Acceptance Criteria

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| **LV1** | Bot commit with [skip ci] | ⏳ Pending | ⏳ |
| **LV2** | Staging jobs execute | ⏳ Pending | ⏳ |
| **LV3** | Approval gate appears | ⏳ Pending | ⏳ |
| **Reports** | 3 files generated | ⏳ Pending | ⏳ |
| **Dashboard** | Badge added | ⏳ Pending | ⏳ |

---

**Generated:** 2025-11-02T15:00:00Z / Cursor (☿)  
**Status:** Manual steps required due to worktree conflict

<<<<<<< HEAD

=======
>>>>>>> origin/main
