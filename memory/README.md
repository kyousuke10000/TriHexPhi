# 🗄️ Memory（MIZUKAGAMI永続化）

**役割**: 承認された知識の永続保存

---

## 🎯 役割（Knowledge Relay Step 4）

```
insight/ で status: final になった知識を、
MIZUKAGAMIとSupabaseに永続保存。

目的:
- 長期記憶
- 全AI共有
- 検索可能
- バージョン管理
```

---

## 📋 保存形式

```yaml
---
trihex:
  kind: doc
  lang: ja
  date: 2025-10-28
  title: "永続化タイトル"
  author: GPT5
  status: final
  
  # 全レビュー完了
  reviewed_by:
    - Claude
    - Gemini
    - Grok
    - DeepSeek
  
  # MIZUKAGAMI ID
  mizukagami_id: "mzk_xxxxxxxxxxxx"
  
  # Supabase ID
  supabase_id: "uuid-xxxx-xxxx-xxxx-xxxx"
---
```

---

## 🔄 フロー

```
1. insight/ から status: final を受け取り

2. memory/ に保存

3. MIZUKAGAMI連携（将来実装）
   - Chrome拡張
   - Supabase同期

4. 週次同期（Knowledge Auto-Sync）
   - 最新知識マップ生成
   - 各AIに配布
```

---

## 📚 関連ドキュメント

- [insight/README.md](../insight/README.md) - 前のステップ
- [10_CAPTURE_MIZUKAGAMI/](../10_CAPTURE_MIZUKAGAMI/) - MIZUKAGAMI連携

---

**作成**: 2025-10-28  
**Knowledge Relay**: Step 4 (Final)

