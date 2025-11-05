# Council Decision: AI Overdrive Service Launch

**Date**: 2025-11-05  
**Decision**: approved  
**Status**: beta

---

## Overview

AI Overdrive を正式サービス化する。

- **ターゲット**: コーチ・コンサル・セラピスト・カウンセラー
- **コンセプト**: 「あなたの一言をAIが全SNSへ展開。創造の自動化を超えた"発信の覚醒"」
- **構成**: 開発（N8n + GPT + Mirror Gate）＋ブランドサイト（Next.js + Vercel）＋自動化（GitHub Actions）

---

## System Architecture

### 1. AIエンジン層（LINE Overdrive）
- [LINE] → [N8n Webhook] → [GPT5 or Claude API] → [Content Router]
- 出力: X / Instagram / Note / Blog / Official LINE
- N8n + Supabase + GitHub Actions + Mirror Gate連携

### 2. 自動記録層（Proof / Mirror Gate）
- すべての投稿・生成結果を `99_SYSTEM/Proofs/` に記録
- Mirror Gate によって Public Mirror へ即時反映
- `index.md` に「最新10件の生成結果」を表示

### 3. 外部表示層（AI Overdrive LP）
- `website/ai-overdrive/` ディレクトリに専用LP構築
- Next.js + Tailwind + Vercel
- Mirror Gate のProofを動的に参照して「実績」として掲載

---

## Implementation

- ✅ N8n workflow: `flows/line_overdrive.json`
- ✅ Sync script: `tools/sync-overdrive-proof.mjs`
- ✅ GitHub Actions: `.github/workflows/overdrive_sync.yml`
- ✅ LP: `website/ai-overdrive/`

---

## Beta Program

- **Status**: Open
- **Limit**: 10名限定
- **Circle**: Overdrive Circleで運用

---

## Next Steps

1. N8n workflowのデプロイ
2. Supabaseテーブル作成（`ai_overdrive_logs`）
3. LINE Bot接続
4. LPのVercelデプロイ
5. βテスター募集開始

---

**Approved by**: Council  
**Implementation**: Cursor AI Assistant

