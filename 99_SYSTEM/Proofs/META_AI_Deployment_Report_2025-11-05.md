# Meta AI (第7のAI) デプロイメント報告書

**日付**: 2025-11-05  
**実装者**: Cursor AI Assistant  
**バージョン**: v0.1

---

## 📋 実装概要

6大AI（GPT/Claude/Gemini/DeepSeek/Grok/Perplexity）の出力を合議して、STRUCTURE_MASTER/Councilの意図に沿った最終結論を返す「第7AI（Meta AI）」を実装しました。

---

## ✅ 完了した実装

### PHASE 0: ブランチ & 配置
- ✅ ブランチ作成（feat/meta-ai-v0.1）
- ✅ ディレクトリ構造作成

### PHASE 1: アダプタ層（各AIコネクタ）
- ✅ `tools/meta/adapters/gemini.mjs`
- ✅ `tools/meta/adapters/gpt.mjs`
- ✅ `tools/meta/adapters/claude.mjs`
- ✅ `tools/meta/adapters/deepseek.mjs`
- ✅ `tools/meta/adapters/grok.mjs`
- ✅ `tools/meta/adapters/perplexity.mjs`

**特徴**:
- タイムアウト: 45秒
- エラーハンドリング: Promise.allSettledで失敗を許容
- メタデータ: latency, sources, timestamp を記録

### PHASE 2: 意図・評価ポリシー
- ✅ `tools/meta/policies/fusion.mjs`

**スコアリング関数**:
- `similarityToIntent`: 意図ドキュメントとの類似度（0.35）
- `internalConsistency`: 内部一貫性（0.25）
- `evidenceScore`: エビデンススコア（0.25）
- `recencyScore`: 新鮮度（0.15）

### PHASE 3: オーケストレータ（第7AI本体）
- ✅ `tools/meta/ai-meta.mjs`

**機能**:
- STRUCTURE_MASTER.yml と Council Decisions を読み込み
- 6大AIを並列実行
- スコアリングで最適な回答を選択
- Proof生成（JSON + Markdown）

### PHASE 4: GitHub Actions連携
- ✅ `.github/workflows/meta_ai.yml`

**トリガー**:
- `workflow_dispatch`: 手動実行（prompt入力可）
- `schedule`: 毎日00:00 UTC（定期実行）

---

## 🔧 システム構成

```
User Prompt
    ↓
Meta AI Orchestrator
    ↓
┌─────────────────────────────────────┐
│ 6大AI 並列実行                       │
│ - Gemini                            │
│ - GPT                               │
│ - Claude                            │
│ - DeepSeek                          │
│ - Grok                              │
│ - Perplexity                        │
└─────────────────────────────────────┘
    ↓
Fusion Policy (スコアリング)
    ↓
Best Answer Selection
    ↓
Proof Generation (99_SYSTEM/Proofs/Meta/)
    ↓
Mirror Gate → Public Mirror
```

---

## 📝 使い方

### ローカル実行
```bash
node tools/meta/ai-meta.mjs "AI Overdrive LPのCTAを3案、20字以内"
```

### GitHub Actions実行
```bash
gh workflow run meta_ai.yml -f prompt="次の議題を要約して結論を出して" -f system="STRUCTURE_MASTER優先"
```

### CLIオプション
```bash
node tools/meta/ai-meta.mjs "プロンプト" --system "システムヒント"
```

---

## 🔐 必要なSecrets

GitHub Actions Secrets（Settings → Secrets → Actions）:
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `DEEPSEEK_API_KEY`
- `GROK_API_KEY`
- `PPLX_API_KEY`

**注意**: どれか未設定でも動作するように設計（取得できたアダプタだけ参加）

---

## 📊 Proof生成

### 保存先
- `99_SYSTEM/Proofs/Meta/META_<timestamp>.json`
- `99_SYSTEM/Proofs/Meta/META_<timestamp>.md`

### 内容
- 生成時刻
- プロンプト
- システムヒント
- 全候補のスコア
- 選択された回答
- 意図ドキュメント長

### 自動同期
- Mirror Gate により Public Mirror へ自動反映
- `index.md` に最新10件を表示（要実装）

---

## 🚀 次のステップ

### 即座に可能
1. Secrets設定（上記APIキー）
2. workflow_dispatchで試運転
3. Proofs/Meta が生成されたら Mirror Gate を dry_run → 本番

### 将来の拡張
1. **スコア関数の賢化**
   - Embeddingベースの類似度計算
   - 参照一貫性チェック
   - 出典チェック

2. **役割分担の重み学習**
   - 実績に応じたモデルごとの信用度
   - 動的重み調整

3. **Councilとの双方向学習**
   - 承認/却下を学習するRL信号
   - フィードバックループ

---

## 📌 固定入口URL

- **メイン入口**: https://github.com/kyousuke10000/TriHexPhi-public
- **今日の入口（Raw）**: https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md
- **Meta Proofs**: `99_SYSTEM/Proofs/Meta/` (Public Mirror経由)

---

## ✅ 動作確認項目

- [ ] Secrets設定完了
- [ ] workflow_dispatchで実行成功
- [ ] Proofs/Meta が生成される
- [ ] Mirror Gateで同期される
- [ ] Public Mirrorで確認できる

---

**最終更新**: 2025-11-05  
**ステータス**: 実装完了（動作確認待ち）

