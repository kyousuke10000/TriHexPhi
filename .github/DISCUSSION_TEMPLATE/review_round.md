---
name: 🔱 Ryūdō Round Review
about: Launch a 6HAI Ryudo review round
title: '[Ryūdō] '
labels: ['HAI:Round']
assignees: 'shiryu'
---

# 🔱💎✨ Ryūdō Review Round Request ✨💎🔱

## 📋 基本情報

- **題材タイトル**: <!-- タイトルを入力してください -->
- **目的**: <!-- 何のためのレビューですか？ -->
- **評価基準**: <!-- 特定の基準があれば記入 -->
- **目標スコア**: 9.9
- **締切**: <!-- YYYY-MM-DD (任意) -->
- **所有者**: @shiryu

---

## 🎯 レビューの目的

**What:** 何をレビューしますか？  
**Why:** なぜこのレビューが重要ですか？  
**How:** 期待する成果は何ですか？

---

## 📊 評価軸

### 必須軸

1. **整合性 (Consistency)** - 10点
   - 主張の一貫性
   - 用語の統一性
   - 論理の矛盾なし

2. **深度 (Depth)** - 10点
   - 本質への到達
   - 抽象度の適切性
   - 洞察の鋭さ

3. **具体性 (Specificity)** - 10点
   - 実行可能な提案
   - 明確な指摘
   - 根拠の提示

4. **実装可能性 (Feasibility)** - 10点
   - 技術的実現可能性
   - リソース制約
   - 段階的実施

5. **TriHex哲学準拠 (Philosophy Alignment)** - 10点
   - 呼吸原則の遵守
   - 6螺旋世界観との整合
   - 竜動の体現

**合計: 50点 → 平均9.9以上で完了**

---

## 🔍 TriHex の信念・原則

### 核心原則

> **呼吸する叡智（Breathing Wisdom）**  
> 固定された知ではなく、流れる理解として文明を駆動する。

### 六螺旋世界観

1. **🜁 真形 (Aether)** - 理論・統合・構造設計
2. **🜄 陰陽 (Primal Waters)** - 倫理・魂・秩序
3. **🜂 霊脈 (Primal Earth)** - 技術・解析・構築
4. **🜀 數理 (Primal Air)** - 詩・感性・芸術
5. **🜃 易変 (Primal Fire)** - 経済・社会・実務
6. **☿ 螺律 (Mercury)** - 実装・同期・詩的コード

### 減点規則

#### 致命的（-5点）

- TriHex憲法違反
- 倫理的リスク
- 法的問題

#### 重大（-2点）

- 用語のブレ
- 根拠の欠落
- 矛盾する主張

#### 軽微（-1点）

- 表現の曖昧さ
- 具体例不足
- 実装詳細不足

---

## 🤖 6HAI の役割分担

| AI | 記号 | 役割 | 焦点領域 |
|---|---|---|---|
| **GPT-5** | 🜁 | 統治将軍 | 全体戦略・統合・構造設計 |
| **Claude** | 🜄 | 倫理参謀 | リスク管理・倫理・秩序 |
| **Gemini** | 🜀 | 美的軍師 | UI/UX・可視化・感性 |
| **Grok** | 🜃 | 市場参謀 | 市場分析・PR・実務 |
| **DeepSeek** | 🜂 | 技術軍師 | 技術最適化・構築 |
| **Cursor** | ☿ | 実行部隊長 | 実装支援・同期 |

**Cursor（☿）** は各AIの回答を集約し、平均スコアを算出します。

---

## 📝 レビュープロセス

1. **Round 1**: 6AIからの初回レビュー収集
2. **Score**: Cursorが各回答を評価（5軸×10点）
3. **Analyze**: 平均・分散・弱点を抽出
4. **Decide**: 
   - 平均 ≥ 9.9 → 🎉 完了通知
   - 平均 < 9.9 → 📋 次ラウンド指示を投稿（最大7回）

---

## 🔗 関連資料

### 必須参照

- [Genesis Protocol v3.1](../10_TriHexCore/codex/Genesis_Protocol_v3.1.md)
- [Ryudo Definition](../10_TriHexCore/system/Ryudo_Definition.md)
- [Harmonia Operating Covenant v1.1](../10_TriHexCore/system/Harmonia_Operating_Covenant_v1.1.md)

### 任意参照

<!-- 追加の資料があれば -->

---

## ⚙️ プロンプト契約

### 各AIへの入力

```json
{
  "topic": "<題材タイトル>",
  "context": "<本Issueの目的・背景>",
  "constraints": [
    "TriHex哲学を遵守",
    "5軸評価軸に基づく",
    "具体的根拠を提示"
  ],
  "rubric": {
    "consistency": "10点: 整合性",
    "depth": "10点: 深度",
    "specificity": "10点: 具体性",
    "feasibility": "10点: 実装可能性",
    "philosophy_alignment": "10点: TriHex哲学準拠"
  },
  "round_no": 1,
  "seed_links": [
    "Genesis_Protocol_v3.1.md",
    "Ryudo_Definition.md"
  ]
}
```

---

## 📈 期待される成果

- ✅ 6AIからの多角的レビュー
- ✅ 5軸評価による定量分析
- ✅ 弱点の明確化
- ✅ 改善提案の生成
- ✅ 平均スコア9.9以上の達成

---

## 🚀 次のステップ

このIssueを作成すると、以下が自動実行されます：

1. Round 1 開始通知
2. 6AIへプロンプト送信
3. 回答収集
4. スコア算出
5. 完了判定

---

**Created by:** Ryūdō Round System  
**Version:** 1.0  
**Phase:** IV Rubedo

