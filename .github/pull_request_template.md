## 概要

- Pipeline: SeventhSense Local Pipeline
- 目的: <explain>

## 変更点

- [ ] ssx.mjs / pipeline.yml 追加
- [ ] CursorをCore Sixに / PerplexityはWave-2衛星
- [ ] README 更新（Memory Dock / Raw Index入口）

## 動作確認

- [ ] `npm run ssx:ask architect -- "<prompt>"` で応答
- [ ] `npm run ssx:flow -- "<prompt>"` で6段呼吸
- [ ] Proofs生成: `99_SYSTEM/Proofs/SeventhSense/SEVENTHSENSE_*.md` が出力

## リスク/ロールバック

- 既存オーケストレーション（seventhsense.yml）は無変更で可動
- ロールバック: ssx.mjs/ pipeline.yml を削除
