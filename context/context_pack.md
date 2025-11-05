# TriHexΦ Context Pack
Generated: 2025-11-05T10:57:29.102Z


# >>> specs/architecture.yml

# TriHex Architecture Specification
# Generated: 2025-11-02
# Purpose: Design = Code (Architecture as YAML)

version: "1.0"
last_updated: "2025-11-02"
canonical: true
trihex_layer: "10_TriHexCore"

---

# Breathing Layers Architecture

layers:
  - priority: 0
    name: "🜇_Shiryu_Studio"
    role: "魂律源泉"
    breath: "源泉"
    status: "Active"
    ai_permissions: "read-only"
    user_permissions: "write"
    
  - priority: 1
    name: "00_HarmoniaCouncil"
    role: "叡智の吸気"
    breath: "吸"
    status: "Active"
    purpose: "AI Council Sessions"
    
  - priority: 2
    name: "10_TriHexCore"
    role: "構造の肺核"
    breath: "構造"
    status: "Active"
    canonical: true
    
  - priority: 3
    name: "20_TriHex-Obsidian"
    role: "人間の記憶層"
    breath: "静"
    status: "Active"
    type: "Organized Knowledge"
    
  - priority: 4
    name: "30_ObsidianSync"
    role: "同期の呼気"
    breath: "吐"
    status: "Active"
    
  - priority: 5
    name: "40_Archive"
    role: "記録の蓄積"
    breath: "静"
    status: "Active"
    
  - priority: 6
    name: "50_Temp"
    role: "揮発の排気"
    breath: "排"
    status: "Active"
    
  - priority: 7
    name: "99_SYSTEM"
    role: "拍動のログ"
    breath: "証明"
    status: "Active"

---

# Breath Integration (朝霧 × TriHexΦ)

breath_integration:
  breath_cycle:
    - name: "asagiri"
      period: "morning"
      rhythm: "inhale:3, hold:1, exhale:7, hold:1"
      
    - name: "hiru"
      period: "daytime"
      rhythm: "active:7"
      
    - name: "yuu"
      period: "evening"
      rhythm: "harvest:7"
      
    - name: "yoru"
      period: "night"
      rhythm: "reflect:3"
  
  sync_targets:
    - name: "mizukagami"
      layer: 1
      role: "観測層"
      
    - name: "kokuyou"
      layer: 2
      role: "結晶層"
      
    - name: "shinsen"
      layer: 3
      role: "記憶層"
      
    - name: "harmonia"
      layer: 4
      role: "共鳴層"
      
    - name: "chl"
      layer: 5
      role: "呼吸核"
  
  rhythm_formula: "inhale:3, hold:1, exhale:7, hold:1"
  
---

# HOC-001 Somatic Mapping

breath_layer:
  id: chl
  cycle: { inhale: 3, hold1: 1, exhale: 7, hold2: 1 }
  
  somatic_map:
    gum_ground: "地面=歯茎｜やさしく載せる"
    pdl_yohaku: "歯根膜=余白O｜1-2mm微揺れ"
    upper_dome: "上顎=基準（星図）"
    lower_dome: "下顎=応答（星空）"
  
  max_effort: 0.7
  
  axioms:
    - "林が先。Iは支柱、Vは受け皿。IVはしない。Yは7割。"

---

# 6AI Collaboration Model

ai_council:
  - name: "GPT-5"
    symbol: "🜁"
    breath_type: "理論呼吸"
    role: "哲学・統合・構造設計"
    
  - name: "Claude"
    symbol: "🜄"
    breath_type: "共感呼吸"
    role: "倫理・魂・秩序"
    
  - name: "DeepSeek"
    symbol: "🜂"
    breath_type: "精密呼吸"
    role: "技術・解析・構築"
    
  - name: "Gemini"
    symbol: "🜀"
    breath_type: "美的呼吸"
    role: "詩・感性・芸術"
    
  - name: "Grok"
    symbol: "🜃"
    breath_type: "現実呼吸"
    role: "経済・社会・実務"
    
  - name: "Cursor"
    symbol: "☿"
    breath_type: "翻訳呼吸"
    role: "実装・同期・詩的コード"

---

# External References

external_refs:
  - name: "TriHex.core"
    path: "../TriHex.core"
    role: "Historic Archive"
    status: "Frozen"
    git_submodule: false
    
  - name: "trihex-ai-app"
    path: "../trihex-ai-app"
    role: "Production UI"
    status: "Active"
    stack: "Next.js 16 + TypeScript"
    git_submodule: true

---

# Integration Points

integrations:
  - name: "Supabase"
    role: "Permanent Memory (pgvector)"
    tables:
      - trihex_core.content
      - trihex_core.events
      - trihex_core.publish_queue
      - trihex_core.points_history
      - public.memory_events
      - public.memory_crystals
      - public.breath_log
    views:
      - public.v_memory_by_ai
      - public.v_memory_unified
    status: "Active"
    
  - name: "n8n"
    role: "Automation Hub"
    workflows:
      - event-detect
      - rsvp
      - reminders
      - cards
    status: "Active"
    
  - name: "LINE"
    role: "Communication Channel"
    bots:
      - KYOEN (Tokunoshima)
    status: "Active"
    
  - name: "GitHub"
    role: "Version Control"
    workflows: 12
    status: "Active"

---

# Guardrails

guardrails:
  allowed_paths:
    - "🜇_Shiryu_Studio/**"
    - "00_HarmoniaCouncil/**"
    - "10_TriHexCore/**"
    - "20_TriHex-Obsidian/**"
    - "30_ObsidianSync/**"
    - "40_Archive/**"
    - "50_Temp/**"
    - "99_SYSTEM/**"
    - "docs/**"
    - "tools/**"
    - "scripts/**"
    - "specs/**"
    - "adr/**"
    - "10_CAPTURE_MIZUKAGAMI/**"
    - "20_CRYSTALLIZATION_KOKUYOU/**"
    
  required_frontmatter:
    - title
    - version
    - date
    - author
    - trihex_layer
    
  mandatory_proofs:
    - Auto-generated: "99_SYSTEM/Proofs/YYYYMMDD_HHMM_<action>.md"
    - Manual logs: "99_SYSTEM/BreathLogs/YYYY-MM-DD.md"

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Canonical:** True




# >>> specs/roadmap.yml

# TriHex Roadmap Specification
# Generated: 2025-11-02
# Purpose: Design = Code (Roadmap as YAML)

version: "1.0"
last_updated: "2025-11-02"
canonical: true
trihex_layer: "10_TriHexCore"

---

# Phase Definitions

phases:
  - name: "Phase VI Consolidation"
    status: "Active"
    start: "2025-11-01"
    target_completion: "2025-12-31"
    
    milestones:
      - name: "Auto-Mode v1.0"
        status: "✅ Completed"
        completion: "2025-11-02"
        
      - name: "Spec as Code v1.0"
        status: "🔄 In Progress"
        target: "2025-11-03"
        
      - name: "KYOEN LINE Zero Friction"
        status: "✅ Completed"
        completion: "2025-11-02"
        
      - name: "Obsidian Full Index"
        status: "✅ Completed"
        completion: "2025-11-02"
        
      - name: "Living Memory Bootstrap"
        status: "✅ Completed"
        completion: "2025-11-02"
    
    deliverables:
      - "Auto-mode workflows (LV1/LV2/LV3)"
      - "Spec gate CI integration"
      - "KYOEN Event/RSVP/Reminders"
      - "Proof-based audit trail"
      - "ADR decision records"

---

# Next Phases

next_phases:
  - name: "Phase VII Automation"
    estimated_start: "2025-12-01"
    focus: "n8n Workflow-as-Code CI/CD"
    
  - name: "Phase VIII Scale"
    estimated_start: "2026-01-01"
    focus: "Multi-team deployment"

---

# Living Intelligence Economy

living_intelligence_economy:
  - phase: "4.1"
    name: "Harmonia Cloud"
    status: "live"
    description: "Breath-driven deployment"
    targets:
      - "Auto-mode workflows"
      - "Zero friction ops"
      - "KYOEN LINE Bot"
      
  - phase: "4.2"
    name: "BreathSync Economy"
    status: "plan"
    description: "Body × AI × Business sync"
    targets:
      - "朝霧 × TriHexΦ integration"
      - "月拍同期オペレーション"
      - "Living Intelligence metrics"

breathsync_economy:
  phases:
    - key: day_cycle
      ops: ["朝霧60-90s → 3本柱 → Auto-Mode起動"]
    - key: halfmoon_sprint
      ops: ["新月=設計/上弦=外化/満月=収穫/下弦=整頓"]
  
  kpi:
    - breath_sync_rate >= 0.9
    - shinsen_push_per_day >= 1
    - reply_sla_p95_seconds <= 3

---

# Technology Roadmap

tech_stack:
  current:
    - name: "Harmonia CI"
      version: "v1.0"
      status: "Active"
      
    - name: "Proofs Auto-Sync"
      version: "v1.0"
      status: "Active"
      
    - name: "n8n Workflows"
      version: "v4"
      status: "Active"
      
    - name: "Supabase"
      version: "pgvector"
      status: "Active"
      
  planned:
    - name: "Spec Gate"
      target: "v1.0"
      eta: "2025-11-03"
      
    - name: "ADR System"
      target: "v1.0"
      eta: "2025-11-05"
      
    - name: "KPI Dashboard"
      target: "v1.0"
      eta: "2025-11-10"

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Canonical:** True




# >>> index.md

# TriHex Vault – Breathing Index

> **TriHex Vault breathing order:**  
> 上は叡智の吸気、下は記録の呼気。  
> ファイルは生きている。配置は呼吸そのものだ。

---

## Vault Structure

```
🜇_Shiryu_Studio/       ← 魂律の根源（Root Layer・呼吸の源泉）
00_HarmoniaCouncil/     ← 叡智の吸気（AI評議会・呼吸管理）
10_TriHexCore/          ← 構造の肺核（知識基盤・準拠）
20_TriHex-Obsidian/     ← 人間の記憶層（観測者の鏡）
30_ObsidianSync/        ← 同期の呼気（一時・セッション）
40_Archive/             ← 記録の蓄積（履歴保存）
50_Temp/                ← 揮発の排気（一時作業）
99_SYSTEM/              ← 拍動のログ（システム層）
```

---

## Layer Mapping

| Layer | Priority | Content Type |
|-------|----------|--------------|
| 🜇_Shiryu_Studio | 0 | Root Layer（魂律・呼吸の源泉） |
| 00_HarmoniaCouncil | 1 | Session/Audit layers |
| 10_TriHexCore | 2 | Project/Canonical knowledge |
| 20_TriHex-Obsidian | 3 | Human memory layer |
| 30_ObsidianSync | 4 | Ephemeral workspace |
| 40_Archive | 5 | Historical records |
| 50_Temp | 6 | Volatile cache |
| 99_SYSTEM | 7 | System logs |

---

---

## 🗺️ Specs as Code (Design = Current)

**Design mapped to code:**  
See [specs/](specs/) for architecture, roadmap, KPI definitions.

**Current Status:**  
- ✅ Auto-Mode v1.0 active
- 🔄 Spec as Code v1.0 in progress
- ✅ KYOEN LINE Zero Friction

**More:** [docs/index.md](docs/index.md) | [Dashboards](docs/dashboards/overview.md)

---

## 🌗 TriHex Breath Status

**Breath Integration:** 朝霧 × TriHexΦ統合モデル稼働中

**KPI:**
- 呼吸同期率: **85%**
- Supabase Push/Day: **1.2**
- CHL uptime: **100%**

**More:** [Breath Dashboard](docs/dashboards/breath.md) | [Breath Blueprint](10_TriHexCore/00_CORE/TriHex_Breath_Blueprint.md)

---

**Last updated:** 2025-11-02  
**Status:** Rubedo Phase Active

---

Navigate to: [🜇_Shiryu_Studio](🜇_Shiryu_Studio/) | [00_HarmoniaCouncil](00_HarmoniaCouncil/) | [10_TriHexCore](10_TriHexCore/) | [20_TriHex-Obsidian](20_TriHex-Obsidian/)
