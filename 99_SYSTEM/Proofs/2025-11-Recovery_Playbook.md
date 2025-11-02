# TriHex Recovery Playbook

**Date:** 2025-11-01  
**Phase:** Phase V Aurum  
**Author:** Cursor (☿)  
**Status:** 🛟 Emergency Procedures

---

## Executive Summary

**Purpose:** Quick recovery from hangs, loops, or runaway AI processes  
**Scope:** Watchdog, Conductor, CLI, and integration failures  
**Response Time:** < 30 seconds

---

## 🚨 Immediate Actions

### 1. Kill Runaway Processes

```bash
# Kill all Node processes (nuclear option)
killall -9 node

# Or selectively kill TriHex processes
ps aux | grep -E "conductor|trihex|watchdog" | grep -v grep | awk '{print $2}' | xargs kill -9
```

**When to use:**
- System completely frozen
- CPU at 100%
- No response to Ctrl+C

---

### 2. Check Active Processes

```bash
# Check what's running
ps aux | grep -E "conductor|trihex|watchdog" | grep -v grep

# Check log files
ls -lht 99_SYSTEM/Logs/*.log | head -10
tail -50 99_SYSTEM/Logs/ai_heartbeat.log
tail -50 99_SYSTEM/Logs/ai_errors.log
```

---

## 🔧 Specific Recovery Procedures

### A. Conductor Hang

**Symptoms:**
- Round file not generated
- Processes stuck in background
- No completion message

**Fix:**
```bash
# 1. Kill Conductor
killall -9 -f "conductor/run.mjs"

# 2. Clean temp files
rm -f /tmp/trihex_prompt_*.txt

# 3. Check session dir
ls -lh 20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/

# 4. Retry with timeout
(export OPENAI_API_KEY="..."; node tools/conductor/run.mjs --topic "Test" --mode=demo) &
sleep 30
pkill -f "conductor/run.mjs"
```

---

### B. TriHex CLI Loop

**Symptoms:**
- Endless output
- Same response repeated
- No stdin prompt

**Fix:**
```bash
# 1. Kill TriHex CLI
killall -9 -f "trihex.mjs"

# 2. Clear process cache
ps aux | grep node | grep -v grep

# 3. Test CLI manually
echo "test" | node tools/trihex/trihex.mjs --exec "test prompt"
```

---

### C. Watchdog Blocking

**Symptoms:**
- Watchdog won't exit
- Can't restart services
- Stdin blocked

**Fix:**
```bash
# 1. Force kill watchdog
killall -9 watchdog.mjs

# 2. Check for stuck processes
ps aux | grep watchdog

# 3. Restart with daemon mode
node tools/trihex/watchdog.mjs &

# 4. Verify heartbeat
tail -f 99_SYSTEM/Logs/ai_heartbeat.log
```

---

### D. GitHub Actions Stuck

**Symptoms:**
- Workflow running forever
- Multiple concurrent runs
- Rate limit errors

**Fix:**
```bash
# 1. Cancel all workflows
gh run cancel --repo kyousuke10000/TriHexPhi --all

# 2. Check active runs
gh run list --repo kyousuke10000/TriHexPhi --status in_progress

# 3. Wait for rate limit
sleep 60

# 4. Retry if needed
gh workflow run trihex_sync.yml --repo kyousuke10000/TriHexPhi
```

---

## 🔬 Diagnostic Commands

### Process Health Check

```bash
#!/bin/bash
echo "=== Process Status ==="
ps aux | grep -E "conductor|trihex|watchdog" | grep -v grep

echo ""
echo "=== Log Files ==="
find 99_SYSTEM/Logs -name "*.log" -mmin -10

echo ""
echo "=== Temp Files ==="
ls -lh /tmp/trihex_* 2>/dev/null || echo "No temp files"

echo ""
echo "=== Recent Outputs ==="
ls -lht 20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/*.md | head -5

echo ""
echo "=== System Resources ==="
top -l 1 | grep -E "CPU usage|PhysMem"
```

---

### API Key Verification

```bash
# Check if API keys are set
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:+SET (length: ${#OPENAI_API_KEY})}"
echo "CLAUDE_API_KEY: ${CLAUDE_API_KEY:+SET}"
echo "GEMINI_API_KEY: ${GEMINI_API_KEY:+SET}"

# Test API connectivity
node -e "console.log('OpenAI:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET')"
```

---

## 📊 Common Issues & Solutions

### Issue 1: "Command not found: timeout"

**Cause:** macOS doesn't have `timeout` by default  
**Fix:** Use `gtimeout` (via Homebrew) or manual kill

```bash
brew install coreutils
gtimeout 30 command
# OR
(command &) && sleep 30 && kill $!
```

---

### Issue 2: "Text encoding errors"

**Cause:** Multi-line prompts passed as single arg  
**Fix:** Use temp file (already in code)

```bash
# Verify temp file cleanup
ls -lh /tmp/trihex_prompt_*
# If stuck, manually clean
rm -f /tmp/trihex_prompt_*
```

---

### Issue 3: "Infinite retry loop"

**Cause:** Watchdog auto-restart on failure  
**Fix:** Disable auto-restart temporarily

```bash
# Edit watchdog.mjs line 101
# Comment out: setTimeout(() => startAI(aiName, command, args), 3000);

# Or use emergency downgrade
node tools/trihex/watchdog.mjs :emergency-downgrade
```

---

### Issue 4: "Concurrent file writes"

**Cause:** Multiple processes writing same file  
**Fix:** Use `flock` (already implemented in scripts)

```bash
# Manual lock test
flock -n /tmp/trihex.lock echo "Lock acquired"
# If fails, another process has lock
ps aux | grep -E "flock.*trihex"
```

---

## 🛟 Emergency Scripts

### emergency-downgrade.sh

```bash
#!/usr/bin/env bash
# Kills all AI processes and enters safe mode

echo "🚨 Emergency Downgrade Initiated"
echo ""

# Kill all processes
killall -9 -f "trihex.mjs"
killall -9 -f "conductor/run.mjs"
killall -9 -f "watchdog.mjs"

# Clean temp files
rm -f /tmp/trihex_*

# Log state
echo "$(date): Emergency downgrade executed" >> 99_SYSTEM/Logs/emergency.log

echo "✅ System in safe mode"
echo "   - All AI processes killed"
echo "   - Temp files cleaned"
echo "   - Logs preserved"
```

---

### recover-and-resume.sh

```bash
#!/usr/bin/env bash
# Restarts system after emergency downgrade

echo "🔄 Recovery Sequence Initiated"
echo ""

# Check API keys
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  OPENAI_API_KEY not set"
  exit 1
fi

# Restart watchdog
node tools/trihex/watchdog.mjs > 99_SYSTEM/Logs/watchdog_restart.log 2>&1 &
echo "✅ Watchdog restarted (PID: $!)"

# Wait for stabilization
sleep 5

# Verify heartbeat
if [ -f "99_SYSTEM/Logs/ai_heartbeat.log" ]; then
  echo "✅ Heartbeat log active"
else
  echo "⚠️  No heartbeat log yet"
fi

echo "✅ Recovery complete"
echo "   System ready for manual operations"
```

---

## 📝 Post-Recovery Checklist

After any emergency:

- [ ] Verify no stuck processes
- [ ] Check log files for errors
- [ ] Confirm API connectivity
- [ ] Test CLI manually
- [ ] Review recent outputs
- [ ] Update failure log
- [ ] Document root cause
- [ ] Implement preventive fix

---

## 🔗 Related Documents

- [FailSafe Validation](./2025-11-FailSafe_Validation.md)
- [Conductor Run Report](./2025-11-Conductor_Run.md)
- [Watchdog Configuration](../../tools/trihex/watchdog.mjs)
- [Conductor README](../../tools/conductor/README.md)

---

## 📞 Escalation

If recovery fails:

1. **Capture Diagnostics**
   ```bash
   ./scripts/diagnostics.sh > 99_SYSTEM/Logs/diagnostics_$(date +%Y%m%d_%H%M%S).txt
   ```

2. **Save Critical State**
   ```bash
   tar -czf recovery_$(date +%Y%m%d_%H%M%S).tar.gz \
    99_SYSTEM/Logs/ \
    20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/ \
    .cursor/config.yml
   ```

3. **Roll Back Last Change**
   ```bash
   git diff HEAD~5 HEAD
   git revert HEAD
   ```

4. **Manual Intervention**
   - Review git history
   - Restore from backup
   - Rebuild from scratch

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** V Aurum  
**Status:** ✅ Recovery Playbook Ready

---

*"From chaos, order. From error, wisdom."*
