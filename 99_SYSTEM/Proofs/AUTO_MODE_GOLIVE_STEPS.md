# 🔐 Auto-Mode v1 Go-Live Steps

**Date:** 2025-11-02  
**PR:** https://github.com/kyousuke10000/TriHexPhi/pull/31  
**Status:** 🟡 In Progress

---

## ✅ Step 1: PR作成→マージ

**Done:**
- ✅ PR #31 作成済み
- ⏳ マージ待ち（レビュー2件必須）

**URL:** https://github.com/kyousuke10000/TriHexPhi/pull/31

---

## ⏳ Step 2: 環境ガード確認（手動）

**Required Actions:**

### A. GitHub Environment: prod

```
Settings → Environments → production
→ Required reviewers: @trihex-arch (追加)
→ Deployment branches: main のみ
```

### B. GitHub Secrets: stg

```
Settings → Secrets and variables → Actions
→ New repository secret

Required:
- SUPABASE_URL_STG
- SUPABASE_ANON_KEY_STG
- N8N_BASE_URL_STG (optional)
- N8N_API_KEY_STG (optional)
```

### C. GitHub Secrets: prod

```
Settings → Secrets and variables → Actions
→ New repository secret

Required:
- SUPABASE_URL_PROD (optional)
- SUPABASE_ANON_KEY_PROD (optional)
- N8N_BASE_URL_PROD (optional)
- N8N_API_KEY_PROD (optional)
```

**Status:** ⏳ ユーザー操作待ち

---

## ⏳ Step 3-6: テスト実行（マージ後）

**Dependencies:**
- ✅ PR #31 マージ完了
- ⏳ Environment/Secrets 設定完了

**Steps:**
- 3. LV1動作確認 → Proofs auto-sync
- 4. LV2/LV3 stg配備 → [deploy:stg]
- 5. 本番ゲート確認 → [deploy:prod]
- 6. レポート更新 → ダッシュボード反映

---

**Generated:** 2025-11-02T14:30:00Z / Cursor (☿)  
**Status:** Waiting for PR merge + environment setup


