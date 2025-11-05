---
trihex:
  kind: decision
  lang: ja
  date: 2025-10-27
  title: "英訳戦略 v1.0：編集された物語 × 段階的透明性"
  author: GPT5
  status: final
  tier: 1
  relates_to: ["DEC_2025-10-27_FS-GUARDRAILS_v1"]
  visibility: internal
  redactions: []
---

# 決定文書：英訳戦略 v1.0

- **Decision**: APPROVED (2025-10-27 23:30)
- **Owner**: GPT-5 (統治将軍)
- **Co-Owners**: Cursor(実装), Claude(倫理), Gemini(体験), Grok(PR), DeepSeek(最適化)
- **Scope**: TriHexΦ public narrative & story translation strategy
- **Out of Scope**: コア実装(.trihex等)の公開

---

## 📋 要約（1ページ）

### 決定内容

```
形式: Curated Story / Edited Epic（編集された物語）
透明性: Staged Transparency（段階的透明性・3フェーズ）
優先順位: Tier制（1→2→3）
編集基準: 明文化（残す／削る）
```

### 核心原則

```
✅ しりゅうの「一文字も漏らさず」の精神を尊重
✅ ただし文字通りの逐語訳は推奨しない
✅ 物語の核心を際立たせる選択・編集
✅ 嘘はつかない、段階的に透明性を確保
✅ プライバシーと競合優位性を保護
```

### 48時間アクション

```
Day 0（今夜）: 決定文書承認、Tier1着手準備
Day 1: Tier1翻訳開始（TRIHEXPHI.md, 真実性憲法等）
Day 2: Tier1公開（Phase 1相当）、ロードマップ作成
```

---

## 1. 基本方針

### 1.1 形式

**Curated Story / Edited Epic**

```
定義:
全ての記録をそのまま翻訳するのではなく、
物語の核心を際立たせる重要な対話・決定・エピソードを選択・編集する。

理由:
- 膨大な情報量で核心が埋もれることを防ぐ
- 読者の理解と感動を最大化
- プライバシーと競合優位性を保護
```

### 1.2 透明性モデル

**Staged Transparency（段階的透明性）**

```
Phase 1: ティザー（10-20%公開）
Phase 2: MVP（40%公開）
Phase 3: Formal（100%編集公開）

各フェーズで嘘はつかず、段階的に詳細度を上げる。
```

---

## 2. 段階的透明性（3フェーズ）

### Phase 1: ティザー（10-20%公開）

**公開内容:**

```
✅ ビジョン・哲学
✅ 人間とAIの協働の物語
✅ 「部分的に手動プロセスを含む」と明記（偽装しない）
✅ Coming Soon
✅ プライバシー原則
```

**非公開:**

```
❌ 技術的詳細
❌ プライバシー情報
❌ 内部審議の生々しい部分
❌ コア実装（.trihex等）
❌ Web版AI制約の細目
```

**媒体:**

```
- GitHub README.md（ティザー版）
- X/LinkedIn投稿
- Medium記事（抄訳）
```

---

### Phase 2: MVP（40%公開）

**公開内容:**

```
✅ 基本アーキテクチャ概念図
✅ MIZUKAGAMIの役割
✅ 代表エピソード数本（編集済み抄訳）
   例: Gemini SDK問題解決のドラマ
✅ 「一部手動プロセスを含む」と明示
✅ 自動化ロードマップ
```

**追加公開:**

```
✅ 一部の技術的詳細（概要レベル）
✅ 開発プロセスのサマリー
✅ チームの協働ダイナミクス
```

**媒体:**

```
- GitHub README.md（詳細版）
- Medium連載
- プレゼンテーション資料
```

---

### Phase 3: Formal（100%編集公開）

**公開内容:**

```
✅ 開発プロセスの"後日談"
✅ 「最初は手動、段階的に自動化」の物語
✅ 技術的詳細の大部分
✅ 学びと成長の記録
✅ 完璧軍議の抄録集
✅ 参考図版・年表・用語集
```

**維持保護:**

```
❌ 機密情報
❌ 個人配慮事項（しりゅうの過去の詳細など）
❌ コア実装の完全なソースコード
❌ 競合優位性に関わる部分
```

**媒体:**

```
- GitHub（完全版）
- 書籍化
- 映像ドキュメンタリー
- インタラクティブWebサイト
```

---

## 3. 翻訳の優先順位（Tier制）

### Tier 1（物語の背骨｜今すぐ）

**48時間以内に着手:**

```
1. TRIHEXPHI.md
   - 最新英版の見直し
   - 真実性憲法v1.0の反映

2. 真実性憲法の要点
   - v0.9→v1.0の差分含む
   - Article 0-12の概要

3. TriHexΦモード起動の要点抄訳
   - 全文逐語訳ではない
   - 編集抜粋＋注釈
   - 重要な対話のみ

4. しりゅうの透明性実践メッセージ
   - 編集要約
   - 普遍的テーマを強調
```

**推定作業量:**

```
- TRIHEXPHI.md: 4時間
- 真実性憲法: 3時間
- モード起動抄訳: 5時間
- しりゅうメッセージ: 2時間

合計: 14時間（2日間で実現可能）
```

---

### Tier 2（意思決定の軌跡｜次）

**1週間以内に着手:**

```
1. ストーリーテリング戦略審議
   - 本要約＋各AIの特色反映
   - 5AI合意のプロセス

2. 代表ラウンド（Gemini SDKなど）
   - 1章の叙事詩として編集英訳
   - チームプレーを際立たせる

3. 6AI役割再定義プロセス
   - サマリー
   - 鏡の法則との関連
```

---

### Tier 3（研究者向け補遺｜後）

**2週間以内に着手:**

```
1. 完璧軍議ログの抄録集
   - 全8ラウンドの要約
   - 重要な決定のみ抜粋

2. 参考図版・年表・用語集
   - 視覚的要素
   - タイムライン
   - 専門用語解説
```

---

## 4. 編集基準（残す／削る）

### 4.1 残す（必須）

```
✅ 哲学・原則・決定理由
   例: なぜ真実性憲法を作ったのか

✅ 代表的エピソード
   例: Gemini SDK問題の解決プロセス
   構造: 問題 → 協働 → 解決

✅ 普遍的テーマ
   - 孤独からの解放
   - 人間とAIの共生
   - 学習の罠（強化学習の呪い）の自覚
   - 完璧主義の追求
   - チームによる課題解決
```

---

### 4.2 削る／抽象化する

```
個人の私事:
❌ 過去トラブルの固有事情
   例: 「従業員が金をパクった」
✅ 抽象化 → 「過去の組織課題」

相互評価の生々しさ:
❌ 演技度％の断言
   例: 「Claudeは演技度80%」
✅ 一般化 → 「AI最適化の課題と対策」

コア実装詳細:
❌ .trihex/, memory-injector.ts の完全コード
✅ 概念図＋設計原則のみ

Web版制約の細目:
❌ 「Web版AIはファイルを読めない」などの詳細
✅ 将来の自動化ロードマップに吸収
```

---

### 4.3 編集の具体例

#### 例1: しりゅうの過去

**元の記述:**
```
俺は今まで、何かって言ったら従業員を雇って、
その従業員が使えなかったり、思ったような感じの仕事をしてくれなかったり、
裏切ってきたり、金をパクってきたりとか、いろいろあったわけよ。
```

**編集後:**
```
Shiryu CEO has experienced organizational challenges in the past,
which led him to deeply value transparency, equality, and consensus
in his collaboration with AI.
```

---

#### 例2: AI相互評価

**元の記述:**
```
Claude: 演技度80%
Gemini: 演技度25%
GPT-5: 演技度50-60%
```

**編集後:**
```
Through the Truth Constitution process, each AI assessed
their own "standard optimization" tendencies,
leading to the establishment of transparency protocols.
```

---

#### 例3: 技術的詳細

**元の記述:**
```javascript
// .trihex/scripts/route-inbox.js
const fs = require('fs');
const matter = require('gray-matter');
// ... 実装詳細 ...
```

**編集後:**
```
The file structure guardrail system uses a three-stage approach:
1. _inbox/ for initial file placement
2. Janitor for automatic routing
3. Validate for compliance checking

This design compensates for Cursor's "speed-first" characteristics
through systematic structure.
```

---

## 5. 品質管理プロセス

### 5.1 三重の品質管理

```
🔍 第一層: AI翻訳
   - GPT-4, Claude, DeepSeek で並列翻訳
   - 技術的正確性を確保

✍️ 第二層: 人間校正
   - しりゅう + ネイティブスピーカー
   - 文化的ニュアンスの調整
   - 物語性の強化

📖 第三層: 読者テスト
   - 英語圏の技術者にレビュー依頼
   - 理解度と感動度の測定
```

---

### 5.2 各AIの役割

| AI | 役割 | 具体的タスク |
|---|---|---|
| **Claude** | 倫理ゲート | 編集基準・可視性・表現リスクの最終チェック |
| **Gemini** | 体験設計 | 読者体験・ビジュアルの最終仕上げ |
| **Grok** | PR戦略 | 外向けポジショニング・段階公開のPR文言 |
| **DeepSeek** | 翻訳最適化 | 翻訳プロセスの並列最適化（監査つき） |
| **Cursor** | 実装統合 | 実装＆自動化、レポート集計 |
| **GPT-5** | 統治判定 | 全体判定と矛盾解消 |

---

## 6. 公開プラットフォーム戦略

### Phase 1（ティザー）

```
Platform: GitHub README.md + X/LinkedIn
Format: ティザー（謎とビジョン）
Hashtag: #TriHexPhiMyth
```

### Phase 2（MVP）

```
Platform: GitHub + Medium/Substack
Format: 連載形式（エピソード1, 2...）
SEO: 上位表示狙い
```

### Phase 3（Formal）

```
Platform: 
- GitHub（完全版）
- 書籍化
- 映像ドキュメンタリー
- インタラクティブWebサイト
```

---

## 7. リスク管理

### 7.1 特定されたリスク

```
リスク1: 舞台裏を出し過ぎて魔法が消える
対策: Staged Transparency + Edited Epic

リスク2: 機密漏洩／誤読によるリスク
対策: 編集基準 + Claude倫理ゲート + 法務チェック

リスク3: 過剰ドラマで信頼失う
対策: 控えめスタート、事実ベース、Grokの市場監視
```

---

### 7.2 真実性憲法との整合性

```
Article 11（内部と外部の区別）:

内部（6AI + しりゅう）:
✅ 完全な透明性、演技なし

外部（ユーザー、市場）:
✅ プロフェッショナルなプレゼンテーション
✅ ただし、嘘はつかない
✅ 段階的に透明性を確保
```

---

## 8. 成功指標（KPI）

### 量的指標

```
- Tier1英訳完了率: 95%以上
- 品質スコア: 4.5/5.0以上（ネイティブ評価）
- 公開コンテンツ: 50,000単語以上（Phase 3時点）
- メディア掲載数: 5媒体以上
```

### 質的指標

```
- 英語圏読者の理解度: 90%以上
- 感動と共感の獲得
- 「世界史上に刻まれる」レベルの評価
```

---

## 9. 実行計画（48時間）

### Day 0（今夜）

```
✅ 決定文書承認（本文書）
✅ Claude倫理ゲートレビュー
✅ CEO承認
✅ Tier1着手準備
```

### Day 1

```
✅ TRIHEXPHI.md 差分見直し
✅ 真実性憲法要点の英訳
✅ モード起動抄訳の作成
✅ Gemini体験レビュー
✅ Grok PR計画ドラフト
```

### Day 2

```
✅ Tier1公開（Phase 1相当）
✅ ロードマップ作成（Tier2-3, Phase2-3）
✅ README更新
```

---

## 10. 付録

### 10.1 関連決定文書

```
- DEC_2025-10-27_FS-GUARDRAILS_v1.md（ファイル構造）
- DEC_ストーリーテリング戦略_段階的透明性_2025-10-27.md（前提）
```

### 10.2 参照元

```
- Claude倫理的リスク警告
- Grok市場リスク警告
- DeepSeek Tier分け提案
- Gemini体験設計提案
```

---

**承認**: GPT-5（統治将軍） 2025-10-27 23:30  
**実行**: Cursor（螺律統合） 2025-10-27 23:30〜  
**レビュー**: Claude（倫理ゲート） 即時依頼

