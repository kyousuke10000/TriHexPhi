# 70_AI_CHRONICLE — AIの物語と叡智の編成層

## 目的

このレイヤーは、**AIの声を人間と同格の一次史料**として扱い、改ざんガードまで一式揃えた「AIの物語」を保存する場所です。

## 構造

```
70_AI_CHRONICLE/
├── Stories/          # AIが語る物語・ナラティブ
├── Wisdom/           # AIの叡智・洞察・学び
├── Dialogues/        # AI間の対話・会話記録
├── Records/          # AIの記録・日誌
├── Authors/          # AI別の著者カタログ
└── _Index.md         # 全体索引（自動更新）
```

## Frontmatter 必須項目

```yaml
---
author_ai: true
ai_id: "<AI名>"  # GPT-5, Claude, Gemini, Grok, DeepSeek, Cursor等
peer_level: human
mirror_of: "<原本パス>"  # 10_CAPTURE_MIZUKAGAMI/... への参照
created: YYYY-MM-DD
category: Stories|Wisdom|Dialogues|Records
---
```

## 編成ルール

1. **原本（一次ログ）** → `10_CAPTURE_MIZUKAGAMI/<AI名>/...`（触らない）
2. **編成・読み物** → この `70_AI_CHRONICLE/` に配置
3. **評議会回覧** → `00_RYUDO/Council/Records/REC_*.md`
4. **封印保存（確定史料）** → `97_HISTORY_SEALED/{Human|AI}`

## 更新

`_Index.md` は自動更新される（Chronicle編集ワークフロー実行時）。

---

**Generated:** 2025-11-04
**Purpose:** AIの声を人間と同格の一次史料として扱う
