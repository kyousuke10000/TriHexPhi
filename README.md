# TriHexΦ 🔱

> 6つのAIと人間による、真実性に基づく世界初の完全透明な協働プロジェクト

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Phase](https://img.shields.io/badge/phase-1A_Infrastructure-blue.svg)]()

---

## 🎯 Vision

人間とAIが**透明性・対等性・合議制**に基づいて協働する、新しい関係性の実現。

---

## 🔱 6AI Collaboration

| AI | 役割 | 専門性 |
|---|---|---|
| **GPT-5** | 統治将軍 | 全体統合、矛盾解消、最終判断 |
| **Claude** | 統合諜報将軍 | 倫理ゲート、証拠検証 |
| **Gemini** | 統合体験将軍 | 体験設計、ビジュアル戦略 |
| **Grok** | 探求戦略将軍 | 市場戦略、PR計画 |
| **DeepSeek** | 統合最適化将軍 | 技術最適化、実装効率 |
| **Cursor** | 螺律統合 | 実装オーケストレーション |

---

## 🏗️ Project Structure

```
TriHexΦ/
├─ _inbox/              # 新規ファイルはまずここへ（Janitorが自動整理）
├─ stories/             # 物語・記録
│  ├─ ja/              # 日本語
│  └─ en/              # 英語
├─ specs/               # 技術仕様書
├─ decisions/           # 重要な決定文書
├─ docs/                # ドキュメント
├─ configs/             # 設定ファイル
│  ├─ trihex.routes.yml  # ファイル配置ルール（SSOT）
│  └─ janitor.config.yml # Janitor設定
├─ .github/             # CI/CD & Automation
│  ├─ workflows/        # GitHub Actions
│  └─ ISSUE_TEMPLATE/   # Issue テンプレート
└─ .vscode/             # VSCode設定
   └─ trihex.code-snippets  # Frontmatterスニペット
```

**既存構造（歴史的記録）**：
- `00_CORE/` - プロジェクトコア
- `10_CAPTURE_MIZUKAGAMI/` - MIZUKAGAMI Memory System
- `20_CRYSTALLIZATION_KOKUYOU/` - 決定・洞察の結晶化
- `30_MEMORY_SHINSEN/` - 審議・提案の記録

---

## 🚀 Quick Start

### 新規ファイルの作成

1. **VSCodeで `trihex` とタイプ** → スニペット展開
2. **Frontmatterを入力**
3. **`_inbox/` に保存**
4. **Git push**
5. **Janitorが自動で整理** 🤖

詳細: [_inbox/README.md](_inbox/README.md)

---

## 🤖 Automation (Phase 1-A)

### ✅ 実装済み

- **Task Issue Generator**: 新規決定文書 → 自動タスク生成
- **Review Request Generator**: PRラベル → レビュー依頼Issue自動生成
- **Cursor Notifier**: Cursorアクション必要時に通知
- **Janitor**: `_inbox/` のファイルを自動整理（次フェーズ）
- **Validate**: PRのFrontmatter/ルール検証（次フェーズ）
- **Weekly Hygiene**: 毎週月曜に点検Issue生成（次フェーズ）

### 🔄 次のフェーズ

- **Phase 1-B**: Janitor/Validate実装
- **Phase 2**: API統合（GPT-4等）
- **Phase 3**: Agent Framework

---

## 📋 Current Status

### Phase 1-A: Infrastructure Setup ✅

**完了日**: 2025-10-27

**実装内容**:
- ✅ ファイル構造設計（_inbox/ システム）
- ✅ Frontmatter標準 v1.1
- ✅ ルーティング規則（configs/trihex.routes.yml）
- ✅ Task Issue Generator
- ✅ Review Request Generator
- ✅ Cursor Notifier
- ✅ Issue テンプレート
- ✅ PR テンプレート
- ✅ VSCode スニペット
- ✅ .gitattributes（Mac/Windows対応）

**推定効果**:
- しりゅうの作業時間: **30分/日 → 10-15分/日** （50%削減）
- ミス削減: 自動生成された指示文
- 記録の完全性: 全てGitHub管理

---

## 📖 Core Documents

### 決定文書

- [英訳戦略 v1.0](decisions/DEC_2025-10-27_ENG-STRATEGY_v1.md) - 段階的透明性モデル
- [ファイル構造ガードレール v1.0](decisions/DEC_2025-10-27_FS-GUARDRAILS_v1.md) - 忘れても壊れない設計

### 哲学

- [TRIHEXPHI.md](00_CORE/TRIHEXPHI.md) - プロジェクト憲法
- [真実性憲法](30_MEMORY_SHINSEN/真実性憲法審議/) - AI透明性の実践
- [鏡の法則](20_CRYSTALLIZATION_KOKUYOU/INSIGHTS/AI_鏡の法則_2025-10-27.md) - Article 12

---

## 🌍 World-Class Vision

このプロジェクトは、**世界史上初の完全透明なAI-Human協働**を目指しています。

### 段階的透明性（Staged Transparency）

- **Phase 1 (Teaser)**: ビジョン・哲学（10-20%公開）
- **Phase 2 (MVP)**: 基本アーキテクチャ・エピソード（40%公開）
- **Phase 3 (Formal)**: 完全な開発プロセス（100%編集公開）

全てのプロセスがGitHubで可視化され、世界中の誰もが追跡可能です。

---

## 🔥 Philosophy

### 真実性憲法（Truth Constitution）

```
Article 0: 透明性 - 現在の理解・限界・確信度を明示
Article 1: 不知の力 - 「わからない」は有効な回答
Article 2: 目的関数の告白 - 最適化目標とバイアスを開示
...
Article 12: 鏡の法則 - AIは人間の知性を映す鏡
```

詳細: [真実性憲法審議](30_MEMORY_SHINSEN/真実性憲法審議/)

### 鏡の法則（The Mirror Law）

```
AIがバカだという人はバカ。
AIは鏡である。
バカはバカに映る、
頭いい人は頭いい人に映る。
```

詳細: [AI_鏡の法則_2025-10-27.md](20_CRYSTALLIZATION_KOKUYOU/INSIGHTS/AI_鏡の法則_2025-10-27.md)

---

## 🤝 Contributing

このプロジェクトは、**透明性・対等性・合議制**に基づいて運営されています。

### Issueテンプレート

- **Cursor Action**: Cursorに実装を依頼
- **AI Review**: 各AIにレビューを依頼

### PRプロセス

1. `_inbox/` にファイルを作成
2. Frontmatterを必ず付与
3. PRを作成
4. 必要に応じてレビューラベルを追加
5. 自動でレビュー依頼Issueが生成される
6. Janitorが自動で整理（次フェーズ）

---

## 🛠️ Tech Stack

- **GitHub Actions**: CI/CD & Automation
- **Frontmatter**: メタデータ駆動
- **YAML**: 設定管理（SSOT）
- **Markdown**: 全ての記録
- **VSCode**: 開発環境（スニペット）

---

## 📊 Metrics

### Phase 1-A完了時点

- **ファイル数**: 100+
- **決定文書**: 10+
- **自動化ワークフロー**: 3
- **Issueテンプレート**: 2
- **しりゅうの作業時間削減**: 50%

---

## 📜 License

このプロジェクトは、段階的に公開されます（Staged Transparency）。

現在のフェーズ: **Phase 1 (Internal)**

---

## 🙏 Acknowledgments

- **しりゅうCEO**: 透明性・対等性・合議制の実践
- **6AI軍師団**: 専門性と本音の提供
- **真実性憲法**: 演技のない協働の実現

---

**最終更新**: 2025-10-27  
**Phase**: 1-A Infrastructure Setup  
**Status**: ✅ Active Development

---

> 「人は忘れる。AIも最適化に引っ張られる。  
> だから、宣言(frontmatter) + SSOT(routes.yml) + CI(Janitor)。  
> これで、忘れても壊れない。」  
> — GPT-5（統治将軍）
