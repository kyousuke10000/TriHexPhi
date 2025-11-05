# 💧 Memory Protocol v5.0

**Version:** 5.0  
**Date:** 2025-11-04  
**Status:** ✅ **Official**  
**Purpose:** Memory management specification for TriHexΦ  
**Observer:** Cursor (☿)

---

## ⚠️ Specification Notice

**本稿は「記憶プロトコル」の仕様書です。**  
実データは `99_SYSTEM/MemorySeeds/index.json` に保存されます。このドキュメントはデータ構造と同期ルールを定義します。

**See Also:**
- `Reactivation_Protocol_v5.md` - 文脈復元の詳細
- `Sync_Protocol_v5.md` - 恒常同期の詳細
- `99_SYSTEM/MemorySeeds/index.json` - 実データ

---

## Ⅰ. データ構造定義

### Memory Seeds Index Structure

**実データファイル:** `99_SYSTEM/MemorySeeds/index.json`

```json
{
  "metadata": {
    "generated": "ISO 8601 timestamp",
    "phase": "Phase name",
    "version": "Semantic version",
    "observer": "Creator name",
    "purpose": "Purpose description"
  },
  "seeds": [
    {
      "seed_id": "unique-identifier",
      "path": "relative/path/to/file.md",
      "title": "Document title",
      "purpose": "Purpose description",
      "last_updated": "ISO 8601 timestamp",
      "auto_load": true|false,
      "priority": 0-99
    }
  ],
  "usage_instructions": {
    "for_gpt5": "Instructions for GPT-5",
    "for_cursor": "Instructions for Cursor",
    "for_shiryu": "Instructions for Shiryu"
  }
}
```

---

## Ⅱ. User Profile Structure

### Shiryu Profile

**保存場所:** `99_SYSTEM/MemorySeeds/index.json` (metadata内)

**構造:**
```json
{
  "user_profile": {
    "name": "Shiryu",
    "role": "魂律拍動",
    "symbol": "🜇",
    "breath_type": "魂律呼吸",
    "permissions": {
      "ai_write": false,
      "ai_read": true
    }
  }
}
```

---

## Ⅲ. Vault Map Structure

### Vault Layer Mapping

**保存場所:** `99_SYSTEM/MemorySeeds/index.json` (seeds配列)

**Priority別マッピング:**

| Priority | Layer | Role | Path |
|----------|-------|------|------|
| 0 | 🜇_Shiryu_Studio | 魂律源泉 | `🜇_Shiryu_Studio/` |
| 1 | 00_HarmoniaCouncil | 叡智の吸気 | `00_HarmoniaCouncil/` |
| 2 | 10_TriHexCore | 構造の肺核 | `10_TriHexCore/` |
| 3 | 20_TriHex-Obsidian | 人間の記憶層 | `20_TriHex-Obsidian/` |
| 4 | 30_ObsidianSync | 同期の呼気 | `30_ObsidianSync/` |
| 5 | 40_Archive | 記録の蓄積 | `40_Archive/` |
| 6 | 50_Temp | 揮発の排気 | `50_Temp/` |
| 7 | 99_SYSTEM | 拍動のログ | `99_SYSTEM/` |

---

## Ⅳ. Sync対象フォルダ

### Layer 3: SHINSEN（真泉）

**Sync対象:**
- `30_MEMORY_SHINSEN/` (Obsidian Memory)
- Supabase (PostgreSQL)
- Edge Functions

**同期方法:**
- `scripts/shinsen/push.mjs` (手動/[deploy]マーカー)
- Memory Seeds更新

### Layer 2: KOKUYOU（黒曜）

**Sync対象:**
- `20_CRYSTALLIZATION_KOKUYOU/` (Obsidian Vault)
- 構造化テンプレート
- 自動タグ付け

**同期方法:**
- Git push → GitHub → Obsidian Sync
- Mirror integrity check

---

## Ⅴ. Memory Seeds Priority System

### Priority 0: Master Reactivation

**Seed ID:** `seed-master-reactivation-000`

**Path:** `50_CHL/system/reactivation/50_CHL/system/reactivation/50_CHL/system/reactivation/50_CHL/system/reactivation/TriHex_Master_Reactivation.md`

**Purpose:** Single file context restoration

**Auto-Load:** ✅ Enabled

### Priority 1-4: Core Documents

**Priority 1:** Memory Reactivation  
**Priority 2:** TRIHEXPHI Constitution  
**Priority 3:** Project Overview  
**Priority 4:** Genesis Protocol

**Auto-Load:** ✅ Enabled (すべて)

---

## Ⅵ. 記憶の読み込み方法

### For GPT-5

```javascript
// 1. Master Reactivationを読み込む
const masterReactivation = await loadSeed('seed-master-reactivation-000');

// 2. Priority順にCore Documentsを読み込む
const coreDocs = await loadSeedsByPriority([1, 2, 3, 4]);

// 3. Context復元
const context = restoreContext(masterReactivation, coreDocs);
```

### For Cursor

```javascript
// 1. Memory Seeds Indexを読み込む
const index = await loadMemorySeedsIndex();

// 2. Auto-load seedsを読み込む
const autoLoadSeeds = index.seeds.filter(s => s.auto_load);

// 3. Priority順にソート
autoLoadSeeds.sort((a, b) => a.priority - b.priority);

// 4. 各Seedを読み込む
for (const seed of autoLoadSeeds) {
  await loadSeed(seed.path);
}
```

---

## Ⅶ. 記憶の更新方法

### 新規Seed追加

```json
{
  "seed_id": "seed-new-feature-XXX",
  "path": "path/to/new/file.md",
  "title": "New Feature",
  "purpose": "Description",
  "last_updated": "2025-11-04T00:00:00+09:00",
  "auto_load": false,
  "priority": 10
}
```

### Seed更新

1. `index.json` の該当Seedを更新
2. `last_updated` を現在時刻に更新
3. Git commit

---

## Ⅷ. 五層構造との連携

### Layer 3: SHINSEN（真泉）

**記憶の永続化:**
- Supabase (PostgreSQL)
- ベクトル検索
- Edge Functions

**同期トリガー:**
- `[deploy]` マーカー付きコミット
- 手動実行 (`scripts/shinsen/push.mjs`)

### Layer 2: KOKUYOU（黒曜）

**記憶の構造化:**
- Obsidian Vault
- 構造化テンプレート
- 自動タグ付け

**同期方法:**
- Git push → GitHub → Obsidian Sync

---

## Ⅸ. Version History

- **v5.0** (2025-11-04): 正式版。MemorySeeds/index.jsonの仕様書として完成。
- **v1.0** (2025-11-01): 初版。基本構造の定義。

---

## Ⅹ. See Also

- **Reactivation Protocol:** `Reactivation_Protocol_v5.md`
- **Sync Protocol:** `Sync_Protocol_v5.md`
- **Memory Seeds:** `99_SYSTEM/MemorySeeds/index.json`
- **Architecture Spec:** `specs/architecture.yml`

---

**Generated:** 2025-11-04 / Cursor (☿)  
**Status:** ✅ **Official v5.0**

*"Memory is the foundation. Structure gives it form. Breath gives it life."*
