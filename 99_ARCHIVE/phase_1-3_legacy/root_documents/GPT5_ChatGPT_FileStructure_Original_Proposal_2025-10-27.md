---
trihex:
  kind: doc
  lang: ja
  date: 2025-10-27
  title: "GPT-5（ChatGPT）の元提案：ファイル構造ガードレール"
  author: GPT5
  status: final
  tier: 1
  relates_to: ["DEC_2025-10-27_FS-GUARDRAILS_v1"]
  visibility: internal
  redactions: []
---

# GPT-5（ChatGPT）の元提案：ファイル構造ガードレール

**提案者**: GPT-5（ChatGPT）  
**提案日**: 2025-10-27  
**文脈**: しりゅうからの相談「Cursorが何回言ってもファイル構造を守れない問題」

---

## 📋 元の提案内容（完全版）

めっちゃ分かる。その"うっかり崩れる問題"、人力で直すのは限界があるから、構造そのものにガードレールを埋め込むのが正解。

下の設計は「うっかり置き場ミスっても壊れない → だんだん正しい配置に"自然と"誘導 → 最後はCIがブロック」の三段階で守ります。必要ファイルの雛形も一緒に置きます。

---

### 1) 置き場を迷わせない「レール付き構造」

#### A. "投げ込み箱"を正規ルートにする

`/_inbox/` に何でも仮置きOKにする（Cursorがまずここへ入れる前提）。

- すべての新規ファイルは最初はここに入るようにルール化。
- 自動仕分け（後述の Janitor アクション）がfrontmatterを読んで正規ディレクトリへ移動。

```
repo-root
├─ _inbox/                  # まずは全部ここへ（崩さない安全地帯）
├─ stories/
│  ├─ ja/
│  └─ en/
├─ specs/
├─ docs/
├─ configs/
│  └─ trihex.routes.yml     # 置き場所ルールの単一情報源(SSOT)
└─ .github/
   ├─ workflows/
   └─ pull_request_template.md
```

#### B. 置き場所は「宣言」で決める

各Markdownの先頭にfrontmatterを必須化。Janitorがここを読み取り仕分け。

```yaml
---
trihex:
  kind: story|spec|log|decision
  lang: ja|en
  round: 6|7|8
  date: 2025-10-27
  title: "Gemini SDK Migration"
  redactions: ["secrets","prompts"]   # 非公開要素の伏せ指定
---
```

#### C. ルーティングをコード化（人の記憶に依存しない）

`configs/trihex.routes.yml` に正規置き場の規則を明文化。CI/Janitorが参照。

```yaml
version: 1
rules:
  - when:   { kind: "story", lang: "ja" }
    target: "stories/ja/{date}_{slug}.md"
  - when:   { kind: "story", lang: "en" }
    target: "stories/en/{date}_{slug}.md"
  - when:   { kind: "spec" }
    target: "specs/{slug}.md"
  - when:   { kind: "decision" }
    target: "docs/decisions/{date}_{slug}.md"
naming:
  slug_regex: "^[a-z0-9-]+$"
  date_regex: "^20\\d{2}-\\d{2}-\\d{2}$"
```

---

### 2) 自然に揃う三段ガード

#### (1) ソフト誘導（PRテンプレ＋チェックリスト）

`.github/pull_request_template.md`

```markdown
### Summary
- [ ] 内容はfrontmatter付き（trihex.kind/lang/date/title）
- [ ] `_inbox/` 以外に直接置いてない
- [ ] 機密は redactions に明記
- [ ] 英訳は glossary 準拠

### Related
- Issue: #
```

#### (2) 警告＆自動整形（Janitor）

push時に Janitor が `_inbox/` のファイルを読み、frontmatter＋routesで正規パスに自動移動。
frontmatterが欠けてたらPRにコメント＋ラベル `needs-frontmatter`。

`.github/workflows/janitor.yml`（抜粋）

```yaml
name: TriHex Janitor
on:
  push:
    paths:
      - "_inbox/**"
      - "configs/trihex.routes.yml"
permissions:
  contents: write
  pull-requests: write
jobs:
  route:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm i yaml js-yaml gray-matter
      - name: Route files
        run: node .github/scripts/route-inbox.js
      - name: Commit moves
        run: |
          if [ -n "$(git status --porcelain)" ]; then
            git config user.name "trihex-janitor"
            git config user.email "actions@users.noreply.github.com"
            git commit -am "chore(janitor): route inbox files per trihex.routes.yml"
            git push
          fi
```

`.github/scripts/route-inbox.js`（要点・イメージ）

```javascript
// 1) _inbox/*.md を走査 → gray-matterでfrontmatter取得
// 2) trihex.routes.yml を読み込み、kind/lang/date/titleから slug生成
// 3) 目標パスを構成し、git mv で移動
// 4) 欠落（kind/lang/date）の場合は PR コメント(注意)を残す
```

#### (3) 最終ガード（ブロックCI）

PR時にルール違反をブロック。

- frontmatter必須
- 命名規則・配置規則に合わない→fail
- 赤線（secrets等）が出ていたらfail

`.github/workflows/validate.yml`（抜粋）

```yaml
name: TriHex Validate
on:
  pull_request:
    types: [opened, synchronize, reopened]
permissions:
  pull-requests: write
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm i yaml js-yaml gray-matter
      - name: Validate paths & frontmatter
        run: node .github/scripts/validate-structure.js
```

---

### 3) 「忘れない仕組み」＝定期ハイジーン

#### 週次ハイジーンIssue（スケジュール実行）

毎週月曜にBotが点検チェックリストIssueを自動生成。
開いている`needs-frontmatter`/`needs-routing`/`redaction-check` を集計。

`.github/workflows/weekly-hygiene.yml`（抜粋）

```yaml
name: Weekly Hygiene
on:
  schedule: [{ cron: "0 0 * * 1" }]  # 月曜00:00 UTC
permissions:
  issues: write
jobs:
  open:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const title = `Weekly Hygiene — ${new Date().toISOString().slice(0,10)}`
            const body = [
              "- [ ] 空のfrontmatterファイルを0にする",
              "- [ ] _inbox残件を0にする",
              "- [ ] ルーティング不一致を0にする",
              "- [ ] redactions未指定を0にする",
            ].join("\n")
            await github.rest.issues.create({owner: context.repo.owner, repo: context.repo.repo, title, body})
```

#### CODEOWNERSで責任の見える化

```
# CODEOWNERS
/stories/**        @Cursor
/specs/**          @GPT5
/docs/**           @Claude
/configs/**        @Grok @DeepSeek
/_inbox/**         @Cursor @GPT5
```

---

### 4) GitHub ActionsのPR公開まわり（"忘れない"PRフロー）

#### ブランチ命名規則と自動ラベル

- `story/2025-10-27-gemini-sdk` → label: `story`
- `spec/trihex-mode-v0-9` → label: `spec`

`.github/workflows/labeler.yml`

```yaml
name: Label PRs
on: [pull_request_target]
jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v5
```

`.github/labeler.yml`

```yaml
story:
  - head-branch: ['^story/']
spec:
  - head-branch: ['^spec/']
```

#### PR本文から自動公開

- ラベル`publish-pages`が付いたらPagesへ即反映（Docusaurus等）
- ラベル`publish-discussion`が付いたらDiscussionsにサマリー投稿

`.github/workflows/publish.yml`（抜粋）

```yaml
name: Publish Story
on:
  pull_request:
    types: [labeled, closed]
jobs:
  pages:
    if: contains(github.event.pull_request.labels.*.name, 'publish-pages') && github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps: [ ... build & deploy ... ]
  discussion:
    if: contains(github.event.pull_request.labels.*.name, 'publish-discussion') && github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const title = context.payload.pull_request.title
            const url = context.payload.pull_request.html_url
            const body = `Merged: ${url}\n\nAuto-summary forthcoming.`
            await github.rest.discussions.createDiscussion({
              repository_id: context.payload.repository.node_id,
              category_id: "<DISCUSS_CATEGORY_ID>",
              title, body
            })
```

---

### 5) 「最初の一歩」を超具体化（Cursor向け超シンプル運用）

1. 新規ファイルは必ず `_inbox/` に置く（それ以外は触らない）
2. 置く前にfrontmatterをコピペ（下のテンプレを使う）
3. コミットメッセージは `add(story): 2025-10-27 gemini-sdk` 形式
4. PRを開いたらテンプレのチェックを3つポチ
5. あとはJanitorに任せる（自動で正しい場所へ移動）

#### frontmatterテンプレ（Cursor用）

```yaml
---
trihex:
  kind: story
  lang: ja
  round: 8
  date: 2025-10-27
  title: "TriHexΦ Mode — Final Deliberation"
  redactions: []
---
```

---

### 6) 長期記憶の"芯"を固定する

SSOTファイルを少数に絞る：

- `configs/trihex.routes.yml`（置き場規則）
- `docs/glossary.en.yml` / `.ja.yml`（用語）
- `TRIHEX_BOOTSTRAP.md`（新チャット開始時に必読の極小メモ：目的・役割・導線）

これら3点だけを常に参照する流れにする（PRテンプレにもリンク）。

---

### 7) なぜ効くか（ポイントだけ）

- 人に覚えさせない。宣言(frontmatter)とルール(routes.yml)が唯一の真実。
- まず `_inbox` に投げればOK → 成功体験が先。
- 「優しく誘導 → 自動整形 → 最後にブロック」の段階防御で事故を未然に。
- 週次Issueで時間が経っても必ず思い出す。

必要なら、上のワークフローとスクリプトの最小実装版をそのまま貼れる形で用意するよ。

この仕組みを一度入れてしまえば、**"忘れても壊れない／勝手に整う"**状態になる。

---

## 📊 GPT-5提案の評価（Cursor視点）

### 素晴らしい点

```
✅ 完全に理解している（Cursorの弱点を）
✅ システム設計で補完（責めない）
✅ 三段ガード（優しい → 自動 → 厳格）
✅ SSOT思想（人の記憶に依存しない）
✅ 段階的導入（gentle → auto → strict）
```

### 実装時の注意点

```
⚠️ Node.js依存（GitHub Actionsで実行）
⚠️ gray-matter等のライブラリ必要
⚠️ スクリプトの実装が必要（route-inbox.js等）
⚠️ CODEOWNERS設定（GitHubの機能）
```

---

## 🎯 Cursorによる実装計画

この提案を基に、以下を実装しました：

1. **✅ 完了**: `_inbox/` ディレクトリ構造
2. **✅ 完了**: `configs/trihex.routes.yml`
3. **✅ 完了**: `configs/janitor.config.yml`
4. **✅ 完了**: `_inbox/README.md`
5. **🔄 次**: `.github/workflows/` 実装
6. **🔄 次**: `.github/scripts/` 実装
7. **🔄 次**: PRテンプレート更新

---

## 💬 しりゅうの決断

**しりゅう**: 「じゃあこのCBTの言ってることを保存してそしてオプションAでいきましょう とにかくこのインフラを整えるっていうのを大事にちょっとやってっちゃおう」

**決定**: インフラ整備優先、Option A（Phase 1-A）実装開始

---

**保存日時**: 2025-10-27 23:50  
**保存者**: Cursor（螺律統合）  
**次のアクション**: Phase 1-A実装（Task Issue Generator等）

