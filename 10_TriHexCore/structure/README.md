# 🏗️ Structure（GPT構造化）

**役割**: GPT-5による構造化・整理された記録

---

## 🎯 役割（Knowledge Relay Step 2）

```
capture/ の一次ログを受け取り、
GPT-5が以下を実行:

1. 構造化（見出し、分類）
2. 六螺旋スコア付与
3. 真因プロファイル生成
4. 次のAI担当者決定
```

---

## 📋 ファイル構造

```yaml
---
trihex:
  kind: summary
  lang: ja
  date: 2025-10-28
  title: "構造化タイトル"
  author: GPT5
  status: review
  
  # 六螺旋スコア（spiral_scan.pyの出力）
  spiral_scores:
    autonomy: 0.8
    connection: 0.6
    growth: 0.7
    purpose: 0.9
    identity: 0.5
    liberation: 0.4
  
  # 真因プロファイル
  cause_profile:
    primary: "purpose"
    phase: "search"
    intensity: 0.9
  
  # 次のステップ
  next_reviewers:
    - Claude    # 倫理観点
    - Gemini    # 体験設計
---
```

---

## 🔄 フロー

```
1. capture/ から受け取り

2. GPT-5が構造化
   - 見出し整理
   - 分類
   - メタデータ付与

3. spiral_scan.py でスキャン
   - 六螺旋スコア計算
   - 真因プロファイル生成

4. 各AIに振り分け
   - insight/ethics/    (Claude)
   - insight/beauty/    (Gemini)
   - insight/strategy/  (Grok)
   - insight/tech/      (DeepSeek)
```

---

## 📚 関連ドキュメント

- [capture/README.md](../capture/README.md) - 前のステップ
- [insight/README.md](../insight/README.md) - 次のステップ
- [tools/spiral_scan.py](../tools/spiral_scan.py) - スキャンツール

---

**作成**: 2025-10-28  
**Knowledge Relay**: Step 2

