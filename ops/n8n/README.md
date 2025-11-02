# n8n Operations Runbook

**Date:** 2025-11-02  
**Status:** Workflow-as-Code Enabled

---

## Directory Structure

```
workflows/          # Source of truth (Git-tracked)
├── kyoen-event-detect.json
├── kyoen-rsvp.json
├── kyoen-reminders.json
└── kyoen-cards.json

tools/
├── n8n-export.mjs      # n8n → Git
├── n8n-import.mjs      # Git → n8n
├── n8n-diff.mjs        # Drift detection
├── test_ping.mjs       # Health check
└── test_line_fake.mjs  # Integration test

.github/workflows/
├── n8n_ci.yml          # Automated CI (stg)
└── n8n_cd.yml          # Manual CD (prod)
```

---

## Operations

### Export (n8n → Git)

```bash
node tools/n8n-export.mjs
```

**Result:** Updates `workflows/*.json`

---

### Import (Git → n8n)

```bash
node tools/n8n-import.mjs --env=stg
node tools/n8n-import.mjs --env=prod
```

**Behavior:** Idempotent (upsert)

---

### Test

```bash
node tools/test_ping.mjs --env=prod
node tools/test_line_fake.mjs --env=prod
```

---

## CI/CD

**CI:** Auto on PR/Push (stg only)  
**CD:** Manual via Actions UI (prod)

---

**Generated:** 2025-11-02 / Cursor (☿)

