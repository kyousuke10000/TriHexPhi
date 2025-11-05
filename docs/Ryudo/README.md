# Ryudo Router Documentation

**Purpose:** Discussion → Conductor Bridge with Fail-Safe

---

## Architecture

```
Discussion Event
  ↓
ryudo_router.yml (GitHub Actions)
  ↓
router.mjs
  ↓
  ├─ Live Mode → Claude API / n8n
  └─ Demo Mode → TriHex CLI
  ↓
Conductor (6AI orchestration)
  ↓
Round_N.md
```

---

## Modes

### Live Mode

**Requirements:**
- `CLAUDE_API_KEY` or `N8N_RYUDO_INGEST_URL`
- Network access
- API costs

**Features:**
- Real Claude/Gemini/DeepSeek/Grok responses
- Rate limit handling
- Exponential backoff retry

**Fallback:**
- If secrets missing → demo
- If API fails → demo

### Demo Mode

**Requirements:**
- Local `node` execution
- TriHex CLI available
- `OPENAI_API_KEY` (optional, for GPT-5)

**Features:**
- Fast, offline-capable
- Cost-free
- 6AI emulation via TriHex CLI

---

## Usage

### GitHub Actions

**Trigger:**
```yaml
on:
  discussion:
    types: [created, edited]
  workflow_dispatch
```

**Manual Run:**
```bash
gh workflow run ryudo_router.yml -f topic="Your Topic" -f mode="demo"
```

### CLI

```bash
# Demo mode
node scripts/ryudo/router.mjs --mode demo --topic "Review Topic"

# Live mode
CLAUDE_API_KEY=xxx node scripts/ryudo/router.mjs --mode live --topic "Review Topic"
```

---

## Claude Vendor

**File:** `scripts/ryudo/vendors/claude.mjs`

**Features:**
- Exponential backoff (1s, 2s, 4s, 8s)
- Max 5 retries
- 60s timeout
- 429/5xx auto-retry
- UTF-8/NFC normalization
- Logs to `99_SYSTEM/Logs/claude_requests.log`

---

## Secrets

| Secret | Required For | Location |
|--------|--------------|----------|
| `CLAUDE_API_KEY` | Claude live | GitHub Secrets |
| `N8N_RYUDO_INGEST_URL` | n8n live | GitHub Secrets |
| `OPENAI_API_KEY` | GPT-5 demo | GitHub Secrets |

---

## Failure Handling

**Auto Fallback:**
1. Live fails → Demo
2. Demo still fails → Continue with errors logged

**Debug Artifacts:**
- `payload_debug/excerpt.json` - Event payload
- `99_SYSTEM/Logs/ryudo_router_run.log` - Execution log
- `99_SYSTEM/Logs/claude_requests.log` - API calls

---

## Self-Test

**Workflow:** `.github/workflows/ryudo_selftest.yml`

**Manual Run:**
```bash
gh workflow run ryudo_selftest.yml -f mode="demo"
```

**Tests:**
- Demo mode execution
- Live mode (if secrets present)
- Fallback behavior
- Logging output

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** VI Consolidation

---

*"Safe routing. Automatic fallback. Reliable execution."*

