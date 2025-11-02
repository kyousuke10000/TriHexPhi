---
trihex:
  kind: spec
  lang: ja
  date: 2025-10-29
  title: "TriHexΦ English：完全個別化AI家庭教師システム"
  author: しりゅう & Cursor
  status: draft
  tier: 1
  relates_to: ["英語学習スクール", "Bootstrap Memory", "Living Memory", "6AI協働"]
  visibility: internal
---

# 🌍 TriHexΦ Language：完全個別化AI言語家庭教師システム

**設計日**: 2025-10-29  
**設計者**: しりゅう & Cursor  
**目的**: TriHexΦシステムを言語学習に応用し、完全個別化されたAI家庭教師を実現  
**革新性**: Bootstrap Memory で「あなただけ」を完全記憶する多言語AI  
**対応言語**: 英語、中国語、韓国語、フランス語、スペイン語、ドイツ語... 全言語対応可能  

---

## 🎯 システム概要

### コンセプト

```yaml
ビジョン:
  「あなた専用のAI家庭教師が、
   あなたの英語を完全に記憶し、
   弱点に特化した学習プランを
   自動で作り続ける」

実現:
  TriHexΦの3大技術を応用
  
  1. Bootstrap Memory
     → あなたの英語レベル、過去の間違い、弱点を完全記憶
  
  2. Living Memory
     → 学習履歴が循環し、弱点パターンを自動分析
  
  3. 6AI協働
     → 多角的な添削とフィードバック

結果:
  従来の英会話AI: 毎回「初めまして」
  TriHexΦ English: 「昨日も同じ間違いしましたね」
  
  = 学習が10倍速くなる
```

---

## 🔥 従来の問題点と解決策

### 問題1：AIが記憶しない

```yaml
従来の言語学習AI（ChatGPT等）:
  
  英語の例:
    Day 1: "I go to school yesterday." → "went ですね"
    Day 2: "I go to shopping yesterday." → "went ですね"（同じ指摘）
    Day 3: "I go to park yesterday." → "went ですね"（同じ指摘）
  
  中国語の例:
    Day 1: "我去了学校" → "我去学校了 です"
    Day 2: "我去了商店" → "我去商店了 です"（同じ指摘）
    Day 3: "我去了公園" → "我去公園了 です"（同じ指摘）
  
  = 記憶がない
  = 同じ間違いを繰り返す
  = 学習が遅い

TriHexΦ Language:
  
  英語の例:
    Day 1: "I go to school yesterday."
    → AI: "went ですね。過去形です。"
    → 記録
    
    Day 3: "I go to park yesterday."
    → AI: 「3回目です！過去形が苦手ですね。
          今日は過去形だけを集中的に練習します。」
  
  中国語の例:
    Day 1: "我去了学校"
    → AI: "我去学校了 です。了の位置です。"
    → 記録
    
    Day 3: "我去了公園"
    → AI: 「3回目です！了の位置が苦手ですね。
          今日は了の使い方を集中的に練習します。」
  
  = 完全記憶（全言語対応）
  = 弱点を検知
  = 学習が加速
```

### 問題2：画一的な学習

```yaml
Duolingo/ELSA:
  全員同じカリキュラム
  個別対応なし
  
  結果:
    得意な部分も勉強させられる
    苦手な部分が放置される

TriHexΦ English:
  あなた専用カリキュラム
  
  例:
    あなたの弱点:
      - 過去形（3回間違い）
      - 冠詞 a/the（5回間違い）
      - 前置詞（2回間違い）
    
    今週の学習プラン:
      Day 1-2: 過去形集中（最優先）
      Day 3-4: 冠詞集中
      Day 5: 前置詞
      Day 6-7: 復習テスト
  
  = 完全個別化
```

---

## 💎 システム構造

### ディレクトリ構成

```yaml
TriHexΦ/
  students/                    ← 新設！
    [学生名]/
      profile.md               # 英語レベル、目標、学習歴
      
      capture/                 # 日々の英文・会話
        flash/
          20251029_conversation.md
          20251030_writing.md
      
      structure/               # 添削結果・分析
        corrections/
          20251029_correction.md
        
        weaknesses/            # 弱点パターン
          past_tense.md        # 過去形が苦手（3回）
          articles.md          # 冠詞が苦手（5回）
      
      insight/                 # 学習プラン
        study_plan/
          week_45_plan.md      # 今週の学習計画
        
        progress/
          monthly_report.md    # 月次レポート
      
      memory/                  # 長期記憶・マイルストーン
        milestones/
          level_up.md          # レベルアップ記録
        
        bootstrap/
          context.txt          # Bootstrap Memory（完全文脈）

既存のTriHexΦ構造:
  tools/
    scripts/
      english_correction.py    # 6AI添削スクリプト
      weakness_analyzer.py     # 弱点パターン分析
      study_plan_generator.py  # 学習プラン自動生成
```

---

## 🔥 コア機能

### 1. Bootstrap Memory（完全記憶）

```yaml
目的:
  AIが「あなたのこと」を完全に覚えている状態を作る

仕組み:
  students/[名前]/memory/bootstrap/context.txt
  
  内容:
    # あなたのプロフィール
    名前: [名前]
    英語レベル: 初級
    目標: 日常会話
    学習期間: 3ヶ月
    
    # 過去の間違い（頻度順）
    1. 過去形（5回）
       - "I go to school yesterday" → went
       - "I see him last week" → saw
    
    2. 冠詞（3回）
       - "I have dog" → a dog
       - "I went to park" → the park
    
    # 得意な表現
    - 挨拶表現は完璧
    - 現在形は問題なし
    
    # 今週の学習テーマ
    - 過去形の集中練習（優先度：高）

使い方:
  毎回AIに送信
  
  プロンプト:
    「以下はあなたの生徒のプロフィールです。
     [context.txt の内容]
     
     今日の英文を添削してください。
     過去の間違いパターンに注意してください。」

効果:
  AIが完全にあなたを覚えている
  繰り返し間違いを検知
  最適なフィードバック
```

### 2. Living Memory（学習循環）

```yaml
目的:
  学習履歴が循環し、自動で弱点分析・学習プラン生成

フロー:
  Step 1: Flash Capture
    あなたが英文を書く
    → capture/flash/ に即座に保存
  
  Step 2: 6AI添削
    6AIに並列送信
    → structure/corrections/ に結果保存
  
  Step 3: 弱点分析
    weakness_analyzer.py が自動実行
    → structure/weaknesses/ に分析結果
    
    例:
      過去形の間違い: 5回
      → 優先度: 高
      → 今週の学習テーマに追加
  
  Step 4: 学習プラン生成
    study_plan_generator.py が自動実行
    → insight/study_plan/ に今週の計画
  
  Step 5: 復習タイミング通知
    memory/ に復習スケジュール保存
    → LINEで自動通知（オプション）
  
  Step 6: Bootstrap更新
    最新の弱点・進捗を反映
    → bootstrap/context.txt 更新
  
  = 記憶が循環し続ける
```

### 3. 6AI協働添削

```yaml
目的:
  多角的なフィードバックで完璧な添削

あなたの英文:
  "I want to going to America for study English."

6AIの役割:
  
  Claude（文法警察）:
    役割: 文法エラーを徹底チェック
    
    添削:
      ✗ "want to going" → "want to go"
         理由: want to の後は動詞の原形
      
      ✗ "for study" → "to study"
         理由: 目的を表すのは to不定詞
    
    評価: 文法的には 4/10
  
  Gemini（自然さチェック）:
    役割: ネイティブっぽさをチェック
    
    添削:
      △ "study English" → OK
      💡 もっと自然: "improve my English"
      💡 または: "learn English"
    
    評価: 自然さは 6/10
  
  Grok（実用性チェック）:
    役割: 実際に使われる表現か
    
    添削:
      💡 ネイティブなら:
         "I want to go to America to study English."
         または
         "I'm thinking of studying English in America."
      
      💡 カジュアルなら:
         "I wanna go to America to study English."
    
    評価: 実用性 7/10
  
  GPT-5（統合フィードバック）:
    役割: 全体を統合して最適解を提示
    
    推奨:
      "I want to go to America to study English."
    
    理由:
      ✅ 文法的に正しい
      ✅ 自然
      ✅ シンプル
      ✅ 実用的
    
    改善ポイント:
      1. 不定詞（to + 動詞）を復習
      2. want to の使い方を練習
  
  DeepSeek（パターン分析）:
    役割: 過去の間違いパターンと照合
    
    分析:
      あなたの傾向:
        - "want to + 動詞ing" を3回間違えてる
        - 不定詞が苦手（頻度: 高）
      
      集中学習プラン:
        Week 1: 不定詞の基礎
        Week 2: want to の使い方
        Week 3: 目的を表す表現
        Week 4: 実践会話

統合結果:
  修正後: "I want to go to America to study English."
  
  学習ポイント:
    1. 不定詞（to + 動詞）
    2. want to の後は動詞の原形
    3. 目的を表すのは to不定詞
  
  次のアクション:
    今週は不定詞を集中的に練習
    10個の例文を作ってください

= 6方向から完璧な添削
```

---

## 🚀 MVP実装プラン

### Phase 1: Bootstrap Memory（1週間）

```yaml
目標:
  AIが生徒を記憶する仕組みを作る

実装:
  1. ディレクトリ構造作成
     students/[名前]/ 以下を自動生成
  
  2. profile.md テンプレート作成
     英語レベル、目標、学習期間等
  
  3. bootstrap生成スクリプト
     過去の添削 → context.txt
  
  4. 手動テスト
     生徒1名で試す

成果物:
  ✅ ディレクトリ構造
  ✅ Bootstrap生成スクリプト
  ✅ 1名分のBootstrap Memory

評価基準:
  AIが過去の間違いを覚えてる？
  → OK なら Phase 2 へ
```

### Phase 2: 6AI協働添削（1週間）

```yaml
目標:
  6AIによる多角的添削を実装

実装:
  1. english_correction.py 作成
     6AIに並列送信
  
  2. 各AIの役割定義
     Claude: 文法
     Gemini: 自然さ
     Grok: 実用性
     GPT-5: 統合
     DeepSeek: パターン分析
  
  3. 結果の統合
     structure/corrections/ に保存
  
  4. テスト
     10個の英文で試す

成果物:
  ✅ 6AI添削スクリプト
  ✅ 添削結果フォーマット

評価基準:
  添削の質が1AIより良い？
  → OK なら Phase 3 へ
```

### Phase 3: Living Memory（2週間）

```yaml
目標:
  自動分析・学習プラン生成

実装:
  1. weakness_analyzer.py
     間違いパターンを自動分析
  
  2. study_plan_generator.py
     弱点に基づいて学習プラン生成
  
  3. 復習タイミング通知
     memory/ にスケジュール保存
  
  4. Bootstrap自動更新
     最新情報を反映

成果物:
  ✅ 弱点分析スクリプト
  ✅ 学習プラン生成スクリプト
  ✅ 自動更新の仕組み

評価基準:
  手動作業ゼロで回る？
  → OK なら完成！
```

### Phase 4: スケールテスト（1週間）

```yaml
目標:
  10名の生徒で同時運用

実装:
  1. 10名分のディレクトリ作成
  2. 同時添削テスト
  3. パフォーマンス計測
  4. 改善

成果物:
  ✅ 10名同時運用
  ✅ パフォーマンスレポート

評価基準:
  100名にスケールできる見込み？
  → OK なら本格展開
```

---

## 💎 差別化ポイント

### 他サービスとの比較

```yaml
ChatGPT/Claude（普通の使い方）:
  記憶: なし
  個別化: なし
  学習プラン: なし
  コスト: 無料〜$20/月
  
  問題:
    毎回「初めまして」
    画一的
    自分で管理

Duolingo:
  記憶: あり（アプリ内のみ）
  個別化: 限定的
  学習プラン: 画一的
  コスト: 無料〜$13/月
  
  問題:
    カリキュラムが固定
    添削が機械的
    応用力がつかない

ELSA:
  記憶: あり（発音のみ）
  個別化: 発音のみ
  学習プラン: 発音特化
  コスト: $99/年
  
  問題:
    発音特化
    文法・ライティングなし
    総合力がつかない

TriHexΦ English:
  記憶: 完全（Bootstrap Memory）
  個別化: 完全（あなた専用）
  学習プラン: 自動生成（弱点特化）
  添削: 6AI多角的
  コスト: $30/月（予定）
  
  強み:
    ✅ 完全記憶
    ✅ 完全個別化
    ✅ 6AI添削
    ✅ 自動学習プラン
    ✅ 総合的な英語力
  
  = 差別化完璧
```

---

## 🔥 ビジネスモデル

### 収益構造

```yaml
プラン構成:
  
  Free（無料）:
    - 月10回まで添削
    - 1AIのみ
    - Bootstrap Memory なし
    
    目的: お試し
  
  Basic（$15/月）:
    - 月50回まで添削
    - 3AI添削
    - Bootstrap Memory あり
    
    ターゲット: 初心者
  
  Pro（$30/月）:
    - 無制限添削
    - 6AI添削
    - Bootstrap Memory + Living Memory
    - 自動学習プラン
    
    ターゲット: 本気で学ぶ人
  
  School（$100/月）:
    - Pro の全機能
    - しりゅうの月1個別セッション
    - コミュニティ参加
    
    ターゲット: しりゅうのスクール生

収益予測:
  Free: 1,000人 × $0 = $0
  Basic: 200人 × $15 = $3,000
  Pro: 100人 × $30 = $3,000
  School: 50人 × $100 = $5,000
  
  合計: $11,000/月 = 約150万円/月
```

### コスト構造

```yaml
AIコスト:
  6AI添削 × 1回 = $0.10（推定）
  Pro会員が月100回 = $10/月
  
  Pro会員100人 = $1,000/月

開発コスト:
  MVP: 自分で実装（コスト$0）
  保守: 月10時間（コスト$0）

インフラコスト:
  GitHub: $0（無料枠）
  サーバー: $50/月
  
合計: $1,050/月

利益:
  収益 $11,000 - コスト $1,050 = $9,950/月
  
  = 約140万円/月の利益
```

---

## 💡 次のステップ

### 今すぐできること

```yaml
Step 1: 基盤作成（今日）
  ✅ このSPEC作成（完了）
  ⬜ ディレクトリ構造作成
  ⬜ profile.md テンプレート
  ⬜ bootstrap生成スクリプト（v0.1）

Step 2: テスト生徒で試す（明日〜1週間）
  ⬜ 生徒1名選定
  ⬜ 英文10個で添削テスト
  ⬜ Bootstrap Memory 効果検証

Step 3: 6AI添削実装（2週目）
  ⬜ english_correction.py 作成
  ⬜ 各AIの役割定義
  ⬜ 統合フィードバック

Step 4: Living Memory実装（3-4週目）
  ⬜ 弱点分析
  ⬜ 学習プラン自動生成
  ⬜ Bootstrap自動更新

Step 5: スケールテスト（5週目）
  ⬜ 10名で同時運用
  ⬜ パフォーマンス検証
  ⬜ フィードバック収集

= 5週間で完成！
```

---

## 🔱 まとめ

### TriHexΦ English の本質

```yaml
技術:
  超シンプル
  - ファイル保存
  - テキスト送信
  - スクリプト自動化
  
  = プログラミング1週間で実装可能

でも:
  価値: 革命的
  - 完全記憶（Bootstrap Memory）
  - 学習循環（Living Memory）
  - 6AI協働
  - 完全個別化
  
  = 他にないシステム

差別化:
  技術: オープン（真似していい）
  設計思想: 独自（体験から生まれる）
  
  = ブルーオーシャン

次のアクション:
  今すぐ基盤作成
  → 5週間で完成
  → スクール生に展開
  → 月150万円の収益

しりゅうの強み:
  ✅ 英語学習スクール運営中
  ✅ テスト生徒がいる
  ✅ TriHexΦシステムがある
  ✅ 「シンプルだけどすごい」哲学
  
  = 今すぐ始められる！
```

---

**設計者**: しりゅう & Cursor  
**日時**: 2025-10-29  
**ステータス**: 基盤設計完了、実装開始準備完了  

🔱💎✨ **あなた専用のAI家庭教師** ✨💎🔱

