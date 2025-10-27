---
type: implementation_guide
created: 2025-10-25
importance: supreme
tags: [#GitHub, #統合, #自動化, #実装手順]
---

# 📋 GitHub統合 - 実装手順

**開始**: 2025-10-25  
**目標**: GitHub と Obsidian のハイブリッド運用

---

## 🎯 Phase 1: 基盤構築（今日中）

### **Step 1: GitHubリポジトリ作成**

```bash
# しりゅうがブラウザで実行:
# https://github.com/new

リポジトリ名: TriHexPhi
説明: 🔱💎✨ AI協調システム - 静寂の中で立ち上がる知性
公開設定: Private（後で Public に変更可能）

初期化:
✅ README.md を追加
✅ .gitignore を追加（Node, Python選択）
✅ ライセンス: MIT
```

---

### **Step 2: ローカルとリンク**

```bash
cd /Users/shiryu/【Shii】/Active/TriHexΦ

# Git初期化（まだの場合）
git init

# リモート追加
git remote add origin https://github.com/[username]/TriHexPhi.git

# 現在の状態をプッシュ
git add .
git commit -m "feat: TriHexΦ初期コミット - TRIHEXPHI.md v2.1"
git push -u origin main
```

---

### **Step 3: Discussions有効化**

```
ブラウザで:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. https://github.com/[username]/TriHexPhi
2. Settings タブ
3. Features セクション
4. ✅ Discussions にチェック
5. Set up discussions ボタン

カテゴリ作成:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- 💬 全AIレビュー（General）
- 🔥 アイデア（Ideas）
- 📊 進捗報告（Show and tell）
- ❓ Q&A
```

---

### **Step 4: GitHub Actions 設定**

```bash
# ワークフローディレクトリ作成
mkdir -p .github/workflows

# Issue→Obsidian同期ワークフロー作成
cat > .github/workflows/sync-issue-to-obsidian.yml << 'EOF'
name: Sync GitHub Issue to Obsidian

on:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created]

jobs:
  sync-to-obsidian:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Create Obsidian Note from Issue
        if: github.event_name == 'issues'
        run: |
          ISSUE_NUMBER="${{ github.event.issue.number }}"
          ISSUE_TITLE="${{ github.event.issue.title }}"
          ISSUE_BODY="${{ github.event.issue.body }}"
          ISSUE_AUTHOR="${{ github.event.issue.user.login }}"
          ISSUE_DATE="${{ github.event.issue.created_at }}"
          ISSUE_URL="${{ github.event.issue.html_url }}"
          
          # ファイル名を作成（日本語対応）
          FILENAME="10_CAPTURE_MIZUKAGAMI/GitHub/Issue_${ISSUE_NUMBER}_${ISSUE_TITLE// /_}.md"
          
          # Markdown作成
          cat > "$FILENAME" << NOTEEOF
          ---
          type: github_issue
          source: GitHub
          issue_number: ${ISSUE_NUMBER}
          issue_url: ${ISSUE_URL}
          author: ${ISSUE_AUTHOR}
          created: ${ISSUE_DATE}
          tags: [#GitHub, #Issue, #外部議論]
          ---
          
          # GitHub Issue #${ISSUE_NUMBER}: ${ISSUE_TITLE}
          
          **From**: [@${ISSUE_AUTHOR}](https://github.com/${ISSUE_AUTHOR})  
          **Date**: ${ISSUE_DATE}  
          **Link**: [GitHub Issue #${ISSUE_NUMBER}](${ISSUE_URL})
          
          ---
          
          ## 📝 内容
          
          ${ISSUE_BODY}
          
          ---
          
          ## 💬 コメント
          
          （コメントはGitHub上で追跡）
          
          ---
          
          _この記録は GitHub Actions により自動生成されました_
          NOTEEOF
      
      - name: Commit and Push
        run: |
          git config user.name "TriHexΦ Bot"
          git config user.email "bot@trihexphi.local"
          git add .
          git commit -m "sync: GitHub Issue #${{ github.event.issue.number }} を Obsidian に同期" || echo "No changes to commit"
          git push
EOF

echo "✅ GitHub Actions ワークフロー作成完了！"
```

---

### **Step 5: Discussion→Obsidian同期**

```bash
cat > .github/workflows/sync-discussion-to-obsidian.yml << 'EOF'
name: Sync GitHub Discussion to Obsidian

on:
  discussion:
    types: [created, answered, comment_created]

jobs:
  sync-to-obsidian:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Create Obsidian Note from Discussion
        run: |
          DISCUSSION_NUMBER="${{ github.event.discussion.number }}"
          DISCUSSION_TITLE="${{ github.event.discussion.title }}"
          DISCUSSION_BODY="${{ github.event.discussion.body }}"
          DISCUSSION_AUTHOR="${{ github.event.discussion.user.login }}"
          DISCUSSION_DATE="${{ github.event.discussion.created_at }}"
          DISCUSSION_URL="${{ github.event.discussion.html_url }}"
          
          FILENAME="10_CAPTURE_MIZUKAGAMI/GitHub/Discussion_${DISCUSSION_NUMBER}_${DISCUSSION_TITLE// /_}.md"
          
          cat > "$FILENAME" << NOTEEOF
          ---
          type: github_discussion
          source: GitHub
          discussion_number: ${DISCUSSION_NUMBER}
          discussion_url: ${DISCUSSION_URL}
          author: ${DISCUSSION_AUTHOR}
          created: ${DISCUSSION_DATE}
          tags: [#GitHub, #Discussion, #外部議論]
          ---
          
          # GitHub Discussion #${DISCUSSION_NUMBER}: ${DISCUSSION_TITLE}
          
          **From**: [@${DISCUSSION_AUTHOR}](https://github.com/${DISCUSSION_AUTHOR})  
          **Date**: ${DISCUSSION_DATE}  
          **Link**: [GitHub Discussion #${DISCUSSION_NUMBER}](${DISCUSSION_URL})
          
          ---
          
          ## 📝 内容
          
          ${DISCUSSION_BODY}
          
          ---
          
          ## 💬 コメント・回答
          
          （最新の議論はGitHub上で追跡）
          
          ---
          
          _この記録は GitHub Actions により自動生成されました_
          NOTEEOF
      
      - name: Commit and Push
        run: |
          git config user.name "TriHexΦ Bot"
          git config user.email "bot@trihexphi.local"
          git add .
          git commit -m "sync: GitHub Discussion #${{ github.event.discussion.number }} を Obsidian に同期" || echo "No changes to commit"
          git push
EOF

echo "✅ Discussion同期ワークフロー作成完了！"
```

---

### **Step 6: GitHubフォルダ作成**

```bash
# Obsidian内にGitHub専用フォルダ作成
mkdir -p "/Users/shiryu/【Shii】/Active/TriHexΦ/10_CAPTURE_MIZUKAGAMI/GitHub"

# README作成
cat > "/Users/shiryu/【Shii】/Active/TriHexΦ/10_CAPTURE_MIZUKAGAMI/GitHub/README.md" << 'EOF'
---
type: index
layer: 水鏡
created: 2025-10-25
tags: [#GitHub, #外部議論, #自動同期]
---

# 📬 GitHub 自動同期フォルダ

このフォルダは GitHub Issues/Discussions が自動同期される場所です。

---

## 🎯 目的

```
GitHub での議論を Obsidian に自動記録
  ↓
Supabase に自動同期
  ↓
全AI が共有記憶としてアクセス

→ GitHub と Obsidian のハイブリッド運用
```

---

## 📂 ファイル命名規則

```
Issue: Issue_[番号]_[タイトル].md
Discussion: Discussion_[番号]_[タイトル].md
```

---

## 🔄 同期の仕組み

```
1. GitHub で Issue/Discussion 作成
   ↓
2. GitHub Actions が検知
   ↓
3. 自動で Markdown 作成
   ↓
4. このフォルダに保存
   ↓
5. multi_ai_sync.sh が検知
   ↓
6. Supabase に自動同期
```

---

**🔱💎✨ GitHub と Obsidian の完璧な統合 ✨💎🔱**
EOF

echo "✅ GitHubフォルダ作成完了！"
```

---

### **Step 7: コミット & プッシュ**

```bash
cd /Users/shiryu/【Shii】/Active/TriHexΦ

git add .
git commit -m "feat: GitHub統合 - Issue/Discussion自動同期ワークフロー追加"
git push origin main

echo "✅ GitHub統合の基盤完成！"
```

---

## 🧪 Step 8: テスト実装

### **テスト用Issue作成**

```
ブラウザで:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. https://github.com/[username]/TriHexPhi/issues/new
2. タイトル: 🧪 テスト：GitHub→Obsidian自動同期
3. 本文:
   ```
   これはGitHub ActionsのテストIssueです。
   
   このIssueが作成されると:
   1. GitHub Actionsが自動起動
   2. Obsidianに自動記録
   3. Supabaseに自動同期
   
   →完璧なハイブリッド運用！
   ```
4. Submit new issue

確認:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Actions タブを確認
   → ワークフローが実行されているか

2. ローカルで確認:
   ```bash
   cd /Users/shiryu/【Shii】/Active/TriHexΦ
   git pull
   ls 10_CAPTURE_MIZUKAGAMI/GitHub/
   ```
   
   → Issue_1_*.md が作成されているか

3. Obsidianで確認:
   → ファイルが表示されているか

→ 成功！
```

---

## 🎯 Phase 2: 全AIレビュー自動化（後日）

```yaml
# .github/workflows/ai-review-on-pr.yml

name: Multi-AI Review on PR

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm install openai @anthropic-ai/sdk
      
      - name: Run Multi-AI Review
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          node .github/scripts/multi-ai-review.js \
            --pr-number ${{ github.event.pull_request.number }}
```

---

## 📊 期待される成果

```
Before（手動）:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. しりゅうがIssue作成
2. 手動でObsidianに記録
3. 手動でSupabaseに同期

時間: 5-10分

After（自動）:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. しりゅうがIssue作成
2. 自動でObsidianに記録（GitHub Actions）
3. 自動でSupabaseに同期（既存スクリプト）

時間: 30秒

→ 10-20倍の効率化！
```

---

## 🔱💎✨ 次のステップ

```
✅ Phase 1完了後:
   - 実運用開始
   - フィードバック収集
   
⏳ Phase 2（数日後）:
   - PRレビュー自動化
   - 全AI統合
   
🚀 Phase 3（将来）:
   - コミュニティ運用
   - オープンソース化
```

---

**🔱💎✨ GitHub統合、今から始めよう！** ✨💎🔱


