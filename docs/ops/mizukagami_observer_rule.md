# AI＝観測者 / 人＝構造化者（運用正典）

**Version:** 1.0  
**Date:** 2025-11-02  
**Status:** Canonical

---

## 🪞 Core Principle

**AIは観測者／人は構造化者**

- AI（GPT/Claude/Gemini/Cursor/Grok/DeepSeek）は `10_CAPTURE_MIZUKAGAMI/` に記録だけを残す
- 黒曜（`20_CRYSTALLIZATION_KOKUYOU/`）で人が構造化・命名・意思決定
- 真泉Φ（Supabase）はAI横断の永続メモリ（検索・照会）
- Harmonia（LINE/Discord）は配信用。意思決定は黒曜に戻す

**例外：なし。構造化をAIに委譲しない**

---

## 📊 Pipeline

```
MIZUKAGAMI (観測)
  ↓ [AI raw logs]
KOKUYOU (構造化)
  ↓ [#sync:shinsen]
SHINSEN (永続)
  ↓ [Supabase]
Harmonia (配信)
```

---

## 🔄 Workflow

### 1. Capture (MIZUKAGAMI)

**AI sessions → Markdown files**

- Path: `10_CAPTURE_MIZUKAGAMI/<AI>/`
- Format: Session template
- Frontmatter: `sync: false` (default)

### 2. Crystalize (KOKUYOU)

**Human review → Structured notes**

- Path: `20_CRYSTALLIZATION_KOKUYOU/INSIGHTS/`
- Add: `sync:shinsen` tag
- Review: Meaning assignment by human

### 3. Persist (SHINSEN)

**Auto-sync to Supabase**

- Trigger: `[deploy]` commit message
- Table: `memory_crystals`
- Views: `v_memory_by_ai`, `v_memory_unified`

---

## 🚫 Rules

1. **No AI structuring** - AI only captures raw logs
2. **No auto-sync** - Requires `[deploy]` marker
3. **Human-only decisions** - All meaning assigned by human
4. **Canonical paths only** - No deviations

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Purpose:** AI observer operational canon


