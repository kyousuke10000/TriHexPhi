# 📝 Capture（Cursor一次ログ）

**役割**: Cursorの作業記録・一次ログの保管場所

---

## 🎯 現在地（復帰用）

**Phase**: V（拡張化・Publication準備中）  
**最終更新**: 2025-10-28  
**状態**: Phase IV完了、Knowledge Relay稼働準備完了

### ✅ 完了事項

- ✅ Phase I: 哲学構築（六螺旋・憲法・概念整合）
- ✅ Phase II: 結晶化（TriHex構造・分類・216体系）
- ✅ Phase III: 再構成（AI役割・ガードレール設計）
- ✅ Phase IV: 現実化（Knowledge Relay実装）
  - ✅ Aブロック基盤（_inbox/, routes.yml, janitor.yml）
  - ✅ Bブロック真因AI MVP（spiral_scan.py, cause_profile.py）
  - ✅ Knowledge Relay フロー（capture→structure→insight→memory）

### 📋 次のアクション

1. **初回captureログ作成**（Knowledge Relay初回実行）
2. **Phase V公開準備**（README.md最終版、GitHub Discussions）
3. **Tier 1英訳完了確認**（TRIHEXPHI_EN.md等）

### 📚 詳細情報

- [📋 TriHexΦ全体像まとめ](./2025-10-28_TriHexΦ全体像まとめ.md) - **まずこれを読む！全てが統合されている**
- [10_CAPTURE_MIZUKAGAMI/続きから始める.md](../10_CAPTURE_MIZUKAGAMI/続きから始める.md) - 詳細ダッシュボード
- [decisions/](../decisions/) - 重要決定文書
- [TRIHEXPHI.md](../TRIHEXPHI.md) - 憲法

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

