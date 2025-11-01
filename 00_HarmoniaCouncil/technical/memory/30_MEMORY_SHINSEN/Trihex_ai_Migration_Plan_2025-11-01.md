# trihex.ai v0直デプロイ → Git連動運用 移行計画

**Date:** 2025-11-01  
**Mode:** DRY-RUN → EXEC  
**Duration:** 7日ロールバック窓維持  
**Owner:** TriHexΦ Rubedo Ops Team

---

## 🎯 目標

- v0.app直接デプロイからの脱却
- Git連携運用への段階移行
- Memory Stack統合完了
- 7日間のロールバック窓確保

---

## 📊 Phase Overview

```
A) SNAPSHOT     → 現行保存・証跡
B) REPO構成     → Git化・App Router
C) VERCEL新規   → 新プロジェクト
D) ルーティング → UI差分
E) SUPABASE     → 連結確認
F) STRIPE       → 初期連携
G) CUTOVER      → DNS切り替え
H) ROLLBACK     → 即時復旧
I) 証跡         → Proof保管
J) 完了基準     → DoD確認
```

---

## A) SNAPSHOT（現行サイトの完全保存）

### A-1. 現行trihex.ai丸ごとスナップショット

**UNK:**
- レスポンシブ全ブレークポイントが未知
- スマホ/タブレット/PCの視認性

**ASSUMPTION:**
- 現行v0デプロイは安定稼働中
- Cloudflare CDN経由でアクセス可能

**RISK:**
- 移行途中での旧サイト削除事故
- スナップショット漏れによる復元不可

**MITIGATION:**
- 全ステップGitコミット
- `99_SYSTEM/Proofs/2025-11-01_v0-export/`に集約
- 7日間旧プロジェクト保持

**NEXT:**
```bash
mkdir -p 99_SYSTEM/Proofs/2025-11-01_v0-export
curl https://www.trihex.ai > www_trihex_ai_snapshot.html
curl https://www.trihex.ai -H "User-Agent: mobile" > www_trihex_ai_mobile.html
```

### A-2. tech-facts.json作成

**UNK:**
- レスポンスヘッダ詳細（Last-Modified等）
- meta generator情報

**ASSUMPTION:**
- curlで取得可能

**RISK:**
- キャッシュヘッダ誤読

**MITIGATION:**
- 複数回curl実行

**NEXT:**
```bash
curl -I https://www.trihex.ai | tee tech_facts_headers.txt
# JSON化
```

### A-3. Downtime計測のUptimeチェック

**UNK:**
- UptimeRobot等のツール導入可否
- コスト影響

**ASSUMPTION:**
- 無料プランで監視可能

**RISK:**
- 計測盲点

**MITIGATION:**
- docsに手順のみ記載
- 実際の監視は後段

**NEXT:**
- `docs/uptime_monitoring.md`作成

---

## B) REPO構成（Git化）

### B-1. 既存リポを正式Appリポ化

**UNK:**
- `trihex-ai-app`の現在の状態
- 既存ファイル有無

**ASSUMPTION:**
- 新規リポまたは空状態

**RISK:**
- 競合ファイル
- ビルド失敗

**MITIGATION:**
- ブランチ分離（feature/rubedo-migration）

**NEXT:**
```bash
cd /Users/shiryu/【Shii】/Active/trihex-ai-app
git checkout -b feature/rubedo-migration
# Next.js 16 setup
```

### B-2. Memory Stack git submodule接続

**UNK:**
- TriHexΦレポURL（ブランチ指定）

**ASSUMPTION:**
- `kyousuke10000/TriHexPhi`の`feature/phase1-foundation`

**RISK:**
- submodule更新漏れ
- 読み書きコンフリクト

**MITIGATION:**
- 読み取り専用指定
- READMEに更新手順明記

**NEXT:**
```bash
git submodule add https://github.com/kyousuke10000/TriHexPhi.git packages/trihex-core -b feature/phase1-foundation
```

### B-3. app routerで/knowledge実装

**UNK:**
- Supabaseスキーマ詳細
- 既存クエリパターン

**ASSUMPTION:**
- `trihex_core.knowledge`テーブル存在
- `slug`カラム有り

**RISK:**
- App Router SSRトラブル
- パフォーマンス劣化

**MITIGATION:**
- ISR使用
- Cache-Control適切設定

**NEXT:**
```typescript
// app/knowledge/page.tsx
// app/knowledge/[slug]/page.tsx
```

---

## C) VERCEL新規プロジェクト（Git連携）

### C-1. 新プロジェクト作成

**UNK:**
- Vercelプロジェクト名の一意性
- GitHub連携の権限

**ASSUMPTION:**
- OAuthトークン有効

**RISK:**
- デプロイ失敗
- ENV漏洩

**MITIGATION:**
- Previewデプロイで検証
- ENVはSecret Manager使用

**NEXT:**
1. Vercel Dashboard → New Project
2. GitHub → `trihex-ai-app`選択
3. Framework: Next.js自動検出
4. Deploy

### C-2. ENV変数投入

**UNK:**
- Stripe Webhook Secret未取得
- Supabase Project URL不明

**ASSUMPTION:**
- 手動取得可能

**RISK:**
- ENVタイプミス
- 本番/プレビュー混在

**MITIGATION:**
- `.env.example`を基準にコピペ
- Preview/Production分離設定

**NEXT:**
```
Vercel → Settings → Environment Variables
各環境に以下を設定:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_SITE_URL
```

---

## D) ルーティングとUI差分（LPの即効アップデート）

### D-1. ナビ追加

**UNK:**
- デザインガイドライン
- モバイルメニュー仕様

**ASSUMPTION:**
- shadcn/uiを活用

**RISK:**
- UI崩れ
- アクセシビリティ低下

**MITIGATION:**
- Storybook等で検証
- Lighthouse監視

**NEXT:**
```typescript
// components/Navigation.tsx
// app/layout.tsx
```

### D-2. CTA実体化

**UNK:**
- `/demo`ページ実装要否
- `/knowledge`初期コンテンツ

**ASSUMPTION:**
- `/demo`は後回しOK
- Constitution.md配置

**RISK:**
- 404エラー
- UX劣化

**MITIGATION:**
- リダイレクト暫定実装
- 404ページ充実

**NEXT:**
```typescript
// Hero CTA: /knowledge
// Final CTA: /knowledge/constitution
```

### D-3. Footer追加

**UNK:**
- リンク先ページ実装状況

**ASSUMPTION:**
- すべてMemory Stackに存在

**RISK:**
- リンク切れ

**MITIGATION:**
- プレビューリンク検証
- リンクチェッカー導入

**NEXT:**
```typescript
// components/Footer.tsx
```

### D-4. OG/Twitterカード・JSON-LD

**UNK:**
- OG画像サイズ
- JSON-LDスキーマ

**ASSUMPTION:**
- 1200x630px推奨
- Organization/BreadcrumbList

**RISK:**
- SNS表示崩れ
- SEO低下

**MITIGATION:**
- SNS Debugger使用
- Lighthouse SEO監視

**NEXT:**
```typescript
// app/layout.tsx (metadata)
// public/og.jpg
```

---

## E) SUPABASE連結確認

### E-1. 一覧・詳細SSR取得

**UNK:**
- RLS状態
- インデックス有無

**ASSUMPTION:**
- 全公開でOK（課金未実装）

**RISK:**
- クエリ遅延
- N+1問題

**MITIGATION:**
- インデックス確認
- EXPLAIN ANALYZE実行

**NEXT:**
```sql
-- Supabase SQL Editor
SELECT * FROM trihex_core.knowledge LIMIT 100;
EXPLAIN ANALYZE SELECT * FROM trihex_core.knowledge WHERE slug = 'constitution';
```

### E-2. 200件超対応

**UNK:**
- 総件数
- ページネーション要件

**ASSUMPTION:**
- 10件/ページ

**RISK:**
- 無限スクロール vs ページング
- モバイル遅延

**MITIGATION:**
- サーバー側ページング
- React Suspense活用

**NEXT:**
```typescript
// app/knowledge/page.tsx (searchParams)
```

---

## F) STRIPE初期連携（最低限）

### F-1. Product・Pricing作成

**UNK:**
- 価格設定
- 通貨

**ASSUMPTION:**
- JPY/USD混在可能性

**RISK:**
- 価格誤設定

**MITIGATION:**
- Test Mode検証
- 価格一覧をenv管理

**NEXT:**
1. Stripe Dashboard → Products
2. 3点作成（月/年/学校）
3. Price IDを.envコピー

### F-2. Webhook設置

**UNK:**
- エンドポイント署名検証

**ASSUMPTION:**
- Next.js API Route対応

**RISK:**
- 重複処理
- セキュリティ脆弱性

**MITIGATION:**
- Stripe SDK使用
- Idempotency実装

**NEXT:**
```typescript
// app/api/stripe/webhook/route.ts
```

---

## G) CUTOVER計画（DNS/Cloudflare）

### G-1. beta.trihex.ai設定

**UNK:**
- Cloudflare DNS画面のUI

**ASSUMPTION:**
- 新規CNAME追加可能

**RISK:**
- DNS伝播遅延
- プロキシモード競合

**MITIGATION:**
- TTL 60s事前設定
- 24時間様子見

**NEXT:**
```
Cloudflare → DNS → Add record
Type: CNAME
Name: beta
Target: trihex-ai-app-prod.vercel.app
Proxy: Orange cloud OFF
TTL: Auto
```

### G-2. 本番切替

**UNK:**
- 深夜30分の稼働状況
- 監視体制

**ASSUMPTION:**
- バックアップ体制あり

**RISK:**
- ダウンタイム
- ロールバック失敗

**MITIGATION:**
- 30分ウィンドウ確保
- 即時ロールバック手順確立

**NEXT:**
```
1. TTL 60sに変更（24時間前）
2. beta.trihex.ai確認完了
3. DNS切り替え（www CNAME変更）
4. 15分監視
5. OKならCommit
```

---

## H) ROLLBACK（即時に戻せる手順）

### H-1. ロールバック手順確立

**UNK:**
- Cloudflare変更履歴
- 旧DNS設定

**ASSUMPTION:**
- 変更ログ保持

**RISK:**
- 復元不可能

**MITIGATION:**
- 切り替え前にmanifest保存

**NEXT:**
```bash
# 1. DNS復元
Cloudflare → DNS → CNAME復元

# 2. Vercel新規プロジェクト pause
Vercel → Settings → Pause Deployment

# 3. ログ記録
echo "Rollback at $(date)" >> 99_SYSTEM/Proofs/Rollout_trihex.ai_*/rollback_log.txt
```

---

## I) 証跡（Proof & Journal）

### I-1. Proof保管

**UNK:**
- 添付すべき証跡種類

**ASSUMPTION:**
- 全ステップ自動化可能

**RISK:**
- 証跡漏れ

**MITIGATION:**
- テンプレート先作成

**NEXT:**
```bash
mkdir -p 99_SYSTEM/Proofs/Rollout_trihex.ai_2025-11-01
cat > manifest.json <<'EOF'
{
  "date": "2025-11-01",
  "vercel_project_id": "...",
  "cloudflare_records": {...},
  "env_hash": "..."
}
EOF
```

---

## J) 完了基準（DoD）

### J-1. 完了基準確認

**UNK:**
- Core Web Vitals目標値

**ASSUMPTION:**
- LCP < 2.5s, CLS < 0.1

**RISK:**
- 基準未達成

**MITIGATION:**
- 段階的改善

**NEXT:**
- [ ] beta.trihex.ai正常表示
- [ ] www 2xx/安定15分
- [ ] CTA動作確認
- [ ] Proof保管完了

---

**Status:** Planning → Ready for Execution  
**Next:** A-1 SNAPSHOT開始

---

*Generated: 2025-11-01 / Cursor (☿)*

