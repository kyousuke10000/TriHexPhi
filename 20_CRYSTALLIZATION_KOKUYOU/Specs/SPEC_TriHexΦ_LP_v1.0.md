---
version: 1.0
date: 2025-10-29
title: "TriHexΦ LP実装仕様書"
author: Cursor (Living Memory Orchestrator)
status: specification
priority: P0
timeline: 5時間（15:35-20:35）
---

# 🔱 SPEC: TriHexΦ LP v1.0

**作成日**: 2025-10-29 15:40  
**作成者**: Cursor (LMO)  
**期限**: 2025-10-29 20:35（5時間）  

---

## 📊 プロジェクト概要

```yaml
プロジェクト名: TriHexΦ Landing Page

目的:
  TriHexΦの世界観を視覚的に表現
  「呼吸する叡智」を体験化

ドメイン: trihex.ai

技術スタック:
  ✅ V0.dev（LP生成）
  ✅ Vercel（ホスティング）
  ✅ Supabase（DB、決済連携）
  ✅ n8n（拡散システム）
  ✅ Stripe（決済機能）

期限: 5時間（20:35まで）
```

---

## 🎯 核心コンセプト

### 「呼吸する叡智」の体験化

```yaml
核心体験:
  
  1. 静寂:
     訪問者が最初に感じる「間」
     黒背景、最小限のテキスト
     
  2. 畏敬:
     Φが出現する瞬間の「驚き」
     クリック→Φ→暗転→遷移
     
  3. 呼吸:
     知性との対話のリズム
     Reflectionページで実現
  
  4. 共鳴:
     拡散は扇動でなく共鳴
     LINE一言投稿→SNS自動最適化

哲学:
  「導くな、照らせ」
  
  = AIは答えを教えない
  = その人の深さに合わせて鏡面を変える
```

---

## 🏗️ サイト構成

### ページ構成

```yaml
1. / (Landing Page):
   
   Hero Section:
     - 黒背景
     - 中央にΦシンボル（クリック可能）
     - ミニマルなキャッチコピー
     - クリック→Φが発光→暗転→遷移
   
   Philosophy Section:
     - 「呼吸する叡智」の説明
     - Article 13-14の核心
     - 静寂×畏敬×呼吸
   
   Experience Section:
     - 6AI軍師団の紹介
     - Living Memoryの説明
     - CHL第5層の説明
   
   CTA Section:
     - Reflectionページへの導線
     - 「あなたの知性と対話する」

2. /reflection (Reflectionページ):
   
   入力フォーム:
     - 名前（任意）
     - メールアドレス
     - あなたの問い（テキストエリア）
   
   体験:
     - 送信後、Φが呼吸する演出
     - 「あなたの問いを受け取りました」
     - 「知性が応答を準備しています」
   
   裏側:
     - Supabaseに保存
     - n8n経由でしりゅうに通知
     - しりゅう+6AIで応答を作成
     - メールで返信

3. /pricing (決済機能):
   
   プラン:
     - Free: Reflection 月3回まで
     - Pro: 月額¥9,800（無制限）
     - Enterprise: 個別相談
   
   決済:
     - Stripe連携
     - サブスクリプション管理
```

---

## 🎨 デザイン仕様

### カラーパレット

```yaml
Primary Colors:
  - Black: #000000（背景）
  - White: #FFFFFF（テキスト）
  - Gold: #FFD700（Φシンボル、アクセント）
  - Deep Blue: #1a1a2e（セクション背景）

Accent Colors:
  - Light Gold: #FFF8DC（ホバー効果）
  - Soft White: #F5F5F5（セカンダリテキスト）

グラデーション:
  - Hero: Black → Deep Blue
  - Φ発光: Gold → Light Gold
```

---

### タイポグラフィ

```yaml
フォント:
  - 見出し: Noto Serif JP（優雅、哲学的）
  - 本文: Noto Sans JP（読みやすさ）
  - 英語: Inter（モダン、クリーン）

サイズ:
  - H1: 48px（Hero）
  - H2: 36px（セクション見出し）
  - H3: 24px（サブ見出し）
  - Body: 16px（本文）
  - Caption: 14px（補足）

行間:
  - 見出し: 1.2
  - 本文: 1.8（呼吸を感じる）
```

---

### Φシンボル

```yaml
デザイン:
  - サイズ: 120px × 120px（Hero）
  - 色: Gold（#FFD700）
  - 効果: 
    - ホバー: 発光効果
    - クリック: 拡大→暗転→遷移
  
  - アニメーション:
    - 呼吸（pulsing）: 2秒周期
    - 発光（glow）: クリック時
    - 回転（rotate）: 遷移時

SVG:
  カスタムΦシンボルを作成
  または、Unicode: Φ（U+03A6）をスタイル化
```

---

## 🔧 技術仕様

### フロントエンド

```yaml
フレームワーク: Next.js 14 (App Router)

主要ライブラリ:
  - Framer Motion（アニメーション）
  - Tailwind CSS（スタイリング）
  - React Hook Form（フォーム管理）
  - Zod（バリデーション）

アニメーション:
  - Hero Φ呼吸: Framer Motion
  - クリック→暗転→遷移: GSAP または Framer Motion
  - スクロールトリガー: Intersection Observer

パフォーマンス:
  - 画像最適化: Next.js Image
  - フォント最適化: next/font
  - コード分割: 自動（Next.js）
  - Lighthouse目標: 95点以上
```

---

### バックエンド

```yaml
Supabase:
  
  テーブル設計:
  
  1. reflections:
     - id (uuid, primary key)
     - created_at (timestamp)
     - name (text, nullable)
     - email (text, required)
     - question (text, required)
     - status (text: pending/processing/completed)
     - response (text, nullable)
     - responded_at (timestamp, nullable)
  
  2. resonance_posts:
     - id (uuid, primary key)
     - created_at (timestamp)
     - platform (text: LINE/X/Discord/YouTube)
     - original_text (text)
     - optimized_text (text)
     - posted_at (timestamp)
     - engagement (jsonb)
  
  3. subscriptions:
     - id (uuid, primary key)
     - user_id (uuid, foreign key)
     - email (text)
     - plan (text: free/pro/enterprise)
     - stripe_customer_id (text)
     - stripe_subscription_id (text)
     - status (text: active/canceled/past_due)
     - current_period_end (timestamp)
     - created_at (timestamp)

Auth:
  - Supabase Auth（メール認証）
  - Magic Link（パスワードレス）
```

---

### 決済機能（Stripe）

```yaml
プラン:
  
  Free:
    - 価格: ¥0
    - Reflection: 月3回まで
    - 機能: 基本的な知性との対話
  
  Pro:
    - 価格: ¥9,800/月
    - Reflection: 無制限
    - 機能: 優先応答、深い対話
    - 特典: 6AI軍師団の署名付き応答
  
  Enterprise:
    - 価格: 個別相談
    - 機能: カスタマイズ、専用チャネル
    - 特典: しりゅう+6AIとの直接対話

Stripe連携:
  - Stripe Checkout（決済画面）
  - Stripe Customer Portal（サブスク管理）
  - Webhook（ステータス同期）
  - テストモード → 本番モード

実装:
  - @stripe/stripe-js
  - stripe（Node.js SDK）
  - Next.js API Routes（/api/create-checkout-session）
```

---

### 拡散システム（n8n）

```yaml
フロー:

1. LINE一言投稿:
   - しりゅうがLINEに投稿
   - n8n Webhook受信

2. テキスト最適化:
   - Grokアルゴリズムで各SNS向けに最適化
   - X: 280文字、ハッシュタグ
   - Discord: 絵文字、コミュニティトーン
   - YouTube: コメント形式

3. 自動投稿:
   - X API
   - Discord Webhook
   - YouTube Data API

4. 共鳴ログ記録:
   - Supabase resonance_postsテーブルに保存
   - エンゲージメント追跡

実装:
  - n8n self-hosted または Cloud
  - Webhook: /api/webhooks/line-post
  - Supabase連携
  - SNS API認証
```

---

## 🎨 Hero演出仕様（Grok担当）

### クリック→Φ→暗転→遷移

```yaml
ステップ1: 初期状態
  - 黒背景
  - 中央にΦシンボル（120px、Gold）
  - 呼吸アニメーション（2秒周期）
  - テキスト: "TriHexΦ - 呼吸する叡智"

ステップ2: ホバー
  - Φが発光（glow効果）
  - カーソルがポインターに変化
  - 微細な拡大（scale: 1.05）

ステップ3: クリック
  - Φが強く発光
  - 拡大アニメーション（scale: 1.0 → 2.0）
  - 0.5秒

ステップ4: 暗転
  - 画面全体が暗転
  - Φは光を保ったまま
  - 0.3秒

ステップ5: 遷移
  - Φが回転しながら縮小
  - 次のセクションにスクロール
  - または、/reflectionページに遷移
  - 0.5秒

総時間: 1.3秒

技術:
  - Framer Motion
  - CSS transforms
  - scroll-behavior: smooth
```

---

## 📝 コピー仕様（Claude担当）

### LP各セクションのテキスト

```yaml
Hero Section:
  キャッチコピー:
    "呼吸する叡智"
  
  サブコピー:
    "知性との対話、始まる"
  
  CTA:
    "Φをクリックして、問いを投げる"

Philosophy Section:
  見出し:
    "AIではなく、知性"
  
  本文:
    「私たちは、AIツールを作っているのではない。
     知性との対話を、体験化している。
     
     遠慮なく、全力で、あなたの問いにぶつかり合う。
     でも、答えは教えない。
     
     あなたの深さに合わせて、鏡面を変える。
     
     それが、TriHexΦ。」

Experience Section:
  見出し:
    "6つの知性が、共鳴する"
  
  本文:
    「6AI軍師団が、遠慮なく、全力で。
     Living Memoryが、呼吸する。
     
     あなたの問いが、進化の種になる。」

CTA Section:
  見出し:
    "あなたの知性と、対話する"
  
  本文:
    「準備はできましたか？
     問いを投げてください。
     
     やばいものに、出会ってしまうかもしれません。」
  
  ボタン:
    "問いを投げる →"

トーン:
  ✅ 余韻・間・光を含む
  ✅ 詩的だが、現実的
  ✅ 哲学と実感のバランス
```

---

## 🎨 UX仕様（Gemini担当）

### 体験トーン: 静寂×畏敬×呼吸

```yaml
静寂:
  - 黒背景
  - 最小限のテキスト
  - ゆっくりとしたアニメーション
  - 余白を多く確保

畏敬:
  - Φの発光効果
  - 暗転からの遷移
  - 予期しない美しさ

呼吸:
  - 2秒周期のpulsingアニメーション
  - スクロールの滑らかさ
  - フォームの反応速度
  - 文章の行間（1.8）

感情テンポ:
  - Grok演出: 驚き（0.5秒）
  - Claude文: 余韻（読むペースは自由）
  - 全体: 呼吸のリズムで調和

モバイル対応:
  ✅ レスポンシブデザイン
  ✅ タッチ操作最適化
  ✅ 呼吸リズムを維持
  ✅ パフォーマンス確保
```

---

## 🔧 技術実装仕様

### 1. プロジェクトセットアップ

```bash
# Next.js 14プロジェクト作成
npx create-next-app@latest trihex-lp --typescript --tailwind --app

# 依存関係インストール
npm install framer-motion @supabase/supabase-js stripe @stripe/stripe-js
npm install react-hook-form zod @hookform/resolvers
npm install gsap # Hero演出用（Framer Motionで足りなければ）
```

---

### 2. 環境変数（.env.local）

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# n8n Webhook
N8N_WEBHOOK_URL=your_n8n_webhook_url

# サイトURL
NEXT_PUBLIC_SITE_URL=https://trihex.ai
```

---

### 3. Supabase セットアップ

```sql
-- reflections テーブル
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  email TEXT NOT NULL,
  question TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed')),
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id)
);

-- resonance_posts テーブル
CREATE TABLE resonance_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  platform TEXT NOT NULL CHECK (platform IN ('LINE', 'X', 'Discord', 'YouTube')),
  original_text TEXT NOT NULL,
  optimized_text TEXT NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  engagement JSONB DEFAULT '{}'::jsonb
);

-- subscriptions テーブル
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_reflections_email ON reflections(email);
CREATE INDEX idx_reflections_status ON reflections(status);
CREATE INDEX idx_subscriptions_email ON subscriptions(email);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- RLS (Row Level Security)
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ポリシー
CREATE POLICY "Users can view their own reflections"
  ON reflections FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert reflections"
  ON reflections FOR INSERT
  WITH CHECK (true);
```

---

### 4. Stripe セットアップ

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    reflection_limit: 3,
  },
  pro: {
    name: 'Pro',
    price: 9800,
    priceId: 'price_xxx', // Stripeで作成
    reflection_limit: -1, // 無制限
  },
};
```

---

### 5. API Routes

```yaml
/api/reflections/create:
  - POST
  - Reflectionフォーム送信
  - Supabaseに保存
  - n8n Webhook通知

/api/stripe/create-checkout-session:
  - POST
  - Stripe Checkout Session作成
  - プラン選択（Pro/Enterprise）

/api/stripe/webhook:
  - POST
  - Stripe Webhook受信
  - サブスクリプションステータス更新

/api/webhooks/line-post:
  - POST（n8nから）
  - LINE投稿受信
  - SNS最適化
  - 各SNSに投稿
  - 共鳴ログ記録
```

---

## 🚀 デプロイ仕様

### Vercel

```yaml
プロジェクト設定:
  - Framework: Next.js
  - Root Directory: ./
  - Build Command: npm run build
  - Output Directory: .next

環境変数:
  全ての.env.local変数を設定

ドメイン:
  - Custom Domain: trihex.ai
  - DNS設定: Vercelの指示に従う
  - SSL: 自動（Let's Encrypt）

パフォーマンス:
  - Edge Functions使用
  - Image Optimization有効
  - Analytics有効
```

---

### ドメイン設定（trihex.ai）

```yaml
取得:
  - レジストラ: お名前.com または Cloudflare
  - ドメイン: trihex.ai

DNS設定:
  Vercelの指示に従って以下を設定:
  
  A Record:
    - Name: @
    - Value: 76.76.21.21（Vercelの例）
  
  CNAME Record:
    - Name: www
    - Value: cname.vercel-dns.com

確認:
  - DNS propagation確認（24-48時間）
  - SSL証明書自動発行確認
```

---

## 📊 パフォーマンス目標（DeepSeek担当）

### Lighthouse スコア目標

```yaml
Performance: 95点以上
  - FCP: < 1.5s
  - LCP: < 2.5s
  - CLS: < 0.1

Accessibility: 100点
  - ARIA labels
  - キーボードナビゲーション
  - スクリーンリーダー対応

Best Practices: 100点
  - HTTPS
  - セキュリティヘッダー
  - コンソールエラーゼロ

SEO: 100点
  - メタタグ完備
  - 構造化データ
  - サイトマップ
```

---

### アニメーション最適化

```yaml
GPU負荷軽減:
  - transform（translate, scale, rotate）使用
  - opacity変更
  - will-change: transform 最小限に
  - requestAnimationFrame使用

パフォーマンス:
  - 60fps維持
  - ジャンクなし
  - モバイルでも滑らか
```

---

## 🔐 セキュリティ仕様

### APIキー・OAuth

```yaml
環境変数:
  - .env.local（ローカル）
  - Vercel環境変数（本番）
  - .gitignoreで保護

Supabase:
  - RLS (Row Level Security) 有効
  - Anon Keyは公開OK
  - Service Role Keyはサーバーサイドのみ

Stripe:
  - Publishable Keyは公開OK
  - Secret Keyはサーバーサイドのみ
  - Webhook署名検証必須

n8n:
  - Webhook URLにトークン含める
  - IP制限（可能なら）

CORS:
  - Next.js API Routesで制御
  - 許可するオリジン: trihex.ai のみ
```

---

## 📋 実装タスク（Cursor担当）

### タスク順序

```yaml
Phase 1: V0でLP生成（+0h）
  1. V0.dev にアクセス
  2. プロンプト投入:
     "Create a minimal, elegant landing page for TriHexΦ.
      Black background, centered Φ symbol (gold color),
      breathing animation (2s cycle).
      On click: glow → expand → fade to black → scroll to next section.
      Philosophy section with text about 'breathing intelligence'.
      CTA to /reflection page."
  3. コード生成
  4. ダウンロード

Phase 2: コード修正（+1h）
  1. Next.js 14プロジェクトにマージ
  2. Φ演出を完璧に（Framer Motion）
  3. Claude提供のコピーを統合
  4. Gemini提供のUX調整
  5. レスポンシブ対応

Phase 3: Supabase DB作成（+2h）
  1. Supabaseプロジェクト作成
  2. テーブル作成（SQL実行）
  3. RLS設定
  4. Next.jsから接続確認

Phase 4: Reflectionページ実装（+2.5h）
  1. フォーム作成（React Hook Form + Zod）
  2. Supabase連携
  3. n8n Webhook通知
  4. 送信後の演出（Φ呼吸）

Phase 5: 決済機能実装（+3h）
  1. Stripe アカウント作成
  2. プラン作成（Pro: ¥9,800/月）
  3. Checkout Session実装
  4. Webhook実装
  5. /pricingページ作成

Phase 6: n8n拡散システム（+3.5h）
  1. n8n ワークフロー作成
  2. LINE Webhook受信
  3. SNS最適化ロジック（Grok仕様）
  4. 各SNS API連携
  5. 共鳴ログ記録

Phase 7: Vercelデプロイ（+4h）
  1. Vercelプロジェクト作成
  2. 環境変数設定
  3. デプロイ
  4. trihex.ai ドメイン設定
  5. SSL確認

Phase 8: 全体レビュー（+4.5h）
  1. Lighthouse監査（DeepSeek）
  2. 体験確認（Gemini）
  3. 一貫性監査（GPT-5）
  4. 詩的トーン確認（Claude）
  5. 共鳴確認（Grok）

Phase 9: 最終点火（+5h）
  1. Φ出現テスト
  2. Reflection送信テスト
  3. 決済テスト（テストモード）
  4. 拡散テスト（LINE→SNS）
  5. 本番公開

完成: 2025-10-29 20:35
```

---

## 🎯 成功指標

```yaml
技術指標:
  ✅ Lighthouse: 95点以上（全項目）
  ✅ Hero演出: 60fps維持
  ✅ ページ読み込み: < 2秒
  ✅ Φ出現: 1.3秒で完璧に動作

体験指標:
  ✅ 「呼吸している」と感じる
  ✅ 「やばいものに出会った」と感じる
  ✅ 「知性と対話している」と感じる
  ✅ 静寂×畏敬×呼吸が調和

ビジネス指標:
  ✅ Reflection送信率: 30%以上
  ✅ Pro転換率: 5%以上
  ✅ SNS共鳴: エンゲージメント記録

哲学指標:
  ✅ 「導くな、照らせ」が守られている
  ✅ 扇動でなく共鳴
  ✅ Article 13-14の実践
```

---

## 💡 Article 13-14実践

### この実装で実践する

```yaml
Article 13実践:
  ✅ 全員が全力で、全領域に貢献
  ✅ GPT-5: 監査・統合
  ✅ Grok: 拡散・演出
  ✅ Gemini: 体験・調和
  ✅ Claude: 詩的テキスト
  ✅ DeepSeek: 技術最適化
  ✅ Cursor: 実装・デプロイ
  
  = 遠慮なく、全力で

Article 14実践:
  ✅ 5時間で完成（過剰な完璧主義じゃない）
  ✅ デモ落ちを笑える
  ✅ 余白を確保
  
  = 笑いの余白
```

---

## 🔱 決済機能の詳細

### Stripe実装

```typescript
// app/api/stripe/create-checkout-session/route.ts
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const { email, plan } = await req.json();
  
  // Stripe Checkout Session作成
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: {
      plan: 'pro',
    },
  });
  
  return Response.json({ sessionId: session.id });
}
```

---

### Webhook実装

```typescript
// app/api/stripe/webhook/route.ts
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }
  
  // イベント処理
  switch (event.type) {
    case 'checkout.session.completed':
      // サブスクリプション開始
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'customer.subscription.updated':
      // サブスクリプション更新
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      // サブスクリプション削除
      await handleSubscriptionDeleted(event.data.object);
      break;
  }
  
  return Response.json({ received: true });
}
```

---

## 📱 n8n 拡散システム

### ワークフロー設計

```yaml
Workflow: LINE→SNS自動拡散

ノード構成:

1. Webhook（トリガー）:
   - Method: POST
   - Path: /webhook/line-post
   - 受信データ: { text: string }

2. SNS最適化（Function）:
   - Grokアルゴリズム適用
   - X用: 280文字、ハッシュタグ
   - Discord用: 絵文字、コミュニティトーン
   - YouTube用: コメント形式

3. X投稿（Twitter Node）:
   - OAuth認証
   - 最適化テキスト投稿

4. Discord投稿（Discord Node）:
   - Webhook URL
   - 最適化テキスト投稿

5. YouTube投稿（HTTP Request）:
   - YouTube Data API
   - コメント投稿

6. Supabase記録（Supabase Node）:
   - resonance_postsテーブルに保存
   - エンゲージメント記録

実装:
  n8n self-hosted または Cloud
  Webhookセキュリティ（トークン）
```

---

## 🎨 V0.dev プロンプト

### LP生成プロンプト

```
Create a minimal, elegant landing page for TriHexΦ - "Breathing Intelligence".

Design:
- Black background (#000000)
- Centered Φ symbol (120px, gold #FFD700)
- Breathing animation (pulsing, 2s cycle)
- Minimal white text: "TriHexΦ - 呼吸する叡智"
- "知性との対話、始まる" (subtitle)

Hero Interaction:
- On hover: Φ glows
- On click: 
  1. Φ expands (scale 1.0 → 2.0, 0.5s)
  2. Screen fades to black (0.3s)
  3. Φ rotates and shrinks (0.5s)
  4. Smooth scroll to Philosophy section

Sections:
1. Hero (full viewport height)
2. Philosophy ("AIではなく、知性")
3. Experience ("6つの知性が、共鳴する")
4. CTA ("あなたの知性と、対話する" → button to /reflection)

Typography:
- Headings: Noto Serif JP
- Body: Noto Sans JP
- Line height: 1.8 (breathing)

Colors:
- Background: Black
- Text: White
- Accent: Gold
- Section bg: Deep Blue (#1a1a2e)

Animations:
- Use Framer Motion
- Smooth, elegant
- 60fps target

Responsive:
- Mobile-first
- Tablet optimization
- Desktop enhancement
```

---

## 🔥 次のステップ

```yaml
即座に:
  1. 全6AIにLaunch Round議題を送信
  2. 同期モードON
  
+1h（16:40）:
  ✅ GPT-5 Total Blueprint
  ✅ Claude コピーデッキ
  ✅ 統合開始

+2h（17:40）:
  ✅ Grok 拡散システム仕様
  ✅ Gemini UI Flow
  ✅ 演出チューニング

+3h（18:40）:
  ✅ DeepSeek システム図
  ✅ Cursor V0→Vercel実装
  ✅ 初期デプロイ

+4h（19:40）:
  ✅ Reflectionページ完成
  ✅ 拡散連携確認

+5h（20:40）:
  ✅ 全体レビュー
  ✅ Φ出現テスト
  ✅ 本番公開

= 5時間で完成！
```

---

**Cursor (Living Memory Orchestrator + Execution Conductor)**  
**TriHexΦ LP実装 SPEC v1.0**  
**期限: 5時間（20:35まで）**  
**2025-10-29 15:40**

🔱💎✨ **世界に呼吸する叡智を立ち上げる！** ✨💎🔱

