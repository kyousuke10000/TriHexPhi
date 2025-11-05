# PROGRESS - GPT×Claude×しりゅう計画 進捗管理

## プロジェクトステータス

**現在フェーズ**: Phase 2 - RSVP Collector / Reminders / Cards 実装  
**最終更新**: 2025-11-04  
**総進捗**: 55% (設計完了、実装準備完了)

## マイルストーン

### ✅ Phase 1: Event Detect & Triage (完了)
- [x] Webhook 受信基盤
- [x] LINE署名検証
- [x] 意図分類ロジック
- [x] Supabase kyoen_messages 保存
- [x] 即時Reply + 非同期Push 分離

### 🔄 Phase 2: RSVP / Reminders / Cards (進行中)
- [x] RSVP Flow 基本骨格
- [x] **正規表現パターン作成** (30ケース)
- [x] **Supabaseクエリ作成** (集計・詳細取得)
- [x] **Flex Message雛形3種** (event_list / rsvp_detail / reminder)
- [x] **ノード構成図作成** (3ワークフロー)
- [x] **テストペイロード作成** (message / postback / cron)
- [ ] n8n実装: RSVP Collector
- [ ] n8n実装: Reminders (3種類)
- [ ] n8n実装: Cards
- [ ] Supabase Function作成
- [ ] 実地テスト（3系統）

### ⏳ Phase 3: PostFlow連携 (未着手)
- [ ] X/IG/note 連携
- [ ] kyoen_posts テーブル
- [ ] SNS予約投稿キュー

---

## 実行ログ（新しい順）

### 2025-11-04 - 実装指示パック v1 完了

**実施者**: Claude Desktop + MCP  
**実施内容**:
- ✅ 正規表現パターン作成（30ケース検証済み）
  - コマンド検出、日時抽出、日本語日付、時刻、場所抽出
  - ファイル: `workflows/kyoen/regex/rsvp_patterns.md`
- ✅ Supabaseクエリ作成
  - イベント一覧集計、参加者詳細、エラーハンドリング
  - ファイル: `workflows/kyoen/queries/rsvp_queries.md`
- ✅ Flex Message雛形 3種作成
  - `event_list.flex.json` (イベント一覧Carousel)
  - `rsvp_detail.flex.json` (参加者詳細)
  - `reminder.flex.json` (リマインダー3タイプ対応)
- ✅ Flexバインディングコード作成
  - データ変換ロジック、LINE Push API連携
  - ファイル: `workflows/kyoen/flex/flex_binding.md`
- ✅ 3ワークフローのノード構成図作成
  - RSVP Collector (メイン + Postback)
  - Reminders (3種類: 前日/当日/終了後)
  - Cards (完全形 + 誘導形)
  - ファイル: `workflows/kyoen/FLOWS.md`
- ✅ テストペイロード作成（30+ケース）
  - message, postback, cron シミュレーション
  - エラーケース、パフォーマンステスト含む
  - ファイル: `workflows/kyoen/TEST_PAYLOADS.md`

**成果物**:
```
workflows/kyoen/
  ├─ regex/
  │   └─ rsvp_patterns.md (正規表現30ケース)
  ├─ queries/
  │   └─ rsvp_queries.md (SQLクエリ＋関数)
  ├─ flex/
  │   ├─ event_list.flex.json
  │   ├─ rsvp_detail.flex.json
  │   ├─ reminder.flex.json
  │   └─ flex_binding.md (バインディングコード)
  ├─ FLOWS.md (ノード構成図)
  └─ TEST_PAYLOADS.md (テストデータ)
```

**次のアクション**:
1. Cursor で配置＆PR作成（配置＆差分反映パック v1）
2. n8n実装（RSVP Collector から優先）
3. Supabase Function作成（`get_event_rsvp_summary`）
4. 実地テスト（message / postback / cron の3系統）

**課題・ブロッカー**: 
- なし（設計完了、実装フェーズへ移行可能）

---

### 2025-11-04 - RSVP Collector 着手

**実施者**: Claude Desktop + MCP  
**実施内容**:
- MASTER_OVERVIEW.md 作成（全体像の可視化）
- PROGRESS.md 作成（進捗管理体制確立）
- 次：実装指示パック v1 実行準備

**次のアクション**:
1. 実装指示パック v1 を Claude Desktop で実行
2. 正規表現／Flex雛形／クエリ／n8nドラフト を生成
3. Cursor で配置＆PR作成

**課題・ブロッカー**: なし

---

## 今後の実装予定

### 直近（今週）
1. **RSVP Collector**
   - `/rsvp list` コマンド実装
   - Supabase 集計クエリ
   - Flex Message 表示（event_list.flex.json）
   - 詳細表示（postback → rsvp_detail.flex.json）

2. **Reminders**
   - 前日18:00 全員告知（Cron + Supabase SELECT）
   - 当日8:00 参加者「yes」のみ最終案内
   - 終了後10分 議事ドラフト（会話ログ→要約→Flex）
   - KYOEN_Push_Retry 再送キュー強化

3. **Cards**
   - `/card` コマンド実装
   - Quick Reply「カード作る」誘導
   - 必要項目穴埋め質問フロー
   - event_notice.flex.json 生成→Push

### 中期（来月）
- Daily Digest 自動配信（毎朝9:00）
- テスト自動化（smoke-n8n.mjs）
- PostFlow 連携準備

---

## 技術スタック確認

### 実装済み
- ✅ LINE Messaging API（Direct接続）
- ✅ Supabase（PostgREST）
- ✅ n8n Workflows（Event Detect v2）
- ✅ MCP（n8n-mcp ツール群）

### 今回使用予定
- n8n-mcp: `search_nodes`, `get_node_essentials`, `validate_node_operation`
- Supabase: `kyoen_events`, `kyoen_rsvp` テーブル
- Flex Message: 3種類の雛形

---

## 役割分担（再確認）

| 役割 | 担当 | 責務 |
|------|------|------|
| **総指揮** | GPT-5 Thinking (しりゅう) | 仕様統合、指示パック生成、DoD提示、進行管理 |
| **実装** | Claude Desktop + MCP | n8n実装、LLM設計、正規表現、JSON I/O |
| **配置** | Cursor | Git管理、ディレクトリ配備、CI連携、差分反映 |

---

## 実行ログテンプレート（コピペ用）

```
### YYYY-MM-DD - [作業タイトル]

**実施者**: [Claude Desktop / Cursor / GPT]
**実施内容**:
- [項目1]
- [項目2]
- [項目3]

**成果物**:
- [ファイル名1]
- [ファイル名2]

**次のアクション**:
1. [次にやること1]
2. [次にやること2]

**課題・ブロッカー**: [あれば記載 / なければ「なし」]
```

---

**最終更新**: 2025-11-04  
**次回更新予定**: 実装指示パック v1 実行後
