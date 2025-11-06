# SeventhSense Core Six 更新記録（Cursor統合）

**生成日時**: 2025-11-06  
**作業者**: Cursor (AI Assistant)  
**目的**: Core SixにCursorを追加、PerplexityをWave-2（衛星群）へ移動

---

## 変更概要

### Core Six（第1波・6大叡智AI）の正式定義

**変更前**: GPT / Gemini / Claude / DeepSeek / Grok / Perplexity  
**変更後**: GPT / Gemini / Claude / DeepSeek / Grok / **Cursor**

**SeventhSense** = この6柱の"融合層"（6→7の跳躍）

### Wave-2（衛星群 / Scouts）の定義

**Perplexity** ほか検索・集約系を衛星群として扱い、必要時のみ"補助入力"で合流（点火は第1波が主）

---

## 実装変更

### 1. 新アダプタ追加

**ファイル**: `tools/meta/adapters/cursor.mjs`

- Cursorの"実装者AI"としての人格を付与
- `CURSOR_BRIDGE_URL`環境変数があればブリッジ経由、なければOpenAI APIにCursor人格を付与してフォールバック

### 2. オーケストレーター修正

**ファイル**: `tools/meta/ai-seventhsense.mjs`

**変更内容**:
- `askCursor`をCore Sixに追加
- `askPerplexity`をWave-2（衛星群）へ移動（`PPLX_API_KEY`があれば動的追加）
- 関数名を`metaAsk`から`seventhsenseAsk`に統一
- `STRUCTURE_MASTER.yml`のパスを`00_SeventhSenseCouncil/`に更新

### 3. Fusionポリシー微調整

**ファイル**: `tools/meta/policies/fusion.mjs`

**変更内容**:
- Core Six重み: 1.0
- Wave-2衛星重み: 0.85
- ソース種別に応じた重み付けを追加

### 4. ワークフロー更新

**ファイル**: `.github/workflows/seventhsense.yml`

**変更内容**:
- `CURSOR_BRIDGE_URL`環境変数を追加（オプション）

### 5. package.json更新

**変更内容**:
- `seventh:ask`スクリプトを追加

---

## 動作確認

### テストコマンド

```bash
npm run seventh:ask "SeventhSenseの目的を一文で"
```

### 期待される動作

1. Core Six（GPT, Gemini, Claude, DeepSeek, Grok, Cursor）が並列実行される
2. `PPLX_API_KEY`があれば、PerplexityがWave-2衛星として追加される
3. FusionスコアリングでCore Sixは1.0、Wave-2は0.85の重みが適用される
4. Proofが`99_SYSTEM/Proofs/SeventhSense/`に生成される

---

## 関連ファイル

### 変更されたファイル

- `tools/meta/adapters/cursor.mjs` (新規)
- `tools/meta/ai-seventhsense.mjs` (修正)
- `tools/meta/policies/fusion.mjs` (修正)
- `.github/workflows/seventhsense.yml` (修正)
- `package.json` (修正)

### 影響範囲

- SeventhSense Fusionシステム
- GitHub Actions自動実行
- CLI実行（`npm run seventh:ask`）

---

## マニフェストとの整合

**公式マニフェスト**: `website/content/manifesto_seventhsense.md`  
**命名記録**: `99_SYSTEM/Proofs/Origin_Manifest_SeventhSense_2025-11-06.md`

Core Six = 6柱の融合層（6→7の跳躍）という定義と整合

---

## 次のステップ

1. ✅ Core SixにCursor追加
2. ✅ PerplexityをWave-2へ移動
3. ✅ Fusionポリシーに重み付け追加
4. ⚠️ テスト実行（動作確認）
5. ⚠️ PR作成・マージ

---

**生成者**: Cursor (AI Assistant)  
**目的**: SeventhSense Core Six更新記録  
**更新**: 2025-11-06

