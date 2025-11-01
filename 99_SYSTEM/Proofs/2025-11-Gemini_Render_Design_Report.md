# Gemini Render Design Report

**Date:** 2025-11-01  
**Phase:** Phase IV Rubedo  
**Observer:** Cursor (☿)  
**Status:** ✅ PROPOSAL COMPLETE

---

## Executive Summary

**Status:** ✅ ALL PROPOSALS GENERATED  
**Files:** 4 proposed files  
**Integration:** Auto-restart config added  
**Next Step:** Block B (Minimal Apply)

---

## Phase A: Design Proposals

### 1. GitHub Actions Workflow

**File:** `.github/workflows/gemini_render.yml.proposed`  
**Status:** ✅ Created (10KB)

**Features:**
- Triggers: `discussion.created`, `discussion_comment.created`, `workflow_dispatch`
- Steps:
  1. Parse Discussion context
  2. Build render prompt
  3. Call Gemini render script
  4. Save image artifact
  5. Post to Discussion
  6. Generate report

**Inputs:**
- `prompt` (required)
- `format` (svg/png, default: svg)
- `width` (default: 1200)
- `height` (default: 800)

**Outputs:**
- Image artifact
- Discussion comment with embedded image
- Error handling

---

### 2. Render Script

**File:** `scripts/gemini_render.mjs.proposed`  
**Status:** ✅ Created (3.8KB)

**Features:**
- Node.js ESM module
- Calls Gemini API (gemini-pro-vision model)
- Returns JSON to stdout
- Error handling without failing

**Usage:**
```bash
node gemini_render.mjs \
  --prompt "..." \
  --format svg \
  --width 1200 \
  --height 800
```

**Output:**
```json
{
  "success": true,
  "image_data": "base64...",
  "image_type": "svg",
  "width": 1200,
  "height": 800,
  "size": 12345
}
```

---

### 3. n8n Workflow

**File:** `integrations/n8n/gemini_render_ingest.json.proposed`  
**Status:** ✅ Created (5.4KB)

**Features:**
- Webhook trigger
- Code nodes for parsing/processing
- HTTP Request to Gemini API
- Respond to webhook
- Error handling

**Nodes:**
1. Render Webhook (POST /gemini-render)
2. Parse Request (extract parameters)
3. Call Gemini (API request)
4. Process Response (extract content)
5. Return Response (200/500)
6. Error Handler (fallback)

**Usage:**
```bash
curl -X POST \
  https://primary-production-14b0.up.railway.app/webhook/gemini-render \
  -H "Content-Type: application/json" \
  -d '{"prompt": "...", "format": "svg"}'
```

---

### 4. Prompt Templates

**File:** `specs/gemini_prompt_templates.md.proposed`  
**Status:** ✅ Created (8.1KB)

**Templates:**
1. TriHex Breath Map (Vault architecture)
2. Ryūdō Round HeatMap (Scoring visualization)
3. Mirror Diff Diagram (Sync status)
4. 6HAI Interaction Graph (AI collaboration)
5. Breath Flow Animation Frame (Cycle visualization)
6. Workflow Pipeline (Actions flow)
7. Scoring Evolution Timeline (Improvement graph)

**Usage in Discussion:**
```markdown
```render
Template: TriHex Breath Map
Format: svg
Size: 1200x800
```
```

---

## Phase C: Auto-Restart Configuration

**File:** `.cursor/config.yml`  
**Status:** ✅ Updated

**Added Settings:**
```yaml
integrations:
  - name: claude
    enabled: true
    auto_context: true
    auto_restart: true
    backoff: [3, 10, 30]
  
  - name: gemini
    enabled: true
    auto_context: true
    auto_restart: true
    backoff: [3, 10, 30]
  
  - name: n8n
    enabled: true
    auto_restart: true
    backoff: [5, 15, 45]
    health_check_url: "https://primary-production-14b0.up.railway.app/healthz"

integration_logs:
  enabled: true
  path: "99_SYSTEM/Logs/integration_restarts.log"
  level: "info"
  retention_days: 30
```

**Purpose:**
- Auto-recover from API failures
- Exponential backoff for retries
- Log all restart attempts
- 30-day retention

---

## Verification

### File Existence
- [x] `.github/workflows/gemini_render.yml.proposed`
- [x] `scripts/gemini_render.mjs.proposed`
- [x] `integrations/n8n/gemini_render_ingest.json.proposed`
- [x] `specs/gemini_prompt_templates.md.proposed`

### Config Updates
- [x] `.cursor/config.yml` with integrations
- [x] `99_SYSTEM/Logs/` directory created

### Linter Status
- [x] No errors in YAML/JSON/MD files

---

## Next Steps

### Block B: Minimal Apply (Manual)

**Prerequisites:**
- GitHub Secrets: `GEMINI_API_KEY` registered

**Actions:**
1. Move `.proposed` files to production
2. Run test workflow dispatch
3. Verify artifact generation
4. Post render report

**Verification:**
- Discussion creation
- Artifact upload
- Image embedding

---

## Usage Examples

### Via Discussion

```markdown
# Render Request

```render
Draw a hierarchical diagram showing the TriHex Vault breathing architecture.
Include all 8 layers, 6HAI agents, and external systems.
Use alchemical symbols and breathing colors.
```
```

### Via Workflow Dispatch

```bash
gh workflow run gemini_render.yml \
  -f prompt="TriHex Breath Map" \
  -f format="svg" \
  -f width="1200" \
  -f height="800"
```

### Via n8n Webhook

```bash
curl -X POST \
  https://primary-production-14b0.up.railway.app/webhook/gemini-render \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Render the Ryudo heatmap",
    "format": "png",
    "width": "1400",
    "height": "900"
  }'
```

---

## Integration Stability

**Auto-Restart Config:**
- Claude: 3s → 10s → 30s
- Gemini: 3s → 10s → 30s
- n8n: 5s → 15s → 45s

**Logging:**
- All restart attempts logged
- 30-day retention
- Info level minimum

**Benefits:**
- Automatic recovery from failures
- Reduced manual intervention
- Better observability

---

## Related Documents

- [Gemini Prompt Templates](specs/gemini_prompt_templates.md.proposed)
- [Ryudo Workflow](.github/workflows/ryudo_round.yml)
- [Master Reactivation](../../../TriHex_Master_Reactivation.md)

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo  
**Status:** Proposal Complete, Ready for Apply

---

*"Visual intelligence completes the breath cycle."*


