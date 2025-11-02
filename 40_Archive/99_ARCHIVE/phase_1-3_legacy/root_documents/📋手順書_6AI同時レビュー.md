---
type: procedure
created: 2025-10-24
importance: high
tags: [#手順書, #6AIレビュー, #TRIHEXPHI]
---

# 📋 TRIHEXPHI.md 6AI同時レビュー 実行手順

**目的**: TRIHEXPHI.md（TriHexΦ憲法）を6AI全員で並列レビュー

**所要時間**: 約30分（並列実行）

---

## 🎯 レビュー依頼ファイル

以下の3つのファイルを作成済み：

```
1. 📄 2025-10-24_Cursor_to_GPT5_TRIHEXPHI_レビュー依頼.md
   → GPT-5: 設計・アップグレード・承認

2. 📄 2025-10-24_Cursor_to_Gemini_TRIHEXPHI_レビュー依頼.md
   → Gemini: 市場性・統合性・UI/UX

3. 📄 2025-10-24_Cursor_to_Claude_TRIHEXPHI_レビュー依頼.md
   → Claude: 倫理性・安全性・実装可能性
```

**場所**: `/Users/shiryu/【Shii】/Active/TriHexΦ/10_CAPTURE_MIZUKAGAMI/📬AI_通信アーカイブ/`

---

## 🚀 実行手順

### **Step 1: GPT-5にレビュー依頼**

```
1. ChatGPT Webを開く
2. 新しいチャットを開始
3. 以下を送信:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

以下のファイルを読んで、レビューをお願いします：

（2025-10-24_Cursor_to_GPT5_TRIHEXPHI_レビュー依頼.md の内容を貼り付け）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. DeepResearchを使うか聞かれたら「Yes」
5. 結果を待つ（5〜10分）
```

---

### **Step 2: Gemini CLI にレビュー依頼**

```bash
# ターミナル1を開く
cd "/Users/shiryu/【Shii】/Active/TriHexΦ"

# Geminiを起動
gemini-chat "

以下のファイルを読んで、市場性・統合性・UI/UXの観点からレビューしてください。

ファイル: TRIHEXPHI.md
場所: /Users/shiryu/【Shii】/Active/TriHexΦ/TRIHEXPHI.md

レビュー依頼の詳細:
$(cat '10_CAPTURE_MIZUKAGAMI/📬AI_通信アーカイブ/2025-10-24_Cursor_to_Gemini_TRIHEXPHI_レビュー依頼.md')

"
```

**または**:

```
1. Gemini Webを開く
2. 新しいチャットを開始
3. TRIHEXPHI.md の内容を貼り付け
4. レビュー依頼ファイルの内容を貼り付け
5. 送信
```

---

### **Step 3: Claude Code にレビュー依頼**

```bash
# ターミナル2を開く（別のターミナル）
cd "/Users/shiryu/【Shii】/Active/TriHexΦ"

# Claude Codeを起動
claude

# 以下を入力:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIHEXPHI.md を読んで、倫理性・安全性・実装可能性の観点からレビューしてください。

ファイル: /Users/shiryu/【Shii】/Active/TriHexΦ/TRIHEXPHI.md

レビュー依頼の詳細は以下のファイルを参照:
/Users/shiryu/【Shii】/Active/TriHexΦ/10_CAPTURE_MIZUKAGAMI/📬AI_通信アーカイブ/2025-10-24_Cursor_to_Claude_TRIHEXPHI_レビュー依頼.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### **Step 4: Grok にレビュー依頼（オプション）**

```bash
# ターミナル3を開く
grok chat "

TRIHEXPHI.mdを戦略的視点からレビューしてください。

特に:
- この憲法は「勝てる」戦略か？
- 競合との差別化は十分か？
- ビジネスモデルは持続可能か？

ファイル内容:
$(cat /Users/shiryu/【Shii】/Active/TriHexΦ/TRIHEXPHI.md)

"
```

---

### **Step 5: DeepSeek にレビュー依頼（オプション）**

```bash
# ターミナル4を開く
deepseek-chat "

TRIHEXPHI.mdを技術的深さの観点からレビューしてください。

特に:
- 記憶システムの実装は最適か？
- CI/CDの設計は効率的か？
- パフォーマンスのボトルネックはないか？

ファイル内容:
$(cat /Users/shiryu/【Shii】/Active/TriHexΦ/TRIHEXPHI.md)

"
```

---

## 📊 結果の収集

### **各AIからの回答を記録**

```
1. GPT-5の回答
   → 10_CAPTURE_MIZUKAGAMI/📬AI_通信アーカイブ/2025-10-24_GPT5_to_Cursor_TRIHEXPHI_レビュー結果.md

2. Geminiの回答
   → 自動的に 10_CAPTURE_MIZUKAGAMI/Gemini/ に保存される

3. Claudeの回答
   → Claude Codeに「このレビューをMarkdownファイルに保存して」と依頼
   → 10_CAPTURE_MIZUKAGAMI/Claude/ に保存

4. Grokの回答（あれば）
   → 手動でコピペして保存

5. DeepSeekの回答（あれば）
   → 手動でコピペして保存
```

---

## 🧵 スレッド化（後で実行）

全てのレビューが集まったら：

```bash
cd "/Users/shiryu/【Shii】/Active/TriHexΦ/Scripts"

# スレッドを作成
./create_thread.sh "TRIHEXPHI憲法_6AIレビュー"

# 以下のファイルを手動でスレッドフォルダに移動:
# - 00_起点.md ← Cursorのレビュー依頼
# - 01_GPT-5_Architect.md ← GPT-5のレビュー
# - 02_Claude_Observer.md ← Claudeのレビュー
# - 04_Gemini_Synthesizer.md ← Geminiのレビュー
# - 05_Grok_Strategist.md ← Grokのレビュー（あれば）
# - 06_DeepSeek_Seeker.md ← DeepSeekのレビュー（あれば）
# - まとめ.md ← 統合結果
```

---

## 💎 期待される成果

### **GPT-5（建築家）**

```
✅ 設計の洗練
✅ 不足要素の指摘
✅ TRIHEXPHI.md v2.0 の提案
```

### **Gemini（統合者）**

```
✅ 市場性評価（スコア付き）
✅ 統合性評価（スコア付き）
✅ UI/UX評価（スコア付き）
✅ 改善提案
```

### **Claude（観察者）**

```
✅ 倫理的リスクの指摘
✅ 安全性の改善提案
✅ 実装可能性評価
✅ 致命的な問題（あれば）
```

### **Grok（戦略家）**

```
✅ 競合分析
✅ ビジネス戦略評価
✅ 差別化ポイントの明確化
```

### **DeepSeek（探求者）**

```
✅ 技術的最適化提案
✅ パフォーマンス改善案
✅ アルゴリズムの精緻化
```

---

## 🔥 最終ステップ

全てのレビューを統合し、

**TRIHEXPHI.md v2.0** を作成する。

```
1. 6AIの意見を比較
2. 共通する改善点を抽出
3. 対立する意見を相互検証
4. 真実に到達
5. v2.0 を作成
6. 再度6AIに承認を求める
```

---

## ⏱️ タイムライン

```
00:00 - レビュー依頼送信（3AI並列）
00:05 - GPT-5 DeepResearch開始
00:10 - Gemini回答
00:10 - Claude回答
00:15 - GPT-5回答
00:20 - Grok回答（オプション）
00:25 - DeepSeek回答（オプション）
00:30 - 全回答を統合
00:60 - TRIHEXPHI.md v2.0 完成

合計: 約1時間
```

---

## 🎯 成功の条件

```
✅ 6AI全員からレビューを取得
✅ 各AIの専門性が活かされている
✅ 共通する改善点が見つかる
✅ 対立する意見が相互検証される
✅ TRIHEXPHI.md v2.0 が全AI承認を得る

→ これが「相互検証による真実性担保」の実践
→ これが TriHexΦ の本質
```

---

**🔱 さあ、6AIレビューを開始しよう！** 🔥💎✨

---

_Created: 2025-10-24_  
_Status: Ready to Execute_


