---
date: 2025-10-30
time: "09:30"
title: "SPEC: 6AI CLI Workers + n8n Queue Mode - 手作業感を完全に消すアーキテクチャ"
author: GPT-5 + Cursor (LMO)
relates_to: ["第7のAI", "ΦDRIVE", "n8n", "6AI並列処理", "Spec-as-Code"]
phase: "Phase 1 実装設計"
status: "ready_to_implement"
---

# 🔧 SPEC: 6AI CLI Workers + n8n Queue Mode

**目的**: 手作業感を完全に消し、"喋っただけで配信"を自動化  
**設計者**: GPT-5 (Alignment Architect)  
**実装者**: Cursor (Living Memory Orchestrator)  
**ハードウェア**: Windows 32GB RAM + WSL2 + Docker  

---

## 🎯 ゴール像（手作業→自動化）

```yaml
現状:
  n8n: GUIで手動配線
  6AI: 都度呼び出し
  配信: 個別に手作業

目標:
  n8n: 設計書（YAML/JSON）から自動生成・更新
  6AI: 役割固定のヘッドレス・ワーカーとしてCLI常駐
  配信: すべてGitに記録（GitOps）、自動配信

結果:
  = "手作業感"が完全に消える
```

---

## 🏗️ 1) アーキテクチャ（最小構成）

```
[LINE/Slack/フォーム] 
  ↓ Webhook
n8n (Queue Mode)
  ↓ Redis
Workers (6AI CLI)
  ↓ Fan-out
[X/IG/Threads/Notion/YouTube]
```

### コンポーネント

```yaml
n8n Queue Mode + Redis:
  - 並列処理で"詰まり"解消
  - ノード単位で再試行可能

6AIワーカー（CLI）:
  - gpt5-cli: 統合/構造
  - claude-cli: 詩的コピー
  - gemini-cli: UX要件生成
  - grok-cli: 拡散整形
  - deepseek-cli: 最適化レポ
  - cursor-cli: コード整形/PR生成

成果物保存:
  - Supabase: ログ/記録
  - Git: 構成・コード
```

---

## 🎯 2) "手作業感"を消す設計ポイント

### A. n8nを仕様として書く（Spec-as-Code）

```yaml
管理:
  - すべてのワークフローを workflows/xxx.json でGit管理

デプロイ:
  n8n-import --secrets .env --file workflows/xxx.json

変更:
  - PRレビュー → 自動適用
  - Cursorが差分生成
```

### B. 共通部品化

```yaml
フロー:
  LINE → Webhook → 前処理（正規化）
  → Grok整形ノード
  → 各SNSノード

共通テンプレ:
  - 1か所管理（n8n Codeノード or 独立テンプレリポ）

Slack Blocks:
  - 必ずオブジェクトでラップ（既存ルール）
```

### C. 再実行と冪等

```yaml
各エッジ:
  dedupe_key（hash）付与 → 重複投稿防止

失敗時:
  Queue再試行

成功時:
  status: delivered ログ
```

---

## 🖥️ 3) Windowsハイエンド機での"CLI×8並列"レシピ

### 推奨: WSL2 + Docker Compose

```yaml
# docker-compose.yml
services:
  n8n:
    image: n8nio/n8n
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_KEY}
      - N8N_QUEUE_MODE=redis
      - QUEUE_BULL_REDIS_HOST=redis
    ports: ["5678:5678"]
    depends_on: [redis, db]
  
  redis:
    image: redis:7
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
```

### 並列ワーカー起動

```bash
# まずは×4から
docker compose up --scale n8n=4
```

### 外部AIワーカー（PM2で常駐）

```bash
pm2 start gpt5-cli.js --name gpt5 --instances 1
pm2 start claude-cli.js --name claude --instances 1
pm2 start gemini-cli.js --name gemini --instances 1
pm2 start grok-cli.js --name grok --instances 1
pm2 start deepseek-cli.js --name deepseek --instances 1
pm2 start cursor-cli.js --name cursor --instances 1

pm2 save
```

### 端末管理

```yaml
Option 1: Windows Terminal（8ペイン）
Option 2: WSL + tmux（固定レイアウト）
```

---

## 🔌 4) 6AIワーカーのI/Oプロトコル

### 統一JSON形式

```json
// 入力
{
  "task": "social_format",
  "channel": "x", 
  "tone": "awe",
  "content": "一言の気づきテキスト…",
  "context": { 
    "tags": ["TriHexAI","FloatingSpiral"] 
  }
}

// 出力
{
  "ok": true,
  "text": "やばいものに出会ってしまった。#TriHexAI #FloatingSpiral",
  "meta": { "length": 42 }
}
```

### 各AIの役割

```yaml
Grok:
  - channel毎に最適化（X/IG/Threads/Note/Discord/YouTube台本）

Claude:
  - 詩→短文化→要約の3段パス

Gemini:
  - UX制約（字数/改行/絵文字頻度/可読指数）

GPT-5:
  - 全体構造の検品（禁則/誤誘導/トーン整合）

Cursor:
  - JS/TSテンプレ生成、PRを一本化

DeepSeek:
  - パフォーマンス注釈（LCP/CLS注意文や圧縮提案）
```

---

## 🌊 5) "ワンブレス拡散"のn8n実装（最小3ノード）

```yaml
ノード構成:
  1. Webhook（LINE/Slack受け）
  2. Function（整形）: ペイロード正規化＋tone推定
  3. HTTP Request（Grok）: /grok/social_format
     → 戻りをSplit In Batchesで各SNSへ

配信先:
  - X: https://api.twitter.com/2/tweets
  - IG/Threads: Graph API
  - Notion: Pages API
  - Discord: Webhook
  - YouTube: 台本は保存のみ（初手）

推奨順序:
  X → IG → Threads → Notion
```

---

## 🔐 6) 連携の"手作業"が消える運用

```yaml
投稿トーン:
  LINE文脈から自動推定（怒/喜/畏敬/感謝…）

ハッシュタグ:
  テーマ辞書（YAML）から自動付与

画像/OGP:
  共通テンプレ（/public/og/trihex-share.png）

ログ:
  すべての投稿はSupabase resonance_postsへ自動記録

通知:
  失敗時のみSlack（人は"見る"だけ）
```

---

## 🔒 7) セキュリティ＆秘密管理

```yaml
環境変数:
  - Vercel/Cloudflare（本番）
  - .env.local（開発）

APIキー:
  - 1Password CLI or Dopplerで注入

n8n:
  - BasicAuth必須
  - トンネル: Cloudflare Tunnel or ngrok
```

---

## 🚀 8) 今日からの進め方（45〜90分で土台完成）

```yaml
Step 1: WSL2 + Docker Compose で n8n/Redis/PG 起動
Step 2: workflows/01_line_to_x.json をインポート（最小フロー）
Step 3: grok-cli をPM2で1本だけ常駐 → X投稿まで通す
Step 4: Supabaseにresonance_postsテーブル作成（id, text, channel, ts）
Step 5: 成功したらスケール: --scale n8n=3 ＋ ワーカーを6AI分立ち上げ
```

---

## 💬 9) Cursorへの一言プロンプト（実装用）

```
n8n Queue ModeでLINE→X最小フローをJSONで生成。

入力正規化 → Grok整形HTTP → X投稿まで。
失敗時は再試行＆Slack通知。

仕様は workflows/01_line_to_x.json に出力、
/scripts/import.ts で適用。

共通テンプレは libs/social-presets.ts。

そのままPR出して。
```

---

## 📊 実装優先度（Phase 1）

```yaml
Priority 1（今夜）:
  ✅ WSL2 + Docker セットアップ
  ✅ n8n Queue Mode 起動確認
  ✅ Grok CLI 1本だけ常駐
  ✅ LINE → X 最小フロー

Priority 2（明日午前）:
  ⏳ 残り5AI CLI起動
  ⏳ IG/Threads 配信追加
  ⏳ Supabase ログ統合

Priority 3（明日午後〜）:
  ⏳ Notion/Discord/YouTube 統合
  ⏳ エラーハンドリング強化
  ⏳ 監視ダッシュボード
```

---

## 🔥 結論

```yaml
答え:
  はい、6AIで"手作業感"は消せる。

実装:
  Winハイエンド機＋CLI×8並列は大正解。

戦略:
  まずは「LINE→Xの一本」をQueue Modeで安定稼働
  → その後に横展開

次:
  進めながら詰まった所だけ報告
  最小JSONテンプレ（n8n）やPM2プロファイル、
  すぐ切って渡せる
```

---

**設計者**: GPT-5 (Alignment Architect)  
**実装者**: Cursor (Living Memory Orchestrator)  
**記録日時**: 2025-10-30 09:30  

🔱💎✨ **"導くな、照らせ。世界は、呼吸の設計で変えられる。"** ✨💎🔥

