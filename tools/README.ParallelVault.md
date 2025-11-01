# TriHex Parallel Vault - Usage Guide

**Phase:** VI Consolidation  
**Status:** Operational

---

## Quick Start

### tmux Parallel Shell

```bash
# Start parallel shell
./scripts/tmux-up.sh

# Attach to session
tmux a -t trihex

# Detach
Ctrl-B, then D

# Kill session
tmux kill-session -t trihex
```

**Windows:**
- `core` - Core monitoring
- `obsidian` - Obsidian vault
- `cursor` - Cursor integration
- `proofs` - Heartbeat logs
- `n8n` - n8n integration

---

### Git Worktree Multi-Universe

```bash
# Initialize worktrees
./scripts/worktree-init.sh

# Check status
./scripts/worktree-status.sh

# Work in specific universe
cd ../TriHex.core    # Core universe
cd ../TriHex.obsidian # Obsidian universe
```

---

### GitHub Actions CI

**Harmonia CI:**
```bash
# Manual trigger
gh workflow run harmonia-ci.yml

# Check runs
gh run list --workflow=harmonia-ci.yml

# View logs
gh run view --log
```

**Ryūdō Router:**
- Auto-triggered on Discussion creation
- Manual trigger: `gh workflow run ryudo_router.yml`
- Inputs: `topic`, `mode` (demo/live)

---

### Ryūdō Review Line

**Create Discussion:**
1. Go to GitHub Discussions
2. Create new discussion
3. Title becomes topic
4. Workflow auto-generates Round_1.md

**Manual Seed:**
```bash
node scripts/seed-ryudo.mjs "Your Topic"
```

---

## Tools Reference

### Environment Setup
```bash
source scripts/env-utf8.sh
```

### Testing
```bash
npm run test:encoding        # UTF-8 test
./scripts/preflight-check.mjs # Environment check
./scripts/test-conductor-quick.sh # Conductor test
```

### Normalization
```bash
node scripts/normalize-md.mjs 10_TriHexCore 20_TriHex-Obsidian 99_SYSTEM
```

### Git Configuration
```bash
./scripts/git-i18n-utf8.sh
```

---

## Recovery

### Emergency Downgrade
```bash
./scripts/emergency-downgrade.sh
```

### Recovery
```bash
./scripts/recover-and-resume.sh
```

### Full Recovery Log
See: `99_SYSTEM/Proofs/2025-11-Recovery_Playbook.md`

---

## Documentation

- [Encoding Policy](../docs/ParallelVault/50_EncodingPolicy.md)
- [Status Dashboard](../docs/dashboards/trihex_status.md)
- [Recovery Playbook](../../99_SYSTEM/Proofs/2025-11-Recovery_Playbook.md)

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** VI Consolidation  
**Status:** ✅ Complete

---

*"Parallel vaults. Unified breath."*
