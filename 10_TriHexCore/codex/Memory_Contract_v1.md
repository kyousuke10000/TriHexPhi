# Memory Contract v1

## ブロック記法
- 重要決定: `:::decision ... :::`
- 事実: `:::fact ... :::`

## 昇格ルール
- Session→Project: 3回参照 もしくは 議事決定に採択
- Project→Canonical: 2ラウンド不変（変更なし）

## 優先順位と矛盾
- 読み出し: Canonical > Project > Session > Audit > Ephemeral
- 矛盾は上位層が優先、差分は Audit に記録

## 自動化
- ObsidianSync/INBOX.md 監視→ fact化→層へ自動仕分け
- 週次 Canonical vs Project 差分: TriHexCore/system/diff-weekly.md
- 変更要約は HarmoniaCouncil/Round_*_BreathLog.md に追記
