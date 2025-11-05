# 📘 Philosophia_Prima — 原典置き場

ここは TriHexφ における原典的文献（錬金・哲学・詩的体系）を保管する層です。  
Supabase との連携対象として `alchemy_*.md` 系を管理します。

## 運用ルール

- 各章は `alchemy_chXX.md` 命名
- frontmatter（title, tags, lang）を付与可能
- 編集は Obsidian から直接
- 自動インポート後、/knowledge/ に反映

## 構造

```
Philosophia_Prima/
├── index.md              # 目次・運用ルール
├── README.md             # このファイル
├── alchemy_ch00_preface.md  # 序文
├── alchemy_ch01.md       # 第一章
└── alchemy_ch02.md       # 第二章
```

## Supabase連携

知識ベース `trihex_core.knowledge` へのインポート手順：

1. 各 `.md` ファイルを解析
2. frontmatter を抽出（title, tags, lang）
3. 本文を HTML/plaintext 化
4. `slug` 生成（ファイル名ベース）
5. INSERT/UPDATE実行

## ステータス記号

- 🜂 水: 下書き
- 🜃 土: 未編集
- 🜄 風: レビュー中
- 🜁 火: 完成
- 🔮 精: Supabase同期済み



