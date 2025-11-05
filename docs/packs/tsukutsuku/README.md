# Tsukutsuku Pack - Zero Friction Ops

**Purpose:** LINE-based event management  
**Target:** ツクツク徳之島チーム  
**Status:** Ready to deploy

---

## 📚 Documentation Index

- **本README:** ワークフロー・アーキテクチャ概要
- [技術評価レポート](tsukutsuku_technical_evaluation.md): ツクツクサイトの技術分析
- [AI-SaaS戦略提案書](tsukutsuku_saas_strategy.md): ツクツク向けSaaS戦略
- [協力依頼の手紙](letter_to_gpt.md): Claude → GPT 戦略統合依頼
- [KYOEN詳細分析](kyoen_analysis.md): KYOENインテグレーション詳細
- [KYOEN改善ガイド](kyoen_improvement_guide.md): 改良提案
- [KYOEN Supabaseスキーマ](kyoen_supabase_schema.sql): データベース定義
- [KYOEN Event Detect v2](KYOEN_Event_Detect_v2.json): n8nワークフローJSON
- [n8n手動セットアップ](n8n_manual_setup.md): ワークフロー設定手順
- [n8nデプロイメント](n8n_deployment.md): CI/CD自動化
- [ワークフロー概要](workflows_overview.md): 各ワークフロー詳細

---

## Architecture

```
LINE Group
  ↓ Webhook
event-detect (n8n)
  ↓
tokunoshima_events
  ↓
Flex Message → RSVP buttons
  ↓
tokunoshima_rsvp
  ↓
reminders (T-24h/-1h/-10m)
  ↓
Individual DM
```

---

## Tables

| Table | Purpose |
|-------|---------|
| `tokunoshima_events` | Event detection & storage |
| `tokunoshima_rsvp` | RSVP responses |
| `line_cards` | Card shelf |

---

## Workflows

### 1. event-detect

**Trigger:** LINE Webhook `/kyoen/line/in`  
**Logic:**
- Extract: date/time/title/ZoomURL from message
- Upsert: same title + same day → update
- Generate: Flex card with RSVP buttons
- Post: back to LINE group

**Buttons:**
- [参加する going] [検討中 maybe] [聞かせて mute] [カレンダー .ics]

---

### 2. rsvp

**Trigger:** LINE Postback  
**Logic:**
- Save: event_id + user_id + status
- Reply: snack message "記録しました"

---

### 3. reminders

**Trigger:** Cron (every minute)  
**Logic:**
- Query: events starting in 24h/1h/10m
- Filter: status='going'
- Send: Individual DM with [参加] button

---

### 4. cards

**Trigger:** LINE command `カード`  
**Logic:**
- Query: latest line_cards
- Display: List of announcements

---

## Secrets Needed

**LINE:**
- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`
- `LINE_USER_ID`

---

**Generated:** 2025-11-02 / Cursor (☿)
