# 📝 Capture（Cursor一次ログ）

**役割**: Cursorの作業記録・一次ログの保管場所

---

## 🎯 使い方

### 1. 新規ログの作成

**`_inbox/` に `kind: log` で作成**：

```yaml
---
trihex:
  kind: log
  lang: ja
  date: 2025-10-28
  title: "作業記録タイトル"
  author: Cursor
  status: draft
---
```

Janitorが自動で `capture/` に移動します。

---

### 2. このディレクトリの役割（Knowledge Relay）

```
Step 1: Capture（ここ）
  ↓
  Cursorの一次記録
  
Step 2: Structure
  ↓
  GPT-5が構造化
  
Step 3: Insight
  ↓
  各AI専門家が深化
  
Step 4: Memory
  ↓
  MIZUKAGAMI永続化
```

---

## 📋 ファイルの流れ

```
1. _inbox/ に kind: log で作成
   └→ Janitor自動移動
   
2. capture/ に保存される（ここ）
   └→ spiral_scan.py でスキャン
   
3. GPT-5レビュー依頼Issue自動生成
   └→ しりゅうがGPT-5に送付
   
4. GPT-5が構造化
   └→ structure/ に移動
```

---

## 🔧 自動処理（予定）

- **spiral_scan.py**: 六螺旋スコア計算
- **cause_profile.py**: 真因プロファイル生成
- **ai_sync.yml**: 毎日09:00 JSTに差分処理

---

## 📚 関連ドキュメント

- [configs/trihex.routes.yml](../configs/trihex.routes.yml) - ルーティング規則
- [structure/README.md](../structure/README.md) - 次のステップ
- [tools/README.md](../tools/README.md) - スキャンツール

---

**作成**: 2025-10-28  
**Knowledge Relay**: Step 1

