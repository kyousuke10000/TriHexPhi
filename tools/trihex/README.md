# TriHex CLI

TriHex CLI - GPT-5 Architect Shell

---

## Usage

**1-Shot Execution:**
```bash
trihex --exec "Memory Reactivation Protocol を読んで TriHex の文脈を再起動"
```

**Chat Mode:**
```bash
trihex --chat
```

**Termination:**
- Type `:q` to exit chat mode

---

## Environment Variables

**Required:**
- `OPENAI_API_KEY`: OpenAI API key

**Optional:**
- `TRIHEX_MODEL`: Model to use (default: `gpt-4o`)

**Setup:**
```bash
cp tools/trihex/.env.example tools/trihex/.env
# Edit .env with your OPENAI_API_KEY
```

---

## Architecture

**Lightweight RAG:**
- Loads: `TRIHEX_PROJECT.yaml`, `MemorySeeds/index.json`, `50_CHL/system/reactivation/50_CHL/system/reactivation/TriHex_Master_Reactivation.md`
- Each context: ~2KB excerpt maximum
- Truncates large texts to prevent memory bloat

**Stream Output:**
- Real-time streaming for low latency
- Immediate visual feedback

**Memory Management:**
- Chat history limited to last 4 turns
- Old history automatically pruned

---

## Benefits

1. **Fast:** Terminal process, no browser overhead
2. **Lightweight:** Minimal memory footprint
3. **Streaming:** Low perceived latency
4. **Context-aware:** Auto-loads Vault metadata

---

## Design Notes

- Browser-free operation for performance
- Context compression to avoid token limits
- Native terminal integration
- Clean, minimal output

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo


