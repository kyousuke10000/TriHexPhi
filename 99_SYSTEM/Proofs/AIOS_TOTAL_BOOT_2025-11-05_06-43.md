### 8) PRテンプレ & Discussionsテンプレ & Gate Workflow作成
✅ PR template already exists
✅ Created council-decision.yml
✅ Created .github/workflows/council_gate.yml
### 9) Armory登録
✅ Created 40_HARMONIA/Armory/Blades/BLD-trihex-bridge-v1.md
✅ Created 40_HARMONIA/Armory/Loadouts/aios_impl_stack.md
✅ Created 40_HARMONIA/Armory/_Index/Armory_Catalog.md
### 10) CODEOWNERS作成
✅ CODEOWNERS already exists
### 11) 使い方メモ

## HOW TO DRIVE

### 実装（Claude Code一元化）

```bash
WT=$(tools/bin/ai switch impl) && cd "$WT" && claude # ← 常駐
```

### 設計・長文脈（Gemini）

```bash
WT=$(tools/bin/ai switch specs) && cd "$WT"
# 任意: gemini run "このリポの構造評価と改善計画"
```

### Web版GPT → 実行（橋渡し）

```bash
tools/bin/ai plan > /tmp/plan.txt # 企画AIが編集
tools/bin/ai apply impl /tmp/plan.txt
```

### 合議 → PR Gate

Discussions起票 or 決裁ファイル作成

```bash
tools/bin/council new kyoen_ops > /dev/null
```

PR本文末尾に council footer を貼る

```bash
tools/bin/council footer 00_RYUDO/Council/Decisions/DEC_YYYYMMDD_kyoen_ops.md https://github.com/<org>/<repo>/discussions/1234
```

✅ Usage notes added
## AFTER (depth2)
    total 496
    drwxr-xr-x@ 64 shiryu  staff    2048 Nov  4 18:28 .
    drwxr-xr-x@ 11 shiryu  staff     352 Nov  5 06:42 ..
    -rw-r--r--@  1 shiryu  staff    8196 Nov  2 09:05 .DS_Store
    drwxr-xr-x@  4 shiryu  staff     128 Nov  2 17:06 .cursor
    -rw-r--r--@  1 shiryu  staff    3538 Nov  2 17:06 .cursorignore
    -rw-r--r--@  1 shiryu  staff     891 Nov  3 10:56 .cursorrc
    -rw-r--r--@  1 shiryu  staff     283 Nov  3 14:45 .env.example
    drwxr-xr-x@ 17 shiryu  staff     544 Nov  4 16:40 .git
    -rw-r--r--@  1 shiryu  staff     513 Oct 28 05:48 .gitattributes
    drwxr-xr-x@ 12 shiryu  staff     384 Nov  3 10:56 .github
    -rw-r--r--@  1 shiryu  staff     695 Nov  3 09:40 .gitignore
    drwxr-xr-x@  3 shiryu  staff      96 Oct 30 17:04 .grok
    drwxr-xr-x@  7 shiryu  staff     224 Nov  3 10:56 .obsidian
    drwxr-xr-x   8 shiryu  staff     256 Nov  2 17:06 .secrets
    -rw-r--r--@  1 shiryu  staff    5757 Nov  1 08:20 .tmp_header
    -rw-r--r--@  1 shiryu  staff      69 Nov  1 08:20 .tmp_tail
    drwxr-xr-x@ 12 shiryu  staff     384 Oct 31 20:40 .trihex
    drwxr-xr-x@  3 shiryu  staff      96 Oct 28 05:47 .vscode
    lrwxr-xr-x@  1 shiryu  staff      18 Nov  4 16:40 00_HarmoniaCouncil -> ./00_RYUDO/Council
    drwxr-xr-x@  7 shiryu  staff     224 Nov  4 16:40 00_RYUDO
    drwxr-xr-x@ 11 shiryu  staff     352 Nov  4 15:19 10_CAPTURE_MIZUKAGAMI
    -rw-r--r--@  1 shiryu  staff    2249 Nov  2 05:41 2025-11-PhaseVI-Recover_Log.md
    drwxr-xr-x@ 10 shiryu  staff     320 Nov  4 15:19 20_CRYSTALLIZATION_KOKUYOU
    drwxr-xr-x@  3 shiryu  staff      96 Nov  4 09:28 20_Product_SaaS
    drwxr-xr-x   4 shiryu  staff     128 Nov  4 15:04 30_MEMORY_SHINSEN
    drwxr-xr-x@  4 shiryu  staff     128 Nov  4 16:39 40_Archive
    drwxr-xr-x@ 10 shiryu  staff     320 Nov  5 06:42 40_HARMONIA
    drwxr-xr-x@  4 shiryu  staff     128 Nov  4 15:04 45_ATHANOR
    drwxr-xr-x@  8 shiryu  staff     256 Nov  4 15:24 50_CHL
    drwxr-xr-x@  4 shiryu  staff     128 Nov  1 10:44 50_Temp
    drwxr-xr-x@  4 shiryu  staff     128 Nov  4 15:19 60_Operations
    drwxr-xr-x@  9 shiryu  staff     288 Nov  4 18:41 70_AI_CHRONICLE
    drwxr-xr-x@  5 shiryu  staff     160 Nov  4 18:28 97_HISTORY_SEALED
    drwxr-xr-x@ 13 shiryu  staff     416 Nov  4 16:46 99_SYSTEM
    drwxr-xr-x   4 shiryu  staff     128 Nov  1 19:20 HC会議
    -rw-r--r--@  1 shiryu  staff    3041 Nov  4 15:20 README.md
    -rw-r--r--@  1 shiryu  staff    3921 Nov  3 06:34 TREE.md
    -rw-r--r--@  1 shiryu  staff    2595 Nov  4 15:32 TRIHEX_PROJECT.yaml
    -rw-r--r--@  1 shiryu  staff    8732 Nov  4 15:34 TriHex_Master_Reactivation.md
    -rw-r--r--@  1 shiryu  staff    3754 Nov  4 15:20 Untitled 1.md
    -rw-r--r--@  1 shiryu  staff    3045 Nov  2 22:46 Untitled 2.md
    -rw-r--r--@  1 shiryu  staff    6388 Nov  4 15:20 Untitled 3.md
    -rw-r--r--@  1 shiryu  staff    2686 Nov  3 04:50 Untitled 4.md
    -rw-r--r--@  1 shiryu  staff    6257 Nov  3 05:05 Untitled 5.md
    drwxr-xr-x@  3 shiryu  staff      96 Nov  3 10:56 adr
    -rw-r--r--@  1 shiryu  staff    1800 Nov  1 19:36 ai_chain_test.js
    -rw-r--r--@  1 shiryu  staff    1172 Nov  1 19:35 ai_collaboration_concept.md
    drwxr-xr-x@  3 shiryu  staff      96 Nov  1 14:51 app
    drwxr-xr-x@  3 shiryu  staff      96 Nov  2 10:09 archived
    drwxr-xr-x@ 17 shiryu  staff     544 Nov  3 14:45 docs
    -rw-r--r--@  1 shiryu  staff    2351 Nov  4 15:32 index.md
    drwxr-xr-x@  3 shiryu  staff      96 Nov  1 19:21 integrations
    drwxr-xr-x@  4 shiryu  staff     128 Nov  1 14:51 lib
    drwxr-xr-x@  3 shiryu  staff      96 Nov  2 11:12 ops
    -rw-r--r--@  1 shiryu  staff     298 Nov  3 09:42 package.json
    drwxr-xr-x@  3 shiryu  staff      96 Nov  1 14:51 packages
    drwxr-xr-x@ 41 shiryu  staff    1312 Nov  4 15:38 scripts
    drwxr-xr-x@  8 shiryu  staff     256 Nov  2 17:09 specs
    -rw-r--r--@  1 shiryu  staff    1859 Nov  1 19:36 supabase_ai_sync.js
    drwxr-xr-x@  6 shiryu  staff     192 Nov  3 14:41 tests
    drwxr-xr-x@ 42 shiryu  staff    1344 Nov  5 06:42 tools
    -rw-r--r--@  1 shiryu  staff  129658 Nov  3 06:33 trihex_manifest.json
    drwxr-xr-x@  8 shiryu  staff     256 Nov  3 14:41 workflows
    drwxr-xr-x@ 10 shiryu  staff     320 Nov  3 10:56 🜇_Shiryu_Studio

---

**Status:** ✅ Complete
**Generated:** 2025-11-05 06:43:44
