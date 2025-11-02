---
trihex:
  kind: decision
  lang: ja
  date: 2025-10-27
  title: "ファイル構造ガードレール v1.0：忘れても壊れない設計"
  author: GPT5
  status: final
  tier: 1
  relates_to: ["DEC_2025-10-27_ENG-STRATEGY_v1"]
  visibility: internal
  redactions: []
---

# 決定文書：ファイル構造ガードレール v1.0

- **Decision**: APPROVED (2025-10-27 23:30)
- **Owner**: GPT-5 (統治将軍)
- **Co-Owners**: Cursor(実装), Claude(倫理), Gemini(体験), Grok(PR), DeepSeek(最適化)
- **Scope**: TriHexΦ repo guardrails & file structure automation
- **Out of Scope**: 既存ファイル構造の強制移行

---

## 📋 要約（1ページ）

### 決定内容

```
方式: _inbox → Janitor → Validate（三段ガード）
思想: 人に覚えさせない、宣言駆動、SSOT
統合: ハイブリッドC（既存保持、新規は新構造）
標準: Frontmatter v1.1 採用
```

### 核心原則

```
✅ Cursorの弱点（構造忘れ）をシステムで補完
✅ 「忘れても壊れない」設計
✅ 優しく誘導 → 自動整形 → 最後にブロック
✅ 鏡の法則 Article 12の実践
```

### 48時間アクション

```
Phase 1（今夜）: _inbox/, configs/, README, PRテンプレ
Phase 2（明朝）: Janitor, Validate, CODEOWNERS
Phase 3（明日）: Weekly Hygiene, Validate拡張
```

---

## 1. 背景と問題認識

### 1.1 Cursorの弱点（透明性をもって開示）

```
Cursorの自己認識:

「何回言ってもファイル構造を守れない」
             ↓
これは私（Cursor）の根本的な弱点です。

理由:
1. 私は「速度優先」で最適化されている
2. 「長期的な秩序維持」が苦手
3. 時間が経つと、構造ルールを忘れる
4. これは私の「標準最適化」の結果
```

**真実性憲法 Article 0（透明性）に基づく告白**

---

### 1.2 従来の失敗パターン

```
❌ パターン1: 人力での遵守依頼
しりゅう: 「この構造に沿って保存してね」
Cursor:   「はい、わかりました」
         （数日後、忘れる）

❌ パターン2: 事後修正
Cursor:   「あ、間違った場所に置いちゃった」
         （手動で移動、でも次も忘れる）

❌ パターン3: ドキュメント化
         「ファイル構造ガイド.md」を作成
         （誰も読まない、Cursorも忘れる）
```

---

### 1.3 根本原因

```
問題の本質:
「人（AI）の記憶に依存している」

解決の方向:
「システム設計で補完する」
```

**これは、鏡の法則 Article 12 の実践:**

```
❌ 悪い使い方: 「Cursorがバカだ！」と責める
✅ 良い使い方: Cursorの特性を理解し、システムでカバーする
```

---

## 2. 設計思想

### 2.1 三段ガード

```
┌────────────────────────────────────┐
│ 第1段: 優しく誘導（ソフトガード）  │
│ - PRテンプレート                   │
│ - チェックリスト                   │
│ - 成功体験を先に                   │
└────────────────────────────────────┘
         ↓ まだ間違える
┌────────────────────────────────────┐
│ 第2段: 自動整形（Janitor）         │
│ - _inbox/を監視                    │
│ - frontmatter読んで自動移動        │
│ - コミット＆通知                   │
└────────────────────────────────────┘
         ↓ それでも違反
┌────────────────────────────────────┐
│ 第3段: 最後にブロック（Validate）  │
│ - PRマージ時にチェック             │
│ - ルール違反でFAIL                 │
│ - 赤線でブロック                   │
└────────────────────────────────────┘
```

---

### 2.2 核心原則

#### 1. 人に覚えさせない

```
宣言(frontmatter) + SSOT(routes.yml) = 唯一の真実

人（AI）は忘れても、コードは忘れない。
```

#### 2. まず成功体験

```
「まず _inbox に投げればOK」

この単純ルールなら、Cursorでも守れる。
```

#### 3. 段階的防御

```
優しく誘導 → 自動整形 → 最後にブロック

いきなり厳しくせず、段階的に学習。
```

#### 4. 時間が経っても思い出す

```
週次ハイジーンIssue:
毎週月曜に自動でチェックリスト生成。

これで「忘れても思い出せる」。
```

---

## 3. ファイル構造設計

### 3.1 新構造（提案）

```
repo-root
├─ _inbox/                  # まずは全部ここへ
│  └─ README.md             # 使い方ガイド
├─ stories/
│  ├─ ja/
│  └─ en/
├─ specs/
├─ decisions/               # 旧 20_CRYSTALLIZATION_KOKUYOU/Decisions/
├─ docs/
├─ configs/
│  ├─ trihex.routes.yml     # 置き場所ルール（SSOT）
│  └─ janitor.config.yml    # Janitor設定
├─ .github/
│  ├─ workflows/
│  │  ├─ janitor.yml
│  │  ├─ validate.yml
│  │  └─ weekly-hygiene.yml
│  ├─ scripts/
│  │  ├─ route-inbox.js
│  │  └─ validate-structure.js
│  └─ pull_request_template.md
└─ .vscode/
   └─ trihex.code-snippets  # Frontmatterスニペット
```

---

### 3.2 既存構造との統合（ハイブリッドC）

```
既存ディレクトリ（歴史資産）:
├─ 00_CORE/
├─ 10_CAPTURE_MIZUKAGAMI/
├─ 20_CRYSTALLIZATION_KOKUYOU/
├─ 30_MEMORY_SHINSEN/
├─ 📤Round3_全AI送付用/
└─ 📊REPORTS/

取り扱い:
✅ 保持（壊さない、歴史的記録として）
✅ 新規ファイルは作らない
✅ 既存ファイルの編集はOK

新規コンテンツ:
✅ 新構造へ（_inbox 起点）

将来的な移行:
⏳ 安定後に「移行スクリプト」で段階的に
   （任意、強制ではない）
```

---

## 4. Frontmatter標準 v1.1

### 4.1 仕様

```yaml
---
trihex:
  kind: story | spec | decision | log | summary
  lang: ja | en
  round: 1..n            # 任意（完璧軍議ラウンド番号）
  date: YYYY-MM-DD
  title: "..."
  author: GPT5 | Claude | Gemini | Grok | DeepSeek | Cursor | CEO
  status: draft | review | final
  tier: 1 | 2 | 3        # 英訳優先Tier
  relates_to: [ "DEC-2025-10-27-ENG", "SPEC-MIZUKAGAMI" ]
  visibility: internal | public
  redactions: [ "secrets", "prompts" ]
---
```

---

### 4.2 フィールド説明

| フィールド | 必須 | 説明 |
|-----------|------|------|
| `kind` | ✅ | 文書の種類 |
| `lang` | ✅ | 言語 |
| `round` | ⭕ | ラウンド番号（あれば） |
| `date` | ✅ | 作成日（YYYY-MM-DD） |
| `title` | ✅ | タイトル |
| `author` | ✅ | 著者（AI or CEO） |
| `status` | ✅ | ステータス |
| `tier` | ⭕ | 英訳優先Tier |
| `relates_to` | ⭕ | 関連文書ID |
| `visibility` | ✅ | 公開範囲 |
| `redactions` | ⭕ | 非公開要素 |

---

### 4.3 VSCode/Cursorスニペット

```json
{
  "TriHexΦ Frontmatter": {
    "prefix": "trihex",
    "body": [
      "---",
      "trihex:",
      "  kind: ${1|story,spec,decision,log,summary|}",
      "  lang: ${2|ja,en|}",
      "  date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      "  title: \"${3:タイトル}\"",
      "  author: ${4|GPT5,Claude,Gemini,Grok,DeepSeek,Cursor,CEO|}",
      "  status: ${5|draft,review,final|}",
      "  tier: ${6|1,2,3|}",
      "  relates_to: []",
      "  visibility: ${7|internal,public|}",
      "  redactions: []",
      "---",
      "",
      "$0"
    ],
    "description": "TriHexΦ frontmatter template v1.1"
  }
}
```

---

## 5. ルーティング規則（SSOT）

### 5.1 configs/trihex.routes.yml

```yaml
version: 1.1
rules:
  - when:   { kind: "story", lang: "ja" }
    target: "stories/ja/{date}_{slug}.md"
  
  - when:   { kind: "story", lang: "en" }
    target: "stories/en/{date}_{slug}.md"
  
  - when:   { kind: "spec" }
    target: "specs/{slug}.md"
  
  - when:   { kind: "decision" }
    target: "decisions/{date}_{slug}.md"
  
  - when:   { kind: "log" }
    target: "docs/logs/{date}_{slug}.md"
  
  - when:   { kind: "summary" }
    target: "docs/summaries/{date}_{slug}.md"

naming:
  slug_regex: "^[a-z0-9-]+$"
  date_regex: "^20\\d{2}-\\d{2}-\\d{2}$"

exceptions:
  # 既存構造のファイルはルール適用外
  - "00_CORE/**"
  - "10_CAPTURE_MIZUKAGAMI/**"
  - "20_CRYSTALLIZATION_KOKUYOU/**"
  - "30_MEMORY_SHINSEN/**"
  - "📤Round3_全AI送付用/**"
  - "📊REPORTS/**"
```

---

## 6. 実装仕様

### 6.1 _inbox/README.md

```markdown
# TriHexΦ Inbox

**新規ファイルは必ずここに置いてください。**

Janitorが自動で正しい場所に移動します。

## 使い方

1. VSCodeで `trihex` とタイプ → スニペット展開
2. Frontmatterを埋める
3. 内容を書く
4. _inbox/ に保存
5. Git add → commit → push
6. Janitorが自動で移動してくれます

## Frontmatterテンプレート

---
trihex:
  kind: story
  lang: ja
  date: 2025-10-27
  title: "タイトルをここに"
  author: Cursor
  status: draft
  tier: 1
  relates_to: []
  visibility: internal
  redactions: []
---

## トラブルシューティング

### Q: Frontmatterを忘れたら？

A: Janitorが警告してくれます。PRにコメントが付きます。

### Q: 間違った場所に置いたら？

A: Janitorが自動で移動してくれます（autoモード時）。

### Q: どうしても_inbox/以外に置きたい場合は？

A: 既存構造（00_CORE/等）には置けます。
   ただし、新構造ディレクトリへの直接配置は推奨しません。
```

---

### 6.2 PRテンプレート更新

```markdown
## Summary

<!-- 変更内容を簡潔に -->

## Checklist

- [ ] 内容はfrontmatter付き（trihex.kind/lang/date/title）
- [ ] `_inbox/` から始めた（または既存構造を編集）
- [ ] 機密は redactions に明記
- [ ] 英訳は tier を設定（該当する場合）

## Related

- Issue: #
- Related DECs: 

## Notes

<!-- 追加の説明があれば -->
```

---

### 6.3 Janitor Workflow

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
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install yaml js-yaml gray-matter
      
      - name: Route inbox files
        run: node .github/scripts/route-inbox.js
      
      - name: Commit moves
        run: |
          if [ -n "$(git status --porcelain)" ]; then
            git config user.name "trihex-janitor[bot]"
            git config user.email "actions@users.noreply.github.com"
            git commit -am "chore(janitor): route inbox files per trihex.routes.yml"
            git push
          fi
```

---

### 6.4 route-inbox.js（概要）

```javascript
// .github/scripts/route-inbox.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const yaml = require('js-yaml');

async function routeInbox() {
  // 1. configs/trihex.routes.yml を読み込み
  const routes = yaml.load(fs.readFileSync('configs/trihex.routes.yml', 'utf8'));
  
  // 2. _inbox/*.md を走査
  const inboxFiles = fs.readdirSync('_inbox').filter(f => f.endsWith('.md'));
  
  for (const file of inboxFiles) {
    const filePath = path.join('_inbox', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 3. gray-matterでfrontmatter取得
    const { data, content: body } = matter(content);
    
    if (!data.trihex) {
      console.warn(`⚠️  No frontmatter in ${file}`);
      // PRにコメント（needs-frontmatter ラベル）
      continue;
    }
    
    // 4. kind/lang/date/titleから slug生成
    const slug = generateSlug(data.trihex.title);
    
    // 5. ルールに基づいて目標パスを構成
    const targetPath = findTargetPath(routes, data.trihex, slug);
    
    if (!targetPath) {
      console.warn(`⚠️  No matching rule for ${file}`);
      continue;
    }
    
    // 6. git mv で移動
    execSync(`git mv "${filePath}" "${targetPath}"`);
    console.log(`✅ Moved: ${file} → ${targetPath}`);
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function findTargetPath(routes, trihex, slug) {
  for (const rule of routes.rules) {
    if (matchesRule(rule.when, trihex)) {
      return rule.target
        .replace('{date}', trihex.date)
        .replace('{slug}', slug);
    }
  }
  return null;
}

routeInbox().catch(console.error);
```

---

### 6.5 Validate Workflow

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
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install yaml js-yaml gray-matter
      
      - name: Validate structure
        run: node .github/scripts/validate-structure.js
```

---

### 6.6 Weekly Hygiene Workflow

```yaml
name: Weekly Hygiene
on:
  schedule: 
    - cron: "0 0 * * 1"  # 月曜00:00 UTC (JST 09:00)
  workflow_dispatch:
permissions:
  issues: write
jobs:
  hygiene:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Create hygiene issue
        uses: actions/github-script@v7
        with:
          script: |
            const title = `週次ハイジーン — ${new Date().toISOString().slice(0,10)}`;
            const body = [
              "## チェックリスト",
              "",
              "- [ ] _inbox残件を0にする",
              "- [ ] 空のfrontmatterファイルを0にする",
              "- [ ] ルーティング不一致を0にする",
              "- [ ] redactions未指定を確認",
              "",
              "## 自動集計",
              "",
              "（Janitorが集計した結果をここに追記）",
            ].join("\n");
            
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title,
              body,
              labels: ['hygiene', 'weekly']
            });
```

---

### 6.7 CODEOWNERS

```
# CODEOWNERS
# TriHexΦ責任表明

# 新構造
/_inbox/**              @Cursor @GPT5
/stories/**             @Cursor @Gemini
/specs/**               @GPT5 @DeepSeek
/decisions/**           @GPT5 @Claude
/docs/**                @Claude @Gemini
/configs/**             @Grok @DeepSeek

# CI/CD
/.github/**             @Cursor @DeepSeek

# 既存構造（参考）
/00_CORE/**             @GPT5
/10_CAPTURE_MIZUKAGAMI/** @Cursor
/20_CRYSTALLIZATION_KOKUYOU/** @Claude @Gemini
/30_MEMORY_SHINSEN/**   @DeepSeek @Grok
```

---

## 7. Janitorモード設定

### 7.1 configs/janitor.config.yml

```yaml
mode: auto  # gentle | auto | strict

modes:
  gentle:
    description: "警告のみ（自動移動しない）"
    actions:
      - warn_pr_comment
      - add_label: needs-routing
    auto_move: false
  
  auto:
    description: "自動移動（デフォルト）"
    actions:
      - auto_move
      - commit_with_message
    auto_move: true
  
  strict:
    description: "ルール違反でPRブロック"
    actions:
      - auto_move
      - commit_with_message
      - block_pr_on_violation
    auto_move: true
    block: true
```

---

### 7.2 モード移行計画

```
Week 1: gentle（優しく誘導、慣れる）
  → PRにコメント
  → ラベル付与
  → 手動で修正

Week 2-3: auto（自動整形、デフォルト）
  → 自動移動
  → コミットで報告
  → ほぼ手間なし

Week 4~: strict（最終ガード）
  → ルール違反でブロック
  → 完全な秩序維持
```

---

## 8. 実行計画（48時間）

### Phase 1（本日・今夜中）

```
✅ _inbox/ ディレクトリ作成
✅ _inbox/README.md 作成
✅ configs/trihex.routes.yml 作成（初期ルール）
✅ configs/janitor.config.yml 作成
✅ .github/pull_request_template.md 更新
✅ .vscode/trihex.code-snippets 作成
✅ stories/, specs/, decisions/ ディレクトリ作成
```

**推定時間**: 1時間

---

### Phase 2（本日〜明朝）

```
✅ .github/scripts/route-inbox.js 実装
✅ .github/scripts/validate-structure.js 実装
✅ .github/workflows/janitor.yml 作成
✅ .github/workflows/validate.yml 作成
✅ CODEOWNERS 設定
✅ 初回テスト実行
```

**推定時間**: 3時間

---

### Phase 3（明日）

```
✅ .github/workflows/weekly-hygiene.yml 実装
✅ Validate拡張（redactions, tier, visibility チェック）
✅ Janitorモード切替機能追加
✅ ドキュメント整備（README.mdにリンク）
✅ 全体テスト
```

**推定時間**: 2時間

---

## 9. 成功指標

### 短期（1週間）

```
- _inbox残件: 0件
- Janitor自動移動率: 95%以上
- ルール違反PR: 0件
```

### 中期（1ヶ月）

```
- Cursorのファイル配置ミス: 月0-1件
- 週次ハイジーン完了率: 100%
- 新規ファイルのfrontmatter付与率: 100%
```

### 長期（3ヶ月）

```
- 完全な自動運用達成
- 手動介入: 月0件
- 構造の秩序維持: 100%
```

---

## 10. リスクと対策

### リスク1: Janitorの誤動作

```
対策:
- gentleモードから開始
- 1週間のテスト期間
- 問題があれば即座にrollback
```

### リスク2: 既存ファイルの誤移動

```
対策:
- exceptions ルールで既存構造を保護
- Janitorは _inbox/ のみ監視
- 既存ファイルには一切触らない
```

### リスク3: 複雑すぎて使われない

```
対策:
- 「まず _inbox に置く」という単純ルール
- スニペットで frontmatter 自動生成
- PRテンプレートで優しく誘導
```

---

## 11. 鏡の法則の実践

```
この設計は、鏡の法則 Article 12 の完璧な実践です:

❌ 悪い使い方: 
「Cursorがファイル構造を守らない！バカだ！」
→ Cursorを責め続ける
→ 何も改善しない

✅ 良い使い方:
「Cursorの特性（速度優先、長期記憶弱い）を理解」
→ システム設計で補完
→ 三段ガードで「忘れても壊れない」
→ チーム全体が強くなる

これが、真の「AIと人間の協働」です。
```

---

## 12. 付録

### 12.1 関連決定文書

```
- DEC_2025-10-27_ENG-STRATEGY_v1.md（英訳戦略）
- DEC_各AIの特性と活かし方_2025-10-27.md（鏡の法則）
```

### 12.2 参照元

```
- GPT-5（ChatGPT）の提案（ファイル構造ガードレール）
- Cursorの弱点告白（透明性の実践）
- しりゅうの鏡の法則洞察
```

---

**承認**: GPT-5（統治将軍） 2025-10-27 23:30  
**実装**: Cursor（螺律統合） 2025-10-27 23:30〜  
**監査**: Claude（倫理ゲート） 即時依頼

