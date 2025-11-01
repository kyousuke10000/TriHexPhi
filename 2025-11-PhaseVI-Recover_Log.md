# Phase VI Recovery Log

**Purpose:** Emergency recovery procedures for Phase VI consolidation  
**Last Updated:** 2025-11-01  
**Status:** ✅ Ready

---

## Quick Recovery

### Level 1: Simple Revert

```bash
# Revert specific files
git checkout HEAD -- scripts/test-conductor-quick.sh
git checkout HEAD -- .github/workflows/ryudo_router.yml

# Test
npm run test:encoding
```

### Level 2: Tag Restore

```bash
# If tagged
git checkout pre-phaseVI

# Or revert last commit
git revert HEAD

# Verify
./scripts/preflight-check.mjs
```

### Level 3: Full Emergency

```bash
# Run emergency downgrade
./scripts/emergency-downgrade.sh

# Wait
sleep 30

# Recover
./scripts/recover-and-resume.sh

# Normalize files
node scripts/normalize-md.mjs 10_TriHexCore 20_TriHex-Obsidian 99_SYSTEM
```

---

## Recovery Procedures

### A. Encoding Issues

**Symptoms:**
- Character corruption in outputs
- Japanese text garbled
- BOM detected

**Fix:**
```bash
# Normalize all markdown
node scripts/normalize-md.mjs 10_TriHexCore 20_TriHex-Obsidian 99_SYSTEM

# Verify
npm run test:encoding
```

### B. Conductor Issues

**Symptoms:**
- Conductor hangs
- No output generated
- Process errors

**Fix:**
```bash
# Kill processes
killall -9 node

# Clean temp
rm -f /tmp/trihex_*

# Test
./scripts/test-conductor-quick.sh
```

### C. Workflow Issues

**Symptoms:**
- CI/CD failing
- Concurrent runs
- Rate limits

**Fix:**
```bash
# Cancel all runs
gh run cancel --repo kyousuke10000/TriHexPhi --all

# Wait
sleep 60

# Retry
gh workflow run ryudo_router.yml
```

---

## Log Analysis

### Common Errors

**Encoding Error:**
```
❌ UTF-8: Golden test failed
```
→ Run: `npm run test:encoding`

**Permission Error:**
```
❌ Permissions: FAILED
```
→ Check: `chmod +x scripts/*.sh`

**Secret Missing:**
```
❌ Required secrets: OPENAI_API_KEY
```
→ Set: `export OPENAI_API_KEY="sk-..."`

---

## Verification

After recovery:

```bash
# Run full checks
./scripts/preflight-check.mjs
npm run test:encoding
./scripts/test-conductor-quick.sh

# Check logs
ls -lh 99_SYSTEM/Logs/
tail -50 99_SYSTEM/Logs/ai_heartbeat.log
```

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Status:** ✅ Recovery Procedures Ready

---

*"When things break, we recover. Fast."*
