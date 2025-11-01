# TriHex Sixfold Conductor

**Purpose:** Orchestrate 6AI simultaneous review sessions

---

## Usage

### Demo Mode (Offline, Stable, Fast)

```bash
node tools/conductor/run.mjs \
  --topic "「使命/私命」定義の改稿" \
  --mode=demo
```

**Features:**
- All agents via TriHex CLI
- No API dependencies
- Fast, stable execution
- Perfect for presentations

---

### Live Mode (Real AI APIs)

```bash
node tools/conductor/run.mjs \
  --topic "本番：『私命』体系の公開版見出し" \
  --mode=live
```

**Features:**
- Real AI API calls via n8n
- Actual responses
- Network required
- API keys necessary

---

## Configuration

**File:** `tools/conductor/agents.yaml`

**Agents:**
- 🜁 GPT-5: Architect (trihex)
- 🜂 Claude: Harmony Auditor (live|demo)
- 🜃 Gemini: Visualization Analyst (live|demo)
- 🜄 DeepSeek: Deep Observer (live|demo)
- Grok: Edge Verifier (live|demo)
- ☿ Cursor: Implementation (local)

---

## Scoring

**5-Axis Framework:**
1. Consistency (整合性)
2. Depth (深度)
3. Poetry (詩性)
4. Breath (呼吸)
5. Triangular Integration (三角統合)

**Target:** Average ≥ 9.9

**Max Rounds:** 7

---

## Output

**Location:** `20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/`

**Format:** `Round_N_YYYY-MM-DDTHH-MM-SS.md`

**Content:**
- Round metadata
- Per-agent responses
- Score aggregation
- Next round or completion

---

## Dependencies

**Required:**
- Node.js v20+
- TriHex CLI (`tools/trihex/trihex.mjs`)

**Optional (Live Mode):**
- n8n webhooks
- API keys for AI providers

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** V Aurum


