# TriHex System Status Dashboard

**Last Updated:** Auto-refresh on read  
**Phase:** V Aurum  
**Status:** Operational

---

## 🟢 System Health

### Active Processes

```bash
# Check running processes
ps aux | grep -E "conductor|trihex|watchdog" | grep -v grep

# Process count
echo "$(ps aux | grep -E 'conductor|trihex|watchdog' | grep -v grep | wc -l | xargs) active processes"
```

**Expected:** 0-1 watchdog, 0-N conductor instances

---

## 📊 Heartbeat Monitor

### Recent Activity

```bash
# Latest heartbeat entries
tail -30 99_SYSTEM/Logs/ai_heartbeat.log | grep -E "Starting|Restart|Exited"
```

**Format:**
```
[2025-11-01T20:08:00.000Z] [info] Starting GPT-5...
[2025-11-01T20:08:03.000Z] [info] Restarted Claude
```

---

### Error Log

```bash
# Latest errors
tail -30 99_SYSTEM/Logs/ai_errors.log 2>/dev/null || echo "No errors logged"
```

**Status:**
- ✅ **No errors** = Healthy
- ⚠️ **Occasional errors** = Normal (transient failures)
- 🔴 **Continuous errors** = Action required

---

## 📝 Recent Proofs

### Latest Reports

```bash
# Last 10 proofs generated
ls -lht 99_SYSTEM/Proofs/*.md | head -10 | awk '{print $6, $7, $8, $9}'
```

**Key Files:**
- [Master Reactivation](../../../50_CHL/system/reactivation/50_CHL/system/reactivation/TriHex_Master_Reactivation.md)
- [Recovery Playbook](../Proofs/2025-11-Recovery_Playbook.md)
- [FailSafe Validation](../Proofs/2025-11-FailSafe_Validation.md)
- [Conductor Report](../Proofs/2025-11-Conductor_Run.md)

---

## 🔁 Last Conductor Runs

### Round Sessions

```bash
# Latest Ryudo sessions
ls -lht 20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/*.md 2>/dev/null | head -5 | awk '{print $6, $7, $8, $9}'
```

**Structure:**
```
Round_1_2025-11-01T20-08-00.md
Round_2_2025-11-01T20-12-00.md
...
```

---

### Round Statistics

```bash
# Count rounds by status
grep -l "mode: demo" 20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/*.md 2>/dev/null | wc -l | xargs echo "Demo rounds:"
grep -l "mode: live" 20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/*.md 2>/dev/null | wc -l | xargs echo "Live rounds:"
```

---

## 📁 File System Status

### Output Directories

| Directory | Purpose | Last Modified | Status |
|-----------|---------|---------------|--------|
| `99_SYSTEM/Proofs/` | System reports | Auto-updates | ✅ |
| `99_SYSTEM/Logs/` | Heartbeat, errors | Real-time | ✅ |
| `20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/` | Round outputs | On-demand | ✅ |

---

### Disk Usage

```bash
# Check vault size
du -sh . 2>/dev/null

# Check log size
du -sh 99_SYSTEM/Logs/

# Check sessions size
du -sh 20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/
```

---

## 🔧 Integration Status

### GitHub Actions

```bash
# Check recent workflow runs
gh run list --repo kyousuke10000/TriHexPhi --limit 5 2>/dev/null || echo "GitHub CLI not configured"
```

**Workflows:**
- `trihex_sync.yml` - Vault synchronization
- `supabase_sync.yml` - Database sync
- `ryudo_router.yml` - Round orchestration

---

### API Connectivity

```bash
# Test OpenAI API
curl -s -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models | jq -r '.data[0].id' 2>/dev/null || echo "API not accessible"
```

**Status:**
- ✅ **Model ID returned** = Connected
- 🔴 **Error** = API key issue or network problem

---

## 🚨 Alerts

### Critical Status

- 🔴 **System frozen** → Run `./scripts/emergency-downgrade.sh`
- ⚠️ **Too many errors** → Check logs, restart watchdog
- 🟡 **No recent proofs** → Verify Conductor running
- ✅ **All green** → System healthy

---

### Recovery Options

1. **Quick Restart**
   ```bash
   ./scripts/emergency-downgrade.sh
   ./scripts/recover-and-resume.sh
   ```

2. **Debug Mode**
   ```bash
   node tools/conductor/run.mjs --topic "Debug Test" --mode=demo
   ```

3. **Full Reset**
   ```bash
   git status  # Check changes
   git reset --hard HEAD  # Revert if needed
   ```

---

## 📊 Performance Metrics

### Response Times

**Target:**
- CLI response: < 5s
- Conductor round: < 30s
- Watchdog heartbeat: 3s

**Monitoring:**
```bash
# Check last round duration
ls -lht 20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/*.md | head -1 | xargs stat -f "%Sm" -t "%s"
```

---

## 🔗 Quick Links

### System Files
- [TRIHEX_PROJECT.yaml](../../../TRIHEX_PROJECT.yaml)
- [Master Reactivation](../../../50_CHL/system/reactivation/50_CHL/system/reactivation/TriHex_Master_Reactivation.md)
- [Memory Seeds](../../../99_SYSTEM/MemorySeeds/index.json)

### Scripts
- [Demo SixAI](../../../scripts/demo-sixAI.sh)
- [Stress Test](../../../scripts/stress-test-sixAI.sh)
- [Emergency Downgrade](../../../scripts/emergency-downgrade.sh)
- [Recovery Resume](../../../scripts/recover-and-resume.sh)

### Documentation
- [Conductor README](../../../tools/conductor/README.md)
- [Watchdog Implementation](../../../tools/trihex/watchdog.mjs)
- [Recovery Playbook](../../../99_SYSTEM/Proofs/2025-11-Recovery_Playbook.md)

---

## 🎯 Health Score

**Overall:** 🟢 Healthy (Subject to real-time check)

**Components:**
- Processes: 🟢 Running
- Heartbeat: 🟢 Active
- Errors: 🟢 None
- Outputs: 🟢 Generated
- APIs: 🟢 Connected

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** V Aurum  
**Status:** ✅ Operational

---

*"One breath. Complete awareness."*
