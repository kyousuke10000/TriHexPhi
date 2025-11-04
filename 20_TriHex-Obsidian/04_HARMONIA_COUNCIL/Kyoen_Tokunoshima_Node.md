---
title: "徳之島ノード（響縁AI）"
date: "2025-11-01"
phase: "VI Consolidation"
node: "Tokunoshima"
team: "KyoenAI"
status: "Operational"
tags: ["#KYOEN", "#Tokunoshima", "#Node", "#Consolidation"]
---

# 徳之島ノード（響縁AI）

**響縁AI実践拠点**  
**TriHex外部展開の第一号ノード**

---

## Ⅰ. Team Composition

### Members

| 名前 | 役割 | 機能 |
|------|------|------|
| **辻さん** | 拡散/営業 | pitch / 行脚 / 導入 |
| **知恵里さん** | 共感/翻訳 | 共感共有 / 証言 |
| **子竜** | 設計/AI | 設計 / 改善 / AI運用 |

---

## Ⅱ. Objectives

### Primary Goals

1. **ツクツク内“紹介→成約率”地域一位**
2. **月次還流の最大化**
3. **応援文化の可視化**

---

## Ⅲ. KPIs (Weekly)

| KPI | 定義 | 目標 | 測定 |
|-----|------|------|------|
| **投稿本数** | AI生成投稿の週次本数 | 20本/週 | 自動集計 |
| **AI生成回数** | KYOEN AI使用回数 | 30回/週 | ログ記録 |
| **感謝メッセージ数** | 感謝/応援メッセ生成数 | 15件/週 | 手動集計 |
| **反応率** | 投稿に対する反応率 | 50% | LINE/Tsukutsuku |
| **紹介→成約率** | 紹介→成約の比率 | 15% | Tsukutsuku |

---

## Ⅳ. Operating Workflow

### Week 1: Initial Setup

**Day 1-3:** LINE導入テンプレ使用
- Day 1: 基本説明 + 初回生成
- Day 2: 自己紹介生成
- Day 3: 感謝文生成

**Day 4-7:** 本格運用開始
- 日常業務に組み込み
- 週次KPI測定開始

---

### Routine Operations

1. **Generation:** `node tools/kyoenAI/generator.mjs --mode {mode} --who {who} --about {about}`
2. **Posting:** LINE/Tsukutsukuへ投稿
3. **Tracking:** 反応を記録
4. **Reporting:** 週次でKPI報告

---

### Proof Collection

**Save location:** `99_SYSTEM/Proofs/KyoenAI/{date}/`

**Content:**
- 生成日時
- 対象者
- モード（intro/thanks/pitch）
- 生成本文
- 反応結果（optional）

---

## Ⅴ. Role Assignments

### 辻さん: 拡散担当

**Responsibilities:**
- 90秒ピッチ実行
- 島内行脚
- 新規導入

**Tools:**
- Pitch script
- AI generator
- Proof tracker

---

### 知恵里さん: 共感担当

**Responsibilities:**
- 共感ブリッジ
- 証言提供
- フィードバック収集

**Tools:**
- Bridge script
- 証言集
- Feedback log

---

### 子竜: 設計担当

**Responsibilities:**
- AI運用監視
- 改善提案
- Proof分析

**Tools:**
- Generator CLI
- Logs analysis
- KPI dashboard

---

## Ⅵ. Success Metrics

### Week 1 Target

- ✅ 全メンバーが1回以上AI生成使用
- ✅ 10本以上の投稿生成
- ✅ 5件以上の反応獲得

### Month 1 Target

- ✅ 紹介→成約率15%達成
- ✅ ツクツク内地域一位
- ✅ 月次還流最大化

### Ongoing

- 応援文化の可視化
- 優しい循環の定着
- ご縁の増幅

---

## Ⅶ. Feedback Loop

### Weekly Review

**When:** 毎週金曜  
**Who:** 全メンバー  
**Content:**
- KPI確認
- 課題共有
- 改善提案
- 翌週計画

### Monthly Report

**Output:** `99_SYSTEM/Proofs/KyoenAI/monthly/{YYYY-MM}.md`  
**Include:**
- KPI達成状況
- 成功事例
- 課題と改善
- 次月目標

---

## Ⅷ. Integration with TriHex

### Breathing Cycle

```
想い（辻/知恵里/子竜）
  ↓ 吸
KYOEN AI生成
  ↓ 構造
Proof保存
  ↓ 静
循環確認
  ↓ 吐
投稿・反応
  ↓ 静
還流・成約
```

### Proof Integration

- 全生成物はProofsへ記録
- Frontmatterで管理
- Supabase同期予定

---

## Ⅸ. Quick Commands

### Generate Content

```bash
# 紹介文
node tools/kyoenAI/generator.mjs --mode intro --who "辻さん" --about "健康食品の想い" --tone "やわらか"

# 感謝文
node tools/kyoenAI/generator.mjs --mode thanks --who "知恵里さん" --about "今日のサポート"

# ピッチ
node tools/kyoenAI/generator.mjs --mode pitch --who "子竜" --about "響縁AIの紹介"
```

### Check Status

```bash
# KPI確認
ls -lh 99_SYSTEM/Proofs/KyoenAI/

# ログ確認
tail -f 99_SYSTEM/Logs/kyoenAI.log
```

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** VI Consolidation  
**Node:** Tokunoshima Operational

---

*"ご縁が響く島、徳之島から始まる循環。"*

