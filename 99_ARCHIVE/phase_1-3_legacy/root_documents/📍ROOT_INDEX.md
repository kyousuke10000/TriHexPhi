---
layer: ROOT
type: index
created: 2025-10-24
importance: supreme
tags: [#INDEX, #MOC, #エントリーポイント]
---

# 📍 TriHexΦ Vault - ROOT INDEX

**ようこそ、TriHexΦへ。**

> 「構造は美しくあれ。美しさは効率である。」

---

## 🎯 クイックナビゲーション

### **📍 エントリーポイント**
- [[📍ここを見ろ]] - 最初に読むファイル
- [[🌌TriHexΦ_全体設計]] - システム全体の設計
- [[💠TriHexΦ_四層構造]] - 四層構造の説明

### **🔹 各層のINDEX**
- [[📍CORE_INDEX]] - コア層（設計・哲学・戦略）
- [[📍MIZUKAGAMI_INDEX]] - 水鏡層（AI会話ログ）
- [[📍KOKUYOU_INDEX]] - 黒曜層（洞察・結晶化）
- [[📍SHINSEN_INDEX]] - 真泉Φ層（記憶・同期）
- [[📍HARMONIA_INDEX]] - Harmonia層（共鳴・配給）

---

## 🏛️ 四層構造

```
00_CORE/              ← コア設計（全体設計、哲学、戦略）
10_CAPTURE_MIZUKAGAMI/ ← 水鏡層（各AIの会話ログ）
20_CRYSTALLIZATION_KOKUYOU/ ← 黒曜層（洞察、統合ノート）
30_MEMORY_SHINSEN/    ← 真泉Φ層（Supabase、同期スクリプト）
40_HARMONIA/          ← Harmonia層（Discord、n8n）
99_ARCHIVE/           ← アーカイブ
```

---

## 📊 最新の活動（Dataview）

### **最近のAI通信（直近7日）**

```dataview
TABLE file.ctime as "日時", file.name as "件名"
FROM "10_CAPTURE_MIZUKAGAMI/📬AI_通信アーカイブ"
WHERE file.ctime >= date(today) - dur(7 days)
SORT file.ctime DESC
LIMIT 10
```

### **進行中のプロジェクト**

```dataview
TABLE file.name as "プロジェクト", status as "状態"
FROM "20_CRYSTALLIZATION_KOKUYOU/"
WHERE status = "in_progress"
SORT file.mtime DESC
```

### **重要な洞察**

```dataview
LIST
FROM "20_CRYSTALLIZATION_KOKUYOU/INSIGHTS"
SORT file.mtime DESC
LIMIT 5
```

---

## 🔱 六大叡智（6AI）

```
GPT-5 (Architect)     → 全体設計、DeepResearch
Claude (Observer)     → 深い観察、慎重な分析
Cursor (Engineer)     → 実装、統合、記録
Gemini (Synthesizer)  → 情報統合、市場調査
Grok (Strategist)     → 市場戦略、辛口評価
DeepSeek (Seeker)     → 技術深掘り
```

---

## 🚀 クイックアクセス

### **重要ファイル**
- [[🔐認証情報マスター]] - 全てのAPIキー
- [[📋ファイル作成規則_全AI共通]] - ファイル作成のルール
- [[TriHexΦ運用憲章_MizuKernel]] - 運用の哲学

### **プロジェクト**
- [[🪞MIZUKAGAMI_PROJECT]] - MIZUKAGAMI統合ハブ
- [[PATENT_WORK]] - 特許出願関連
- [[AI_Academy]] - AIアカデミー企画

### **Daily**
- [[DAILY_DASHBOARD]] - 今日のダッシュボード

---

**静寂の中で、全てが整う。** 💎✨

