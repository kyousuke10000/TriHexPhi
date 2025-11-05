# TriHex 階層関係提案

**Generated:** 2025-11-02  
**Analyzer:** Cursor (☿)  
**Purpose:** Active直下3フォルダの論理的関係を明確化

---

## 📊 現状分析

### 3つのフォルダ構成

```
~/【Shii】/Active/
├── TriHexΦ/              [本体OS・母艦]
├── TriHex.core/          [歴史的Core・別リポ]
└── trihex-ai-app/        [Next.js App・運用UI]
```

---

## 🔍 詳細解析

### 1️⃣ TriHexΦ（本体）

**役割:** 🎯 **全体OS（母艦）**  
**状態:** ✅ アクティブ  
**構造:**
```
TriHexΦ/
├── 🜇_Shiryu_Studio/          [Priority 0: 源泉]
├── 00_HarmoniaCouncil/        [Priority 1: 吸]
├── 10_TriHexCore/             [Priority 2: 構造]
│   ├── 00_CORE/
│   ├── specs/
│   ├── decisions/
│   └── tools/
├── 20_TriHex-Obsidian/        [Priority 3: 静]
├── 30_ObsidianSync/           [Priority 4: 吐]
├── 40_Archive/                [Priority 5: 蓄積]
└── 99_SYSTEM/                 [Priority 7: 証明]
```

**特徴:**
- 8層の呼吸構造（Breathing Layers）
- 6AI協働システム
- Vault/Canonical/Memory統合
- Proofs/Progress自動記録
- **30+ folders, 500+ files**

**現在の仕事:**
- KYOEN LINE Zero Friction Ops ✅
- n8n Workflow-as-Code ✅
- Supabase Tokunoshima Events ✅
- INSPECT+INDEX ✅

---

### 2️⃣ TriHex.core（歴史的）

**役割:** 📚 **初期開発アーカイブ**  
**状態:** ⚠️ 凍結（submodule化）  
**構造:**
```
TriHex.core/
├── README.md                   [7ラウンド対話の物語]
├── TRIHEXPHI.md               [憲法v2.4]
├── STRATEGIC_PLAN.md          [戦略計画]
├── 📤Round3_全AI送付用/
├── 00_CORE/
│   └── 📋GitHub_Actions実行手順.md
├── 10_CAPTURE_MIZUKAGAMI/
└── scripts/
```

**特徴:**
- **独自のGitリポジトリ**
- GitHub Actions実装（6AIレビュー）
- MIZUKAGAMI Clipper
- **アーカイブ用途**

**重要な発見:**
```
trihex-ai-app/packages/trihex-core/ 
  → Git Submoduleとして以下を参照:
  → https://github.com/kyousuke10000/TriHexPhi.git
  → つまり、TriHex.coreと同じソース!
```

**関係性:**
```
TriHex.core/ = 元のリポジトリ (独立)
    ↓
Git Submodule経由
    ↓
trihex-ai-app/packages/trihex-core/ = App側の参照
```

---

### 3️⃣ trihex-ai-app（運用UI）

**役割:** 🎨 **Next.js 運用プラットフォーム**  
**状態:** ✅ 開発中  
**構造:**
```
trihex-ai-app/
├── app/                       [Next.js App Router]
│   ├── (auth)/
│   ├── dashboard/
│   ├── knowledge/             ← Memory Stack viewer
│   ├── studio/                ← Over Drive Publishing
│   └── settings/
├── lib/
│   ├── supabase/
│   ├── stripe/
│   └── publishers/
├── components/
├── packages/
│   └── trihex-core/          ← Git Submodule
│       ├── (TriHex.coreと同じ内容)
│       └── db/schema.sql     ← 追加されたDBスキーマ
└── package.json               [Next.js 16 + TypeScript]
```

**特徴:**
- **Next.js 16 + TypeScript**
- **Supabase Auth + pgvector**
- **Stripe Checkout**
- **Over Drive** (LINE/X/YouTube等)
- Git Submoduleで`trihex-core`参照

**追加機能:**
- `packages/trihex-core/db/schema.sql`が追加
- 運用向けスキーマ（events, content, publish_queue）

---

## 🎯 論理的階層提案

### Recommended Structure

```
TriHexΦ (母艦OS)
    ↑ 論理的統括
    │
    ├── 10_TriHexCore/
    │   └── [Canonical Knowledge]
    │       ├── TRIHEXPHI.md
    │       ├── Genesis_Protocol.md
    │       ├── specs/
    │       └── tools/
    │
    ├── [依存関係]
    │   │
    │   ├── TriHex.core/  [参照: 歴史的Core]
    │   │   └── Git Submoduleとして管理
    │   │
    │   └── trihex-ai-app/  [参照: 運用UI]
    │       └── packages/trihex-core/ (Git Submodule)
    │
    ├── 00_HarmoniaCouncil/  [AI Sessions]
    ├── 20_TriHex-Obsidian/  [Human Memory]
    ├── 99_SYSTEM/           [Proofs/Logs]
    └── docs/                [Runbooks]
```

---

## 💡 見立てと意見

### 重要発見: 10_TriHexCore vs TriHex.core

**現状:**
1. **TriHexΦ/10_TriHexCore/** = 現在の活動拠点
   - 技術仕様、決定ログ、ツール
   - **建設中**

2. **Active/TriHex.core/** = 初期アーカイブ
   - 7ラウンド対話、憲法制定
   - **凍結**

3. **trihex-ai-app/packages/trihex-core/** = 運用参照
   - 上記をGit Submoduleで参照
   - `db/schema.sql`追加

**問題:**
```
混乱の原因:
- 「TriHex.core」という名前がActive直下とTriHexΦ内10_TriHexCoreで類似
- 実際には別物（歴史 vs 現在）
```

---

## ✅ 推奨構造

### 非破壊的リネーム提案

```
現状:
Active/
├── TriHex.core/          [混乱しやすい]
├── TriHexΦ/
│   └── 10_TriHexCore/   [現在の活動]
└── trihex-ai-app/

提案 (論理的階層):
Active/
├── TriHexΦ/                    [母艦]
│   ├── 10_TriHexCore/          [現在のCore]
│   │   ├── 00_CORE/
│   │   ├── specs/
│   │   ├── tools/
│   │   └── ...
│   │
│   ├── [参照先]
│   │   ├── _deps/
│   │   │   ├── trihex-historic-core/  [リネーム]
│   │   │   └── trihex-ai-app/         [論理的参照]
│   │
│   ├── 00_HarmoniaCouncil/
│   ├── 20_TriHex-Obsidian/
│   └── 99_SYSTEM/
│
├── TriHex.core → trihex-historic-core  [リネーム提案]
└── trihex-ai-app                       [App層]
```

---

## 🚨 Relocation Risk

| Operation | Risk | Reason |
|-----------|------|--------|
| 物理的移動 | 🟥 **高** | Git Submodule破壊、参照切れ |
| Active/TriHex.core削除 | 🟥 **高** | trihex-ai-appのsubmodule壊れる |
| リネーム | 🟨 **中** | Git設定更新必要 |
| 論理的統括 | 🟩 **低** | ドキュメントのみ |

---

## 📋 結論と提案

### 1. どれが母艦か？

**✅ 結論: TriHexΦ**

```
TriHexΦ = 本体OS（母艦）
  ├── 10_TriHexCore/ = 現在の活動拠点
  ├── 00_HarmoniaCouncil/ = AI Sessions
  ├── 20_TriHex-Obsidian/ = Human Memory
  ├── 99_SYSTEM/ = Proofs
  └── [参照先]
      ├── TriHex.core/ → trihex-historic-core (提案)
      └── trihex-ai-app/ = 運用UI
```

### 2. TriHex.coreと10_TriHexCoreの関係

**現状:**
- **10_TriHexCore/**: 現在の知識基盤 ✅
- **TriHex.core/**: 初期アーカイブ 📚

**関係:**
```
歴史 → 現在 → 未来
TriHex.core → 10_TriHexCore → trihex-ai-app
(凍結)       (建設中)         (運用)
```

### 3. trihex-ai-appの立場

**役割:** 運用UI（フロントエンド）  
**依存:** TriHex.core (Git Submodule)  
**統括:** TriHexΦ（論理的には配下）  

---

## ✅ アクション提案（非破壊）

### Option 1: ドキュメント強化（推奨）

```
TriHexΦ/README.md に追加:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Architecture Overview

```
TriHexΦ (Main OS)
├── 10_TriHexCore/          ← Current Core
├── 00_HarmoniaCouncil/     ← AI Sessions
├── 20_TriHex-Obsidian/     ← Human Memory
└── 99_SYSTEM/              ← Proofs

External References:
├── ../TriHex.core/         ← Historic Archive
└── ../trihex-ai-app/       ← Production UI
```
```

### Option 2: シンボリックリンク（上級）

```bash
# 論理的統括（例）
cd ~/【Shii】/Active/TriHexΦ
mkdir -p _refs
ln -s ../../TriHex.core _refs/historic-core
ln -s ../../trihex-ai-app _refs/production-app

# 結果:
TriHexΦ/
├── _refs/
│   ├── historic-core/ → ../../TriHex.core
│   └── production-app/ → ../../trihex-ai-app
```

### Option 3: そのまま（現状維持）

**理由:**
- 物理的移動はリスク高
- Git Submodule依存あり
- 現在の作業に支障なし

**最小限の対応:**
- `99_SYSTEM/Proofs/TRIHEX_HIERARCHY_PROPOSAL.md` ✅ 作成済み
- READMEに説明追記

---

## 🎯 最終推奨

**✅ 現状維持 + ドキュメント強化**

**理由:**
1. 物理的移動はGit Submodule破壊リスク高
2. 現在の構造で動作している
3. 論理的関係は明確化済み
4. 追加コストなし

**実施:**
- ✅ 本レポート作成完了
- 📝 `README.md`に「Architecture Overview」追記
- 📝 `docs/hierarchy.md`作成

---

**Relocation Risk:** 🟩 **低** (非破壊)  
**Status:** ✅ **提案完了**  
**Next:** README更新のみで十分

---

**Generated:** 2025-11-02T12:30:00Z / Cursor (☿)  
**Purpose:** Hierarchy proposal without modification


