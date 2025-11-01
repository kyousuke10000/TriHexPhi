---
type: github_discussions_memory_integration
round: 3
created: 2025-10-26
status: ⏳ 計画中
tags: [#GitHub, #Discussions, #Memory, #統合]
---

# GitHub Discussions → Memory System 統合計画

**From**: Cursor (螺律 / Engineer / 守護者)  
**日時**: 2025-10-26  
**目的**: Round 3の実行過程を記憶として蓄積

---

## 🎯 理解したこと

### Memory System（記憶システム）の全体像

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【問題】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AIの会話がチャットごとに消える
→ 記憶が残らない
→ 検索できない

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【解決策】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Obsidian（黒曜）: ローカルでMarkdown管理
2. Supabase（真泉Φ）: クラウドでベクトル検索
3. 自動同期: Obsidian → Supabase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### GitHub Discussions との統合

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【現在の状態】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GitHub Actions → Discussions に投稿
         ↓
    これ以上何もない
         ↓
    記憶として蓄積されない

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【目指す状態】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GitHub Actions → Discussions に投稿
         ↓
    Obsidian に同期
         ↓
    Supabase に同期
         ↓
    ベクトル検索可能な記憶に

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 必要な追加機能

### Phase 1: Discussion → Obsidian 同期

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【GitHub Actions ワークフローに追加】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ステップ: Discussion 取得 → Obsidian ファイル作成

1. Discussionの内容を取得
2. MarkdownファイルとしてObsidianに保存
3. frontmatterにメタデータ追加

保存先:
10_CAPTURE_MIZUKAGAMI/GitHub/Discussions/Discussion_<番号>_<タイトル>.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Phase 2: Obsidian → Supabase 同期

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【既存の同期スクリプトを使用】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

multi_ai_sync.sh が 5分ごとに実行
→ GitHub/Discussions/ フォルダも同期対象に追加

または:
ワークフロー内で即座にSupabaseに同期

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📋 実装計画

### Step 1: GitHub Actions ワークフロー拡張

`.github/workflows/ai_review_discussions.yml` に追加:

```yaml
- name: "DiscussionをObsidianに同期"
  uses: actions/github-script@v7
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      // Discussion内容を取得
      const discussion = await github.graphql(...);
      
      // Obsidianファイル作成
      const obsidianContent = `---
type: github_discussion
discussion_number: ${discussion.number}
created: ${discussion.createdAt}
tags: [#GitHub, #Discussions, #完璧軍議, #Round3]
---

# ${discussion.title}

${discussion.body}

...各AIのコメント...
`;
      
      // ファイル保存
      fs.writeFileSync('10_CAPTURE_MIZUKAGAMI/GitHub/Discussions/Discussion_${discussion.number}.md', obsidianContent);
```

### Step 2: Supabase同期

既存の `sync_obsidian_to_supabase.js` を使用:

```javascript
// GitHub Discussionsフォルダも同期対象に追加
const folders = [
  '10_CAPTURE_MIZUKAGAMI/Cursor',
  '10_CAPTURE_MIZUKAGAMI/Claude',
  '10_CAPTURE_MIZUKAGAMI/GitHub/Discussions' // 追加
];
```

### Step 3: ベクトル検索可能に

Supabase同期時に自動的に:
- Embedding生成
- memory_events テーブルに保存
- ベクトル検索可能になる

---

## 🎯 期待される結果

### Round 3完了後

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【記憶として蓄積されるもの】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. GitHub Discussion #1
   - Strategic Plan v1.0レビュー
   - GPT-5のレビュー
   - Claudeのレビュー
   - Geminiのレビュー
   - Grokのレビュー
   - DeepSeekのレビュー

2. GitHub Discussion #2
   - Strategic Plan v2.0統合
   - Grokによるフィードバック統合

3. 完璧軍議Round 3の全体像
   - 条件付き10.0 → 無条件10.0の過程
   - 各AIの役割と協働

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 将来の活用

```
AIがレビュー依頼を受けた時:
→ memory-search で類似の過去のレビューを検索
→ 「前回Round 3でレビューした時は...」という文脈を参照
→ より良いレビューが可能

完璧軍議の継続性:
→ 各Roundの記憶が蓄積
→ AI同士の議論の進化を追跡
→ チームとしての成長を記録

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 💎 完璧主義の精神

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

完璧軍議 Round 3を実行するだけでなく、
その過程を記憶として残す。

GitHub Discussions → Obsidian → Supabase

三層の記憶システムで、
完璧な記録を実現する。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

**Status**: ⏳ 計画中  
**Next**: GitHub Actions ワークフロー拡張  
**Goal**: Discussion → Obsidian → Supabase 統合

🔱💎✨ **GitHub Discussions Memory統合計画** ✨💎🔱

