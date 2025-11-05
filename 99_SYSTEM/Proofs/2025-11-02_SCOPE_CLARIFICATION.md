# スキャン範囲の明確化

**Generated:** 2025-11-02  
**Purpose:** インベントリスキャンの範囲確認

---

## 📊 スキャン範囲

### Active直下の構成

```
~/【Shii】/Active/
├── TriHex.core       (別プロジェクト)
├── TriHexΦ           (本プロジェクト ← 現在地)
└── trihex-ai-app     (別プロジェクト)
```

### 今回のスキャン範囲

**Living Memory Bootstrap (Dry-Run):**
- ✅ **TriHexΦ のみ**がスキャン対象
- ❌ TriHex.core は未スキャン
- ❌ trihex-ai-app は未スキャン

**Roots設定:**
```
roots: [
  "/Users/shiryu",              // HOME全体 (広範囲)
  "/Users/shiryu/Dev",          // Dev
  "/Users/shiryu/Documents",    // Documents
  "/Users/shiryu/Desktop",      // Desktop
  "/Users/shiryu/【Shii】/Active/TriHexΦ"  // 本プロジェクト
]
```

---

## ⚠️ 重要な気づき

**Living Memory Bootstrap は HOME全体をスキャンしていた**

- `~/` 配下の全ファイル（44,687 files）を対象
- `Desktop/`, `Documents/`, `Dev/` も含む
- **意図:** TriHexの散在ファイルを検出

---

## 🎯 INSPECT+INDEX の実際の範囲

### A) Outer Skeleton
- **対象:** `TriHexΦ` 配下のみ
- **深度:** 2ディレクトリまで
- ✅ 8レイヤ確認済み

### B) Obsidian Index
- **対象:** 4パスのmarkdown
  - `20_TriHex-Obsidian`
  - `🜇_Shiryu_Studio`
  - `00_HarmoniaCouncil`
  - `10_TriHexCore`
- **結果:** 125 files indexed

### C〜E) その他のレポート
- 全て `TriHexΦ` 内のみ

---

## 🔄 どちらが正しいか？

### Option 1: HOME全体（Living Memory Bootstrap）
**Pros:**
- 散在ファイルを検出可能
- 重複や古いコピーを発見

**Cons:**
- スコープが広すぎる
- システムファイルも含む

### Option 2: TriHexΦ内のみ（INSPECT+INDEX）
**Pros:**
- プロジェクト単位で明確
- 処理が高速

**Cons:**
- 外部の重複を見逃す

---

## ✅ 推奨

**両方を実施済み:**
1. **Living Memory Bootstrap:** HOME全体スキャン ✅
2. **INSPECT+INDEX:** TriHexΦ内のみ ✅

**結論:** ✅ 十分な範囲を網羅済み

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Purpose:** Scope clarification


