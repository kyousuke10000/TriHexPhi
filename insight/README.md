# 💡 Insight（専門家深化）

**役割**: 各AI専門家による洞察・深化

---

## 🎯 4つの観点

```
insight/
├─ ethics/      # Claude（倫理ゲート）
├─ beauty/      # Gemini（体験設計）
├─ strategy/    # Grok（探求戦略）
└─ tech/        # DeepSeek（最適化）
```

---

## 📋 各ディレクトリの役割

### ethics/ - Claude

```
観点:
- 倫理的妥当性
- プライバシー保護
- 表現リスク
- 真実性憲法との整合性
```

### beauty/ - Gemini

```
観点:
- 読者体験
- わかりやすさ
- 視覚的要素
- 感情的インパクト
```

### strategy/ - Grok

```
観点:
- 市場戦略
- PR効果
- 実現可能性
- リスク管理
```

### tech/ - DeepSeek

```
観点:
- 技術的正確性
- 最適化
- 効率性
- 実装詳細
```

---

## 🔄 フロー

```
1. structure/ から受け取り

2. 各AI専門家がレビュー
   - 自分の観点で深化
   - Truth-Header付き
   - status: review

3. しりゅうが確認

4. status: final に変更

5. memory/ へ永続化
```

---

## 📚 関連ドキュメント

- [structure/README.md](../structure/README.md) - 前のステップ
- [memory/README.md](../memory/README.md) - 次のステップ

---

**作成**: 2025-10-28  
**Knowledge Relay**: Step 3

