# Accidental Workflow Deletion

**Date:** 2025-11-02  
**Severity:** HIGH

---

## What Happened

Deleted **all 23 workflows** instead of just the 4 KYOEN workflows.

---

## Intended Deletion

- KYOEN Event Detect (x6DDgPh24FLp33am)
- KYOEN RSVP (Ozw3pPoFy0GsfdOm)
- KYOEN Reminders (kugMQN2qdbuLoIw9)
- KYOEN Cards (ZJq3KtFbBP6bzjwy)

---

## Accidental Deletion

Other workflows also deleted:
- 🌟 Beauty News Collector
- TRIHEX R2 Weekly Archive
- MIZUKAGAMI workflows
- ChatWork FAQ Bot
- Phase 3.x workflows
- Notion generators
- Other custom workflows

---

## Recovery

**Option 1: n8n Export**
- If backups exist in n8n UI, re-import

**Option 2: Git**
- Check for workflow JSON files in `/workflows/`
- Re-import via n8n API

**Option 3: Manual**
- Recreate from scratch in n8n UI

---

## Lesson

Always use workflow filtering before deletion.

---

**Generated:** 2025-11-02 / Cursor (☿)


