# 🔐 Auto-Mode Guide

**Version:** 1.0  
**Purpose:** Commit Message Conventions & Environment Protection

---

## 🚀 Auto-Mode Levels

### LV1: Proofs/Docs (常時オート)

**Trigger:** Push to `99_SYSTEM/Proofs/**` or `docs/**`

**Behavior:**
- Auto-sync & normalize
- Loop prevention: Skip if commit contains `[skip ci]` or starts with `📊 Auto-sync:`
- No environment protection

**Commit message rules:**
```
✅ Normal commit: "Update README.md"
✅ Manual skip: "[skip ci] Update docs"
❌ Bot commit: "📊 Auto-sync: Proofs/Docs normalization [skip ci]"
```

---

### LV2: CI/DB ([deploy] markers)

**Trigger:** Commit message contains `[deploy]` or `[deploy:stg]` or `[deploy:prod]`

**Behavior:**
- Harmonia CI / Supabase Sync / n8n CD triggered
- Secrets check before deployment
- Skip if not configured

**Commit message examples:**
```
[deploy] Update specs
[deploy:stg] Test staging deployment
[deploy:prod] Production release
```

---

### LV3: n8n/LINE (paths限定＋Environment承認)

**Trigger:** 
- Path changes in `workflows/**` + `[deploy]` marker
- Environment protection enforced

**Environment Protection:**
- **staging:** Auto-deploy (no approval)
- **production:** Manual approval required

**Approver:** @trihex-arch

---

## 🔒 Commit Message Conventions

### Auto-Sync Prevention

| Pattern | Effect |
|---------|--------|
| `[skip ci]` | Skip all CI/CD |
| `📊 Auto-sync:` | Bot commit (loop prevention) |
| `[deploy]` | Trigger LV2 deployment |
| `[deploy:stg]` | Deploy to staging |
| `[deploy:prod]` | Deploy to production (requires approval) |

### Examples

```bash
# Normal commit (Proofs auto-sync enabled)
git commit -m "Update project status"

# Skip auto-sync
git commit -m "[skip ci] Debug commit"

# Deploy to staging
git commit -m "Update workflow configuration [deploy:stg]"

# Deploy to production (requires approval)
git commit -m "Release v1.0.0 [deploy:prod]"
```

---

## 🛡️ Environment Protection

### Staging (auto)

**No approval required:**
- Secrets check only
- Auto-deploy if `[deploy:stg]` or `[deploy]`
- Skip if secrets not configured

### Production (manual)

**Approval required:**
- Environment protection enabled
- Approver: @trihex-arch
- Only triggered by `[deploy:prod]`

---

## 📋 Secrets Configuration

### Required Secrets

**Staging:**
- `SUPABASE_URL_STG`
- `SUPABASE_SERVICE_ROLE_KEY_STG`
- `N8N_BASE_URL_STG`
- `N8N_API_KEY_STG`

**Production:**
- `SUPABASE_URL_PROD`
- `SUPABASE_SERVICE_ROLE_KEY_PROD`
- `N8N_BASE_URL_PROD`
- `N8N_API_KEY_PROD`

### Secrets Check Behavior

| Status | Behavior |
|--------|----------|
| ✅ Configured | Deploy |
| ❌ Missing | Skip (no error) |
| ⚠️ Partial | Skip affected jobs |

---

## 🔄 Workflow Summary

| Workflow | LV | Trigger | Environment |
|----------|-----|---------|-------------|
| **proofs_sync.yml** | LV1 | Auto (paths) | None |
| **harmonia-ci.yml** | LV2 | `[deploy]` | None |
| **supabase_sync.yml** | LV2 | `[deploy:stg/prod]` | staging/production |
| **n8n_cd.yml** | LV3 | `[deploy]` + paths | staging/production |

---

## ⚠️ Infinite Loop Prevention

### Bot Commits

All bot commits MUST include `[skip ci]`:

```bash
git commit -m "📊 Auto-sync: Proofs/Docs normalization [skip ci]"
```

### User Commits

Users should NOT use bot patterns:

```bash
❌ git commit -m "📊 Auto-sync: Fix typo"
✅ git commit -m "Fix typo in docs"
```

---

## 🎯 Quick Reference

| Intent | Commit Message |
|--------|----------------|
| Normal update | `Update README.md` |
| Skip CI | `[skip ci] Update docs` |
| Deploy staging | `Update workflow [deploy:stg]` |
| Deploy prod | `Release v1.0 [deploy:prod]` |
| Deploy all | `Major update [deploy]` |

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Purpose:** Auto-mode conventions & safety

