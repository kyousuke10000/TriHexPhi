# GitHub Rollback Playbook

**Date:** 2025-11-01  
**Phase:** Phase IV Rubedo  
**Status:** Emergency Recovery Procedures  
**Audience:** Operators (Shiryu + AI Council)

---

## Executive Summary

**Purpose:** Quick recovery from failed automatic syncs or unintended commits  
**Scope:** Vault sync, Supabase sync, mirror integrity  
**Safety:** All rollback steps are reversible

---

## 1. Git Revert Procedures

### A. Revert Single Commit

**Scenario:** One bad commit in recent history

```bash
# 1. Identify commit hash
git log --oneline -10

# 2. Create revert commit
git revert <commit-hash>

# 3. Push to main
git push origin main
```

**Example:**
```bash
git revert 9414cc6
git push origin main
```

---

### B. Reset to Specific Commit (Hard Reset)

**Scenario:** Multiple bad commits, need to discard them entirely

⚠️ **Warning:** Destructive operation. Use with extreme caution.

```bash
# 1. Backup current state
git branch backup-before-reset-$(date +%Y%m%d-%H%M%S)

# 2. Reset to specific commit
git reset --hard <commit-hash>

# 3. Force push (only if you own the repo!)
git push origin main --force
```

**Safe Alternative (use instead):**
```bash
# Create reverse commit instead of force push
git revert HEAD~3..HEAD
git push origin main
```

---

### C. Rollback from Specific Date

**Scenario:** Roll back to last known good state on specific date

```bash
# 1. Find last good commit before date
git log --until="2025-11-01 12:00" --oneline -1

# 2. Revert all commits after that
git revert <good-commit-hash>..HEAD

# 3. Push
git push origin main
```

---

## 2. Workflow Disable Procedures

### A. Disable Auto-Sync (Temporary)

**Scenario:** Pause automatic syncs while investigating issues

```bash
# Rename workflow file (disables it)
mv .github/workflows/trihex_sync.yml .github/workflows/trihex_sync.yml.disabled

# Commit the disable
git add .github/workflows/
git commit -m "🛑 Emergency: Disable trihex_sync workflow"
git push origin main
```

**Re-enable:**
```bash
mv .github/workflows/trihex_sync.yml.disabled .github/workflows/trihex_sync.yml
git add .github/workflows/
git commit -m "✅ Re-enable trihex_sync workflow"
git push origin main
```

---

### B. Keep Only workflow_dispatch

**Scenario:** Allow manual triggers but disable automatic

Edit `.github/workflows/trihex_sync.yml`:

```yaml
# Comment out or remove these triggers:
# on:
#   push:
#     paths: [...]
#   schedule:
#     - cron: "0 * * * *"
  
# Keep only:
on:
  workflow_dispatch:  # Manual trigger only
```

Then commit and push.

---

### C. Disable Supabase Sync

```bash
mv .github/workflows/supabase_sync.yml .github/workflows/supabase_sync.yml.disabled
git add .github/workflows/
git commit -m "🛑 Emergency: Disable Supabase sync"
git push origin main
```

---

## 3. Cursor Config Rollback

### A. Disable Auto-Commit

**File:** `.cursor/config.yml`

**Change:**
```yaml
# From:
auto_commit: true

# To:
auto_commit: false
```

**Or completely remove the GitHub Integration Settings section.**

---

### B. Restore Previous Config

```bash
# 1. Find previous version
git log --oneline .cursor/config.yml

# 2. Checkout specific version
git checkout <commit-hash> -- .cursor/config.yml

# 3. Commit
git add .cursor/config.yml
git commit -m "🔙 Rollback: Restore previous Cursor config"
git push origin main
```

---

## 4. Supabase Data Rollback

### A. Last Known Good State

**Scenario:** Supabase data corrupted by bad sync

```bash
# 1. Identify last good sync timestamp
# Check Supabase events table:
# SELECT * FROM trihex_core.events WHERE kind = 'sync' ORDER BY ts DESC LIMIT 10;

# 2. If using backups, restore from backup at that timestamp
# (Supabase dashboard: Database → Backups)

# 3. If no backup, manual reconstruction:
#    - Re-sync from Git source of truth
#    - Run Supabase sync workflow with dry-run first
```

---

### B. Manual Re-sync

```bash
# 1. Clear corrupted data
# (Via Supabase SQL Editor or dashboard)

# 2. Run manual sync (dry-run first)
gh workflow run supabase_sync.yml -f dry_run=true

# 3. Verify results

# 4. Run live sync
gh workflow run supabase_sync.yml -f dry_run=false
```

---

## 5. Mirror Integrity Recovery

### A. Re-synchronize All Mirrors

**Scenario:** Mirrors out of sync

```bash
# 1. Identify source of truth (TriHexCore)
# 2. Copy from source to all mirrors

# Genesis Protocol
cp 10_TriHexCore/codex/Genesis_Protocol_v3.1.md \
   20_TriHex-Obsidian/01_Codex/Genesis_Protocol_v3.1.md

cp 10_TriHexCore/codex/Genesis_Protocol_v3.1.md \
   30_ObsidianSync/Canonical/Genesis_Protocol_R1_v3.1.md

# Ryudo Definition
cp 10_TriHexCore/system/Ryudo_Definition.md \
   20_TriHex-Obsidian/01_System/Ryudo_Definition.md

# Harmonia Covenant
cp 10_TriHexCore/system/Harmonia_Operating_Covenant_v1.1.md \
   20_TriHex-Obsidian/01_System/Harmonia_Operating_Covenant_v1.1.md

# 3. Commit changes
git add "20_TriHex-Obsidian/" "30_ObsidianSync/"
git commit -m "🔧 Emergency: Re-sync all mirrors from TriHexCore"
git push origin main
```

---

## 6. Emergency Contacts

### Immediate Actions

1. **Disable workflows** (see Section 2)
2. **Disable auto-commit** (see Section 3A)
3. **Create backup branch** before any destructive operations
4. **Document incident** in `99_SYSTEM/Proofs/Incident_Report_YYYY-MM-DD.md`

---

## 7. Rollback Verification Checklist

After rollback, verify:

- [ ] Git history clean (`git log` shows expected commits)
- [ ] Workflows disabled/enabled as intended
- [ ] Cursor config matches desired state
- [ ] Supabase data consistent (if applicable)
- [ ] Mirror files in sync
- [ ] No broken links in Obsidian
- [ ] Vault structure intact
- [ ] Incidents documented

---

## 8. Post-Rollback Actions

### A. Incident Documentation

**File:** `99_SYSTEM/Proofs/Incident_Report_YYYY-MM-DD.md`

Include:
- What happened
- When it was detected
- Root cause (if known)
- Rollback actions taken
- Prevention measures
- Timeline

---

### B. Workflow Adjustments

After incident:
1. Review logs: `.github/workflows/*.yml` execution history
2. Adjust triggers/schedules if too aggressive
3. Add additional safeguards
4. Update this playbook with lessons learned

---

## 9. Quick Reference Commands

```bash
# Emergency disable all auto-sync
mv .github/workflows/trihex_sync.yml .github/workflows/trihex_sync.yml.disabled && \
mv .github/workflows/supabase_sync.yml .github/workflows/supabase_sync.yml.disabled && \
sed -i.bak 's/auto_commit: true/auto_commit: false/' .cursor/config.yml && \
git add . && git commit -m "🛑 Emergency: Disable all auto-sync" && git push origin main

# View recent activity
git log --oneline -20

# View specific file history
git log -p <file-path>

# Compare mirrors
diff -u 10_TriHexCore/codex/Genesis_Protocol_v3.1.md \
       20_TriHex-Obsidian/01_Codex/Genesis_Protocol_v3.1.md

# Check workflow status
gh run list --workflow=trihex_sync.yml --limit 10

# Dry-run Supabase sync
gh workflow run supabase_sync.yml -f dry_run=true
```

---

## 10. Prevention Checklist

**Before enabling auto-sync:**
- [ ] Review workflow triggers
- [ ] Test with dry-run first
- [ ] Verify credentials configured
- [ ] Create backup branch
- [ ] Document expected behavior
- [ ] Set up monitoring/alerts

**After incident:**
- [ ] Root cause analysis
- [ ] Update procedures
- [ ] Add safeguards
- [ ] Re-train team

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo  
**Status:** Ready for Deployment

---

*"Rollback is a feature. Recovery is preparation."*


