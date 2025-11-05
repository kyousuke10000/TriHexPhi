# KYOEN Implementation Package

**作成日**: 2025-11-04  
**フェーズ**: Phase 2 - RSVP Collector / Reminders / Cards 実装  
**進捗**: 55% (設計完了、実装準備OK)

## 📦 このパッケージについて

GPT×Claude×しりゅう計画の一環として作成されたKYOEN（共演）システムの実装パッケージです。
LINEグループの情報管理を自動化する3つのワークフロー（RSVP Collector / Reminders / Cards）の設計が完了しています。

## 📁 ディレクトリ構造

```
kyoen-implementation/
├── README.md                          # このファイル
├── MASTER_OVERVIEW.md                 # 全体像・アーキテクチャ
├── PROGRESS.md                        # 進捗管理・実行ログ
└── workflows/kyoen/
    ├── FLOWS.md                       # 3ワークフローのノード構成図
    ├── TEST_PAYLOADS.md               # テストペイロード（30+ケース）
    ├── regex/
    │   └── rsvp_patterns.md          # 正規表現パターン（30ケース検証済み）
    ├── queries/
    │   └── rsvp_queries.md           # Supabaseクエリ（SQL + PostgREST）
    └── flex/
        ├── event_list.flex.json      # イベント一覧Flex（Carousel）
        ├── rsvp_detail.flex.json     # 参加者詳細Flex
        ├── reminder.flex.json        # リマインダーFlex（3タイプ）
        └── flex_binding.md           # Flexバインディングコード
```

## 🎯 含まれる成果物

### 1. 全体設計
- **MASTER_OVERVIEW.md**: 三位一体オーケストレーション（GPT/Claude/Cursor）の全体像
- **PROGRESS.md**: 進捗管理・実行ログ・次のアクション

### 2. 正規表現エンジン
- **rsvp_patterns.md**: 
  - コマンド検出パターン（`/rsvp list`, `参加者一覧`, etc.）
  - 日時抽出（YYYY/MM/DD HH:mm）
  - 日本語日付（明日、11月15日、11/15）
  - 時刻抽出（18:00, 18時, 18時30分）
  - 場所抽出（場所：〇〇、@〇〇）
  - 30ケースのテストデータ
  - n8n Codeノード用JavaScript実装例

### 3. データベース層
- **rsvp_queries.md**:
  - Supabase Function（`get_event_rsvp_summary`）
  - PostgREST クエリ（イベント一覧、参加者詳細）
  - エラーハンドリング
  - n8n HTTP Request用URL構築コード

### 4. UI層（LINE Flex Message）
- **event_list.flex.json**: イベント一覧Carousel（最大10件）
- **rsvp_detail.flex.json**: 参加者詳細（ステータス別表示）
- **reminder.flex.json**: リマインダー（前日/当日/終了後の3タイプ）
- **flex_binding.md**: データバインディングコード・LINE Push API連携

### 5. ワークフロー設計
- **FLOWS.md**:
  - WF-A: KYOEN_RSVP_Collector（メイン + Postback詳細表示）
  - WF-B: KYOEN_Reminders（3種類: 前日18:00 / 当日8:00 / 終了後10分）
  - WF-C: KYOEN_Cards（完全形 + 誘導形）
  - 共通: KYOEN_Push_Retry（再送キュー）
  - ノード構成図（詳細）
  - 実装優先順位

### 6. テストスイート
- **TEST_PAYLOADS.md**:
  - message イベント（コマンド検出）
  - postback イベント（詳細表示）
  - cron トリガーシミュレーション
  - Supabase レスポンス例
  - LINE Push APIペイロード
  - エラーケーステスト
  - パフォーマンステスト
  - 統合テストシナリオ

## 🚀 次のステップ

### Cursor でやること（配置＆差分反映パック v1）

1. **ブランチ作成**
   ```bash
   git checkout -b chore/kyoen-rollout
   ```

2. **ディレクトリ配置**
   ```bash
   # このパッケージの workflows/kyoen/ を以下にコピー
   cp -r workflows/kyoen/ /path/to/your-repo/workflows/kyoen/
   
   # ドキュメントも配置
   mkdir -p docs/kyoen/
   cp MASTER_OVERVIEW.md docs/kyoen/
   cp PROGRESS.md docs/kyoen/
   ```

3. **CI設定確認**
   - `.github/workflows/harmonia-ci.yml` v4維持
   - `proofs_sync.yml` paths-only対応確認
   - `night_safe_auto.yml` context-snapshot step確認

4. **QAフック追加**
   ```bash
   # scripts/validate-flex.mjs 作成（Flex JSONスキーマ検証）
   # scripts/smoke-n8n.mjs 作成（HTTPエンドポイントテスト）
   ```

5. **PRテンプレ更新**
   - `.github/pull_request_template.md` に「KYOEN-3本」チェックリスト追加

6. **PR作成**
   ```bash
   git add .
   git commit -m "feat(kyoen): Add RSVP Collector/Reminders/Cards implementation package"
   git push origin chore/kyoen-rollout
   ```

### n8n でやること（実装）

1. **Supabase Function作成**
   ```sql
   -- workflows/kyoen/queries/rsvp_queries.md の
   -- get_event_rsvp_summary 関数をSupabaseで実行
   ```

2. **n8n ワークフロー作成**
   - KYOEN_RSVP_Collector を最優先で実装
   - workflows/kyoen/FLOWS.md のノード構成図に従う
   - 環境変数設定: N8N_LINE_TOKEN, N8N_LINE_SECRET, N8N_SB_URL, N8N_SB_KEY

3. **テスト実行**
   - workflows/kyoen/TEST_PAYLOADS.md のテストケース実行
   - message / postback / cron の3系統で成功確認

## 📋 DoD（Definition of Done）

各ワークフローの合格条件:
- [ ] 返信系は Quick Reply で即応、重い処理は Push に分離
- [ ] すべての受信イベントは `events[0]` を安全参照＋ガード節
- [ ] 例外時は Obsidian ログ＋再送キューに積む
- [ ] Supabase は UPSERT 確定・主キー/ユニーク制約で重複なし
- [ ] テストは message / postback / cron の3系統で成功

## 🔗 関連リンク

- [n8n公式ドキュメント](https://docs.n8n.io/)
- [LINE Messaging API](https://developers.line.biz/ja/docs/messaging-api/)
- [Supabase Documentation](https://supabase.com/docs)
- [Flex Message Simulator](https://developers.line.biz/flex-simulator/)

## 📝 メモ

- このパッケージは設計フェーズの成果物です
- n8nワークフローJSONは次のステップで生成します
- 質問があればGPT（しりゅう）に確認してください

---

**作成者**: Claude Desktop + MCP  
**プロジェクト**: GPT×Claude×しりゅう計画  
**バージョン**: v1.0
