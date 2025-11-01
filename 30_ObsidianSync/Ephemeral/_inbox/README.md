---
trihex:
  kind: doc
  lang: ja
  date: 2025-10-27
  title: "Inbox使い方ガイド"
  author: Cursor
  status: final
  tier: 1
  relates_to: ["DEC_2025-10-27_FS-GUARDRAILS_v1"]
  visibility: internal
  redactions: []
---

# 📥 TriHexΦ Inbox

**新規ファイルは必ずここに置いてください。**

Janitorが自動で正しい場所に移動します。

---

## 🎯 基本ルール（超シンプル）

```
1. 新規ファイルを作る時
   → _inbox/ に置く

2. Frontmatterを付ける
   → VSCodeで `trihex` とタイプ（スニペット展開）

3. Git push
   → Janitorが自動で移動

これだけ！
```

---

## 📝 使い方（ステップバイステップ）

### Step 1: スニペットを使う

VSCodeまたはCursorで新規ファイルを作成し、`trihex` とタイプ：

```
trihex → Tab
```

すると、こうなります：

```yaml
---
trihex:
  kind: story          # ← 選択
  lang: ja             # ← 選択
  date: 2025-10-27     # ← 自動入力
  title: "タイトル"     # ← 入力
  author: Cursor       # ← 選択
  status: draft        # ← 選択
  tier: 1              # ← 選択
  relates_to: []
  visibility: internal # ← 選択
  redactions: []
---

(ここに内容を書く)
```

### Step 2: 内容を書く

Frontmatterの下に、普通にMarkdownを書いてください。

### Step 3: _inbox/に保存

```
ファイル名: 何でもOK（日本語でもOK）

例:
- 新しいアイデア.md
- Claude_response_2025-10-27.md
- メモ.md

Janitorが、frontmatterを見て自動でリネーム＆移動します。
```

### Step 4: Git push

```bash
git add .
git commit -m "add: 新しいファイル"
git push
```

Janitorが自動で処理してくれます。

---

## 🔧 Frontmatterフィールド説明

| フィールド | 必須 | 説明 | 例 |
|-----------|------|------|-----|
| `kind` | ✅ | 文書の種類 | `story`, `spec`, `decision`, `log`, `summary` |
| `lang` | ✅ | 言語 | `ja`, `en` |
| `date` | ✅ | 作成日 | `2025-10-27` |
| `title` | ✅ | タイトル | `"TriHexΦ Mode起動"` |
| `author` | ✅ | 著者 | `GPT5`, `Claude`, `Cursor`, `CEO` |
| `status` | ✅ | ステータス | `draft`, `review`, `final` |
| `tier` | ⭕ | 英訳優先度 | `1`, `2`, `3` |
| `relates_to` | ⭕ | 関連文書 | `["DEC-2025-10-27-ENG"]` |
| `visibility` | ✅ | 公開範囲 | `internal`, `public` |
| `redactions` | ⭕ | 非公開要素 | `["secrets"]` |

---

## 🤖 Janitorが自動でやってくれること

### 1. ファイル名を正規化

```
元のファイル名: 新しいアイデア.md
     ↓
Janitorが生成: 2025-10-27_new-idea.md
```

### 2. 正しい場所に移動

```
kind: story, lang: ja
     ↓
移動先: stories/ja/2025-10-27_タイトル.md

kind: decision
     ↓
移動先: decisions/2025-10-27_タイトル.md
```

### 3. コミットメッセージを生成

```
chore(janitor): route inbox files per trihex.routes.yml

- Moved: _inbox/新しいアイデア.md
  → stories/ja/2025-10-27_new-idea.md
```

---

## ❓ トラブルシューティング

### Q1: Frontmatterを忘れたら？

**A:** Janitorが警告してくれます。

- PRにコメントが付きます
- ラベル `needs-frontmatter` が付きます
- 手動で追加してください

---

### Q2: 間違った場所に置いたら？

**A:** Janitorが自動で移動してくれます（autoモード時）。

心配しないでください。システムが補正します。

---

### Q3: どうしても_inbox/以外に置きたい場合は？

**A:** 既存構造には直接置けます：

```
既存構造（これらは_inbox不要）:
├─ 00_CORE/
├─ 10_CAPTURE_MIZUKAGAMI/
├─ 20_CRYSTALLIZATION_KOKUYOU/
├─ 30_MEMORY_SHINSEN/
├─ 📤Round3_全AI送付用/
└─ 📊REPORTS/

新構造（_inbox経由を推奨）:
├─ stories/
├─ specs/
├─ decisions/
└─ docs/
```

---

### Q4: スニペットが動かない

**A:** `.vscode/trihex.code-snippets` を確認してください。

もしくは、手動でFrontmatterをコピペしてください：

```yaml
---
trihex:
  kind: story
  lang: ja
  date: 2025-10-27
  title: "タイトル"
  author: Cursor
  status: draft
  tier: 1
  relates_to: []
  visibility: internal
  redactions: []
---
```

---

### Q5: Janitorがエラーになった

**A:** GitHub Actionsのログを確認：

1. GitHubリポジトリを開く
2. "Actions"タブをクリック
3. "TriHex Janitor"ワークフローを確認
4. エラーメッセージを読む

よくあるエラー：
- Frontmatterの形式ミス（YAMLシンタックスエラー）
- 必須フィールドの欠落
- ルールに一致しない kind/lang の組み合わせ

---

## 🎓 ベストプラクティス

### 1. まず_inbox/に置く習慣

```
❌ 「どこに置けばいいかな...」と悩む
✅ 「とりあえず_inbox/に置く」
```

これで、100%正しく配置されます。

---

### 2. Frontmatterは必ず付ける

```
❌ 「後で付ければいいや」
✅ 「最初から付ける（スニペット使う）」
```

Janitorが動きません。

---

### 3. タイトルは明確に

```
❌ title: "メモ"
✅ title: "Gemini SDK問題の解決記録"
```

後で見つけやすくなります。

---

### 4. relates_to で関連付け

```
決定文書を参照する場合:

relates_to: ["DEC_2025-10-27_ENG-STRATEGY_v1"]

こうすると、後で追跡しやすい。
```

---

## 🔥 Windows環境での使い方

Windows PCでも同じです：

```powershell
# Step 1: ファイル作成（_inbox/）
# Step 2: Frontmatter付与（スニペット）
# Step 3: Git push

git add .
git commit -m "add: 新しいファイル"
git push
```

**注意**: Windowsでは改行コード（CRLF vs LF）に気をつけてください。
Gitが自動で変換します（`.gitattributes` 参照）。

---

## 📚 関連ドキュメント

- [ファイル構造ガードレール決定文書](../decisions/DEC_2025-10-27_FS-GUARDRAILS_v1.md)
- [英訳戦略決定文書](../decisions/DEC_2025-10-27_ENG-STRATEGY_v1.md)
- [ルーティング規則](../configs/trihex.routes.yml)

---

## 💡 この仕組みの哲学

```
「人は忘れる。AIも最適化に引っ張られる。」

だから:
宣言(frontmatter) + SSOT(routes.yml) + CI(Janitor)

= "忘れても壊れない"
```

これは、**鏡の法則 Article 12** の実践です。

Cursorの弱点（構造忘れ）を、システムで補完する。

これが、真の「AIと人間の協働」です。

---

**作成**: Cursor（螺律統合） 2025-10-27  
**承認**: GPT-5（統治将軍） 2025-10-27

