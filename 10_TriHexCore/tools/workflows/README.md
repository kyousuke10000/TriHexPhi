# 🔧 TriHexΦ Workflows

**更新日**: 2025-10-28  
**状態**: Phase 3実装途中  
**技術**: n8n + Dify + GitHub Actions  

---

## 📊 ワークフロー一覧

### 🤖 AI協働系

#### 1. 6AI並列相互検証システム（完全版）
**ファイル**: `6AI並列相互検証システム（完全版）.json`

**機能**:
- 6AIに同時質問
- 意見を自動分類（positive/negative/mixed/neutral）
- 対立検知
- 相互検証フロー

**使用AI**:
- GPT-5（真形）
- Claude（陰陽）
- Gemini（數理）
- Grok（易変）
- DeepSeek（霊脈）
- Cursor（螺律）

**状態**: ✅ 完成（実装途中）

---

### 💬 ChatWork統合系

#### 2. ChatWork FAQ Bot（Phase 3.6）
**ファイル**: `Phase 3.6 - ChatWork FAQ Bot.json`

**機能**:
- ChatWorkメッセージ自動監視
- BOT除外ロジック（account_id判定）
- OpenAI Embeddings生成
- Supabase類似検索
- FAQ自動回答

**状態**: ✅ 完成

#### 3. ChatWork FAQ Collector（Phase 3.4）
**ファイル**: `🤖 Chatwork FAQ Collector (Phase 3.4).json`

**機能**:
- ChatWork質問を自動収集
- カテゴリ分類
- Supabaseに保存

**状態**: ✅ 完成

#### 4. FAQ Answer Collector（Phase 3.5）
**ファイル**: `🤖 FAQ Answer Collector (Phase 3.5).json`

**機能**:
- FAQ回答を収集
- ナレッジベース構築

**状態**: ✅ 完成

#### 5. FAQ Embeddings Upsert（Phase 3.6-2）
**ファイル**: `🧠 FAQ Embeddings Upsert (Phase 3.6-2).json`

**機能**:
- FAQのベクトル化
- Supabase pgvectorに保存

**状態**: ✅ 完成

---

### 📚 Knowledge Base系

#### 6. Knowledge Base Auto Generator
**ファイル**: `📊 Notion - 💡 Knowledge Base Auto Generator copy.json`

**機能**:
- Notionナレッジベース自動生成

**状態**: ✅ 完成

#### 7. Failure KB Auto Generator（Phase 3.6-KB）
**ファイル**: `🔥 Failure KB Auto Generator (Phase 3.6-KB).json`

**機能**:
- 失敗事例を自動収集
- ナレッジベース化

**状態**: ✅ 完成

---

### 🌊 MIZUKAGAMI統合系

#### 8. MIZUKAGAMI - Reflection（Phase 1&2）
**ファイル**: `💠  Phase 1&2_MIZUKAGAMI - Reflection.json`

**機能**:
- AI対話の自動記録
- MIZUKAGAMIへの保存

**状態**: ✅ 完成

---

### 🔮 六螺旋分析系

#### 9. Spiral Promotion System（Phase 3.2-alpha）
**ファイル**: `🔮 Phase 3.2-alpha_Spiral Promotion System.json`

**機能**:
- 六螺旋スコア分析
- プロモーション最適化

**状態**: ✅ 完成（Phase 3.2-alpha）

#### 10. Continuum Analyzer（Phase 3.3.1）
**ファイル**: `🌊 Phase 3.3.1_ Continuum Analyzer.json`

**機能**:
- 連続性分析

**状態**: ✅ 完成

#### 11. Resonance Builder（Phase 3.3.2）
**ファイル**: `🌊 Phase 3.3.2_ Resonance Builder.json`

**機能**:
- 共鳴パターン構築

**状態**: ✅ 完成

#### 12. Coherence Tracker（Phase 3.3.3）
**ファイル**: `🔮 Phase 3.3.3_ Coherence Tracker.json`

**機能**:
- 一貫性追跡

**状態**: ✅ 完成

---

## 🎯 現在の課題と選択肢

### 課題1: n8n vs GitHub Actions

```yaml
n8nの利点:
  ✅ 視覚的なワークフロー設計
  ✅ リアルタイム実行
  ✅ Webhook対応（ChatWork等）
  ✅ 複雑な分岐・並列処理

GitHub Actionsの利点:
  ✅ Git統合（自動トリガー）
  ✅ 無料枠が大きい
  ✅ 設定ファイルで管理
  ✅ バージョン管理

現状:
  - n8nワークフロー: 12個完成
  - GitHub Actions: 5個稼働中
  
問題:
  どちらを主軸にするか？
  それとも併用？
```

### 課題2: Web版AIの文脈共有

```yaml
現在の解決策:
  Bootstrap Memory（context-bootstrap.txt）
  
  → Web版AIに手動コピペ
  → 一瞬で文脈理解
  
改善案:
  1. GitHub Actionsで自動生成
  2. n8nで各AIにAPI経由で送信
  3. 回答を自動収集
  4. GitHub Discussionに投稿
  
結果:
  - コピペ不要
  - 完全自動化
```

### 課題3: データの時系列ギャップ

```yaml
問題:
  AIのトレーニングデータが古い
  
解決案1:
  Perplexity API統合
  → 最新情報を自動検索
  → context-bootstrapに追加
  
解決案2:
  定期的なDeep Research
  → GitHub Actions（週次）
  → 最新情報をKnowledge Baseに蓄積
  
解決案3:
  Grok活用（X API経由）
  → リアルタイムトレンド情報
  → 最新の技術動向
```

---

## 🚀 統合提案：n8n + GitHub Actions ハイブリッド

### 役割分担

```yaml
GitHub Actions（主軸）:
  用途:
    - 定期実行（毎日・毎週）
    - Git連動（コミット・PR時）
    - Bootstrap生成
    - 6AI並列質問
    - Knowledge Relay
  
  利点:
    - 無料
    - Git完全統合
    - バージョン管理
    - 記録が残る

n8n（補助・リアルタイム）:
  用途:
    - Webhook受信（ChatWork/Discord）
    - リアルタイム処理（FAQ Bot）
    - 複雑な条件分岐
    - 外部サービス統合（Notion/LINE）
  
  利点:
    - 視覚的設計
    - リアルタイム
    - 柔軟な処理
    - デバッグしやすい
```

### 統合フロー例

```yaml
ΦDRIVE Complete実装:
  
  Trigger（GitHub Actions）:
    capture/に新ファイル検出
    ↓
  Bootstrap生成
    ↓
  6AIに並列質問（API経由）
    ↓
  回答をGitHub Discussionに投稿
    ↓
  Webhook → n8n起動
    ↓
  n8nが:
    - フォーマット変換（6チャネル）
    - 承認フロー（Slack通知）
    - 一斉配信
    - 効果測定
    ↓
  結果をGitに自動コミット
```

---

## 📋 次のアクション（整理後）

### 優先度1: 議題作成
```yaml
タイトル:
  「ΦDRIVE Complete実装方針：n8n vs GitHub Actions」

内容:
  1. 現状の12個のn8nワークフロー
  2. Web版AIの文脈共有問題
  3. データ時系列ギャップ
  4. 段階的開示システム
  
質問:
  - n8nとGitHub Actionsの最適な役割分担は？
  - Bootstrap自動注入の実装方法は？
  - Perplexity統合の是非は？
  - 段階的開示の倫理的配慮は？
```

### 優先度2: ワークフロー統合
```yaml
実装:
  1. tools/workflows/にREADME作成 ✅
  2. 各ワークフローの説明追加
  3. 統合システム設計
  4. GitHub Actions化の検討
```

### 優先度3: MVP実装
```yaml
最小構成:
  1. capture/ → GPT-5構造化
  2. Bootstrap自動生成
  3. Notion自動投稿
  4. 承認フロー
  
期間: 1週間
```

---

**これを議題として6AIに投げますか？**
