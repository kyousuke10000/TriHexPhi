# GPT×Claude×しりゅう計画 - MASTER OVERVIEW

## 三位一体オーケストレーション

```
┌─────────────────────────────────────────────────────────┐
│              GPT-5 Thinking (しりゅう)                    │
│         仕様統合 / 指示パック / DoD / 進行管理             │
└─────────────────┬───────────────────────────────────────┘
                  │ 指示パック配信
         ┌────────┴────────┐
         │                 │
    ┌────▼─────┐      ┌───▼──────┐
    │  Claude  │      │  Cursor  │
    │ Desktop  │      │          │
    │  + MCP   │      │   Git    │
    └──────────┘      └──────────┘
    n8n実装           配置＆反映
    LLM設計           CI連携
    正規表現          差分管理
    JSON I/O          
```

## プロジェクト概要

**目的**: LINEグループ→Supabase→自動化の完全運用システム（KYOEN）

### 痛点→解決
- **情報洪水** → 分類・記録・要約・配信を自動化
- **Zoom乱発＆議事録なし** → 議事録テンプレ＆自動要約＆配布を標準化
- **イベント管理がアナログ** → RSVP（参加管理）＋リマインダを自動化
- **告知素材が大変** → AIカード生成で配布を高速化

## アーキテクチャ

### インフラスタック
```
LINE Messaging API
    ↓
n8n Workflows (4本 + α)
    ↓
Supabase (PostgREST)
    ├─ kyoen_messages
    ├─ kyoen_events
    ├─ kyoen_rsvp
    ├─ kyoen_meetings
    └─ kyoen_cards
```

### 環境変数
- `N8N_LINE_TOKEN`
- `N8N_LINE_SECRET`
- `N8N_SB_URL`
- `N8N_SB_KEY`

## ワークフロー構成（4本柱）

### WF-1: KYOEN Event Detect & Triage
**役割**: 受信→意図分類→即時レス→非同期処理へ振り分け

```
Webhook → 署名検証 → 意図分類 → Supabase保存
   ↓                                    ↓
Reply (即時200)              分岐: event/rsvp/task/question/link/misc
```

**分類ルール**:
- `/event` or `イベント:` → `event`
- `/rsvp` or `参加/不参加/たぶん` → `rsvp`
- `/meeting` or `ZoomURL` → `meeting`
- `/card` → `card`
- `URLのみ` → `link`
- `?で終わる` → `question`
- `TODO:/タスク:` → `task`
- `else` → `misc`

### WF-2: KYOEN RSVP Flow
**役割**: イベント確定→参加募集→RSVP記録→リマインド設定

```
イベント確定 → kyoen_events INSERT
              ↓
        参加募集 Push (Quick Reply: はい/いいえ/たぶん)
              ↓
        RSVPタップ → kyoen_rsvp UPSERT
              ↓
        参加率サマリ Push
```

### WF-3: Reminders & Minutes
**役割**: Zoom運用＋議事録テンプレ化

**3つのリマインダータイプ**:
1. **前日18:00**: 全員へ告知（groupId対象）
2. **当日朝8:00**: 参加者「yes」のみへ最終案内
3. **終了後10分**: 会話ログ→要約→議事録Draft

```
/meeting start → kyoen_meetings INSERT
                      ↓
                アジェンダ雛形 Push
                      ↓
/meeting end → 直近N分の会話収集
                      ↓
                LLM要約→議事録テンプレ整形
                      ↓
                議事録 Push & DB更新
```

### WF-4: KYOEN Cards
**役割**: 告知画像をワンコマンドで作成→配布

```
/card {title}|{when}|{where}|{subtitle}
              ↓
        LLMで短文化＆整形
              ↓
        SVGテンプレ組み立て→PNG化
              ↓
        Supabase Storage アップロード
              ↓
        画像URL Push
```

## 運用原則

### 設計原則
1. **即時返信** (replyToken) は軽量ガイドのみ
2. **重い処理** は Push で後から投稿
3. **署名検証** は必須（本番）
4. **Textサニタイズ**: `\n` → `\\n` でJSON崩壊防止

### Non-Operational Notice（運用ガード）
- 参加は常に任意（Opt-in/Opt-out明示）
- 自動要約＝下書き扱い（最終決定は人）
- "場＝Harmonia"は人格化しない（権威ではない）
- 長文/機密はDMへ誘導（公開総量を最小化）

## DoD（Definition of Done）

各ワークフローの合格条件:
- [ ] 返信系は Quick Reply で即応、重い処理は Push に分離
- [ ] すべての受信イベントは `events[0]` を安全参照＋ガード節
- [ ] 例外時は Obsidian ログ＋再送キューに積む
- [ ] Supabase は UPSERT 確定・主キー/ユニーク制約で重複なし
- [ ] テストは message / postback / cron の3系統で成功

## テスト必須項目

1. **受信OK**: 任意テキスト送信→200即時＆kyoen_messages に INSERT
2. **分類OK**: 各intent パターン → 適切な分類
3. **RSVP**: Quick Reply で Yes/No/Maybe → kyoen_rsvp に UPSERT
4. **会議**: `/meeting start` → 開始メッセージ、終了で要約 push
5. **カード**: `/card ...` → 画像URL返却、Storage に保存確認
6. **失敗系**: LLM遅延時、reply即時＋後Push でフォールバック

## ディレクトリ構造

```
workflows/kyoen/
  ├─ KYOEN_EventDetect.json
  ├─ KYOEN_RSVP.json
  ├─ KYOEN_Reminders.json
  ├─ KYOEN_Cards.json
  ├─ KYOEN_Push_Retry.json
  └─ flex/
      ├─ event_list.flex.json
      ├─ rsvp_detail.flex.json
      └─ reminder.flex.json

docs/kyoen/
  ├─ README.md (10分セットアップ)
  ├─ TEST_PAYLOADS.md
  └─ FLOWS.md (ノード一覧と繋ぎ)

scripts/
  ├─ validate-flex.mjs
  └─ smoke-n8n.mjs
```

## 将来の拡張（PostFlow接続）

- Cards の出力を PostFlow（X/IG/note 連携）に接続
- kyoen_posts テーブル増設で SNS 予約投稿キュー化
- API制限対応（Instagram Graph の Rate/認証維持）

---

**最終更新**: 2025-11-04  
**ステータス**: Phase 2 - RSVP Collector / Reminders / Cards 実装中
