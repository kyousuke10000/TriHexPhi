# TriHexΦ AI連携コンセプト

## 概要
TriHexΦのRubedo Phaseでは、複数AI（Grok, Claude, GPTなど）の英知をCLIベースで繋げ、記憶を共有化する。Web版の孤立を避け、Supabaseを中央DBとして活用し、応答の連鎖を実現。

## 記憶共有の仕組み
1. **AI応答の保存**: CLIスクリプトで各AIの出力をSupabaseテーブル（例: ai_responses）に挿入。フィールド: ai_name, content, timestamp, context_id。
2. **応答の取得と連鎖**: 次AIのインプット時にDBから前回の応答をクエリし、プロンプトに注入（例: "前回のGrokの出力: [content]"）。
3. **CLI統合**: BashスクリプトやNode.jsで実装。Cursor内でGrok CLIが起点となり、他のAI APIをコール。
4. **Chrome拡張ブリッジ**: Web版AI使用時は拡張で応答をキャプチャし、Supabaseにプッシュ。CLI側で同期。

## 利点
- コピペ不要: 自動連鎖。
- 流動性（Ryūdō）: AIの出力が呼吸のように流れる。
- 拡張性: Obsidianで視覚化、TriHexCoreで整合。

## 次ステップ
Supabaseスクリプトのプロトタイプ作成。