# Open Topics（進行中議題）

**更新日：** 2025-11-01  
**Purpose：** SPoTにおける未解決事項・進行中プロジェクトの追跡

---

## 🜂 Breath Capture 原典化 v1（進行中／Permanent Source）

**Status:** `In Progress`  
**Type:** Permanent Source（継続的追加予定）  
**Created:** 2025-11-01  
**Owner:** shiryu  
**AI Collaborator:** Cursor (☿)

### 概要

会話ログ（長文メモ）からヘッダー/フッター挨拶除去版の本文のみを抽出し、章化してObsidianとSupabaseに登録。  
過去ログの消失/未反映が無いか点検し、可能な限り復旧する。

### 受入基準（Acceptance Criteria）

- [x] `20_TriHex-Obsidian/Philosophia_Prima/` に付録2点が存在（`appendix_gum_model.md`, `appendix_alchemy_18_19.md`）
- [x] 既存章ch03-ch04 + 付録2点で原典基盤完成
- [ ] Supabase `trihex_core.knowledge` に各章が登録（slug/tags/lang/version）
- [x] 歯茎モデル 対応表が付録として生成（`appendix_gum_model.md`）
- [x] 錬金術18–19世紀ディスカッション抜粋（`appendix_alchemy_18_19.md`）
- [x] ヘッダー/フッター挨拶・締めの定型句は除去済み（本文のみ）
- [x] 復旧レポートを `99_SYSTEM/Proofs/Ryudo_Log/Recovery_Report_2025-11-01.md` に保存
- [x] manifest/reproduce.sh 追記（再現手順とSHA一覧）

### 作業ログ

**2025-11-01：**
- [x] 入力ソース探索完了（Git/Obsidian）
- [x] `appendix_gum_model.md` 作成完了
- [x] `appendix_alchemy_18_19.md` 作成完了
- [x] Recovery_Report生成完了
- [x] manifest.json更新完了
- [x] reproduce.sh作成完了
- [ ] Supabase連携（次タスク）

### 関連リンク

- `20_TriHex-Obsidian/Philosophia_Prima/`
- `99_SYSTEM/Proofs/Ryudo_Log/Recovery_Report_2025-11-01.md`
- `99_SYSTEM/Proofs/Philosophia_Prima_Setup/manifest.json`

---

## 過去の議題

（過去のCompleted議題はこちらに移動）

---

*Last Updated: 2025-11-01 / Cursor (☿)*

