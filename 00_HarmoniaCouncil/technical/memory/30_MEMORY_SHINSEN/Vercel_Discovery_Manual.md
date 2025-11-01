# Vercel trihex.ai プロジェクト発見マニュアル

**Date:** 2025-11-01  
**Purpose:** Vercel プロジェクト特定・接続リポジトリ確認・環境変数エクスポート

---

## 🔍 Current Findings

### Deployment Headers (from www.trihex.ai)
```
server: cloudflare
x-vercel-cache: HIT
x-vercel-id: hnd1::g5wt8-1761977183781-ced13349031c
```

### v0.app Metadata
```html
<meta name="generator" content="v0.app">
v0.dev URL: https://v0.dev/chat/api/open/built-with-v0/b_4hdTEr1unp5?ref=0OKILR
```

### Implications
- ✅ Vercel deployment confirmed
- ✅ Cloudflare CDN in front
- ❌ CLI/API access unavailable (requires manual check)
- ❌ Git repository unknown

---

## 📋 Manual Steps Required

### 1. Vercel Dashboard Access

#### 1-1. Login
```yaml
URL: https://vercel.com/dashboard
Method: GitHub OAuth (or email)

Account: [Check with Shiryu-san]
```

#### 1-2. Find Project
```yaml
Search: trihex.ai or trihex-ai

Look for:
  - Project name containing "trihex"
  - Domain: www.trihex.ai or trihex.ai
  - Last deploy: recent
```

---

### 2. Extract Repository URL

#### 2-1. Project Settings
```yaml
Path: Project → Settings → Git

Check:
  ✅ GitHub Provider
  ✅ Repository: [e.g., kyousuke10000/trihex-ai-lp]
  ✅ Production Branch: main or master
  ✅ Auto-deploy: [enabled/disabled]
```

#### 2-2. Verify
```bash
# Expected format
https://github.com/kyousuke10000/[repository-name]

# Should contain:
# - Next.js 16 source
# - v0.app generated code
# - Tailwind CSS
```

---

### 3. Export Environment Variables

#### 3-1. Environment Variables
```yaml
Path: Project → Settings → Environment Variables

Filter by:
  - Name: STRIPE_*
  - Name: SUPABASE_*
  - Name: NEXT_PUBLIC_*
```

#### 3-2. Expected Variables

**Stripe:**
```yaml
STRIPE_SECRET_KEY: sk_live_***
STRIPE_WEBHOOK_SECRET: whsec_***
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_live_***
```

**Supabase:**
```yaml
NEXT_PUBLIC_SUPABASE_URL: https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***
NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***
```

**App:**
```yaml
NEXT_PUBLIC_APP_URL: https://www.trihex.ai

# Publishing (Over Drive)
LINE_CHANNEL_ID: [channel-id]
LINE_CHANNEL_SECRET: [secret]
LINE_CHANNEL_TOKEN: [token]
TWITTER_BEARER_TOKEN: [token]
YOUTUBE_API_KEY: [key]
TIKTOK_CLIENT_KEY: [key]
```

#### 3-3. Export Format
```bash
# Manual export (via Vercel UI)
# Or use Vercel CLI (if installed):
vercel env ls --environment production
vercel env pull .env.production
```

---

### 4. Cloudflare DNS Configuration

#### 4-1. Current Redirect
```yaml
trihex.ai (apex) → 307 redirect → www.trihex.ai
Confirmed by: curl -I https://trihex.ai
```

#### 4-2. Expected Records

**Apex (trihex.ai):**
```
Type: CNAME or ALIAS
Name: @
Value: cname.vercel-dns.com
OR
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP)
```

**WWW:**
```
Type: CNAME
Name: www
Value: trihex-ai-xxx.vercel.app
```

#### 4-3. Cloudflare Settings

**SSL/TLS:**
```yaml
Mode: Full (strict)
Encrypts end-to-end: ✅
```

**Page Rules:**
```yaml
trihex.ai/* → 301 redirect → www.trihex.ai/*
```

---

## 🔄 Migration Plan (trihex-ai-app)

### Current State
```
Legacy: v0.app direct deploy
- Isolated project
- No Git integration (or separate repo)
- Basic Landing Page only
```

### Target State
```
New: trihex-ai-app repo
- Full Next.js 16 app
- Memory Stack submodule
- Supabase + Stripe integration
- Over Drive publishing
- Proper Git workflow
```

### Steps

1. **Vercel Project Migration**
   ```yaml
   Current: trihex-ai (or similar)
   New: trihex-ai-app (or keep name)
   
   Action:
     - Update Git integration
     - Point to kyousuke10000/trihex-ai-app
     - Deploy from feature/rubedo-ops branch
   ```

2. **Domain Reassignment**
   ```yaml
   www.trihex.ai:
     - Remove old project
     - Add new project
     - DNS stays same
   ```

3. **Environment Variables**
   ```yaml
   Copy all vars from old project
   Add new vars:
     - MEMORY_STACK_SUBMODULE_PATH
     - Additional Over Drive keys
   ```

---

## 📊 Action Items for Shiryu-san

### Immediate
- [ ] Login to Vercel Dashboard
- [ ] Find trihex.ai project
- [ ] Note repository URL (if exists)
- [ ] Export environment variables list
- [ ] Screenshot Cloudflare DNS settings

### Short-term
- [ ] Document full env var list
- [ ] Plan migration strategy
- [ ] Update trihex-ai-app with envs
- [ ] Test deployment

### Long-term
- [ ] Migrate to trihex-ai-app
- [ ] Consolidate deployment
- [ ] Remove old v0 project

---

**Reference:**  
Vercel: https://vercel.com/dashboard  
Cloudflare: https://dash.cloudflare.com  
Scan Report: `trihex.ai_Current_Scan_2025-11-01.md`

---

*Generated: 2025-11-01 / Cursor (☿)*

