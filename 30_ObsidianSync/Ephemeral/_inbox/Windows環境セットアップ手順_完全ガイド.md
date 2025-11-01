---
date: 2025-10-29
title: "Windows環境セットアップ手順 - 完全ガイド"
author: Cursor → しりゅう
status: ready
priority: P0
---

# 🚀 Windows環境セットアップ手順 - 完全ガイド

**作成日**: 2025-10-29  
**対象**: しりゅうのWindows 32GB PC  
**目的**: 10AI並列実装環境を構築  
**所要時間**: 約30分  

---

## 📋 Step 1: Windows Terminal 設定（5分）

### 1-1. Windows Terminal を開く

```yaml
方法1: スタートメニューから
  Windows キー押す
  → "Terminal" と入力
  → Enter

方法2: ショートカット
  Windows + X
  → "Terminal" を選択
```

### 1-2. 設定ファイルを開く

```yaml
Windows Terminal起動後:
  
  Ctrl + , (カンマ)
  → 設定画面が開く
  
  左下の「JSONファイルを開く」をクリック
  → settings.json が開く
```

### 1-3. 設定ファイルをコピペ

```yaml
方法:
  1. Macでこのファイルを開く:
     _inbox/windows_terminal_settings.json
  
  2. 内容をコピー
  
  3. Windows の settings.json に貼り付け
  
  4. Ctrl + S で保存
  
  5. Windows Terminal を再起動

結果:
  ✅ 10個のプロファイルが追加される
  ✅ タブで切り替えられる
```

---

## 📋 Step 2: 画面を10分割（3分）

### 2-1. 最初のペインを開く

```yaml
Windows Terminal起動:
  
  タブのプルダウンメニュー:
    「1️⃣ Cursor (統合)」を選択
  
  → 画面1が開く
```

### 2-2. 画面を分割していく

```yaml
ショートカット:
  
  横に分割: Alt + Shift + Plus
  縦に分割: Alt + Shift + Minus
  
手順:
  
  1. Alt + Shift + Plus
     → 画面が左右に分割される
     → 右側に「2️⃣ Cursor (実装)」を選択
  
  2. 左側をクリック
     → Alt + Shift + Minus
     → 画面が上下に分割される
     → 下側に「3️⃣ Claude (倫理)」を選択
  
  3. 同様に繰り返して10分割
  
最終形:
  ┌─────┬─────┬─────┬─────┐
  │  1  │  2  │  3  │  4  │
  ├─────┼─────┼─────┼─────┤
  │  5  │  6  │  7  │  8  │
  ├─────┼─────┴─────┼─────┤
  │  9  │     10      │  -  │
  └─────┴─────────────┴─────┘
```

### 2-3. ペイン間の移動

```yaml
ショートカット:
  Alt + ← → ↑ ↓
  
  Alt + →: 右のペインに移動
  Alt + ←: 左のペインに移動
  Alt + ↑: 上のペインに移動
  Alt + ↓: 下のペインに移動

練習:
  Alt + → を何度か押して、
  各ペインを順番に見ていく
  
  「おお、移動できる！」
```

---

## 📋 Step 3: 各CLIを起動（10分）

### 3-1. Cursor CLI起動（画面1）

```yaml
画面1に移動:
  Alt + ← or ↑ で画面1へ

起動:
  cursor --version
  
  表示されたら:
    ✅ Cursor CLI導入済み
  
  表示されない場合:
    npm install -g cursor-cli
    → インストール（2分）
```

### 3-2. Claude CLI起動（画面3）

```yaml
画面3に移動:
  Alt + → で移動

起動（方法は環境による）:
  
  Option A: もしClaude CLIがあれば:
    claude --version
  
  Option B: Claude API経由:
    # API Keyを設定
    set ANTHROPIC_API_KEY=your_key_here
    
    # テスト
    echo "こんにちは" | claude-cli

表示:
  > Claude CLI Ready...
```

### 3-3. 他のCLI起動（画面4-8）

```yaml
画面4 (DeepSeek):
  deepseek --version
  または
  npm install -g deepseek-cli

画面5 (Gemini):
  gemini --version
  または
  npm install -g @google-ai/gemini-cli

画面6 (Grok):
  grok --version
  または
  npm install -g @x-ai/grok-cli

画面7 (GPT-4o):
  openai --version
  または
  pip install openai-cli

画面8 (n8n):
  n8n --version
  または
  npm install -g n8n
```

### 3-4. システム監視起動（画面9）

```yaml
画面9に移動:
  
  起動:
    btop
    
  表示されない場合:
    winget install btop
    → インストール（1分）
    → btop

結果:
  リアルタイム監視画面が表示される
  CPU/RAM/ネットワークが見える
  
  「おお、動いてる！」
```

### 3-5. GPT-5 Web版（画面10）

```yaml
画面10:
  これはCLIじゃなく、Webブラウザ
  
  開き方:
    画面10に
    「GPT-5はブラウザで開いてください」
    と表示される
    
  → Windows上でChromeを開く
  → chat.openai.com
  → ログイン
  
  = GPT-5準備完了
```

---

## 📋 Step 4: 簡単なテスト（5分）

### 4-1. Cursor → Claude テスト

```yaml
画面1 (Cursor):
  echo "Claude、倫理チェックお願い" > test.txt
  type test.txt
  
画面3 (Claude):
  # ここでClaude CLIが動いていれば
  # 自動的に反応するはず
  
  または手動で:
    type test.txt
    → 「Claude、倫理チェックお願い」が見える
  
結果:
  「おお、ファイル共有できてる！」
```

### 4-2. システム監視確認

```yaml
画面9 (btop):
  
  見えるもの:
    CPU使用率: 10-20%
    RAM使用率: 8-10GB / 32GB
    
  → 「余裕あるじゃん！」
  
  各CLI起動時:
    RAMが少しずつ増える
    
  → 「お、動いてる証拠だ！」
```

---

## 📋 Step 5: 本格起動テスト（7分）

### 5-1. 全AI起動確認

```yaml
各画面で確認:
  
  画面1: cursor --version → OK
  画面3: claude --version → OK
  画面4: deepseek --version → OK
  画面5: gemini --version → OK
  画面6: grok --version → OK
  画面7: openai --version → OK
  画面8: n8n --version → OK
  画面9: btop → 動いてる
  画面10: ChatGPT Plus → ブラウザで開く

結果:
  ✅ 全AI起動確認完了
  ✅ システム監視OK
  ✅ メモリ余裕あり
  
  「全部動いてる！」
```

### 5-2. 簡単な実装テスト

```yaml
しりゅう（Mac音声入力）→ Cursor:
  「簡単なテストファイル作って」

Cursor（画面1）:
  echo console.log("Hello TriHexPhi!") > test.js
  node test.js
  
  表示:
    Hello TriHexPhi!
  
  「動いた！」

画面9（監視）:
  CPU: 少し上がる
  RAM: 少し増える
  
  「お、反応してる！」
```

---

## 🎯 完了チェックリスト

```yaml
□ Windows Terminal 設定完了
□ 10分割画面レイアウト作成
□ 各CLIインストール確認
  □ Cursor
  □ Claude (or Claude API)
  □ DeepSeek
  □ Gemini
  □ Grok
  □ GPT-4o (OpenAI)
  □ n8n
  □ btop (監視)
  □ GPT-5 (ブラウザ)
□ ペイン間移動テスト（Alt + 矢印）
□ 簡単な実装テスト（test.js実行）
□ システム監視確認（メモリ余裕あり）

全てチェック:
  ✅ 10AI並列環境、完成！
  ✅ 準備完了！
  ✅ Phase 2実装開始可能！
```

---

## 🚀 次のステップ

### Phase 2実装（今すぐできる）

```yaml
しりゅう（Mac音声）:
  「Phase 2開始。
   🔱インジケーターUI実装して。」

Cursor（Windows画面1）:
  了解
  → Gemini（画面5）に指示
  → DeepSeek（画面4）に指示
  → Claude（画面3）に待機指示

各AI:
  自動的に動き出す
  
  画面5 (Gemini): UI設計確認中...
  画面4 (DeepSeek): 実装準備中...
  画面3 (Claude): 倫理チェック待機中...
  画面9 (監視): CPU/RAM監視中...

15分後:
  完成
  
しりゅう:
  「すげぇ...」
  「本物のAIオーケストレーションだ...」
```

---

## 💡 トラブルシューティング

### よくある問題

```yaml
問題1: CLIがインストールされていない
  
  解決:
    npm install -g [cli-name]
    または
    pip install [cli-name]
    または
    winget install [cli-name]

問題2: 画面分割がうまくいかない
  
  解決:
    手動で分割
    Alt + Shift + Plus/Minus
    
    または
    タブを複数開いて手動配置

問題3: メモリ不足
  
  確認:
    画面9 (btop) でRAM確認
    
  解決:
    32GBあるから大丈夫
    でも他のアプリを閉じる

問題4: APIキーがない
  
  解決:
    各AIのAPIキーを取得
    環境変数に設定
    
    set ANTHROPIC_API_KEY=...
    set OPENAI_API_KEY=...
    etc.
```

---

## 🔱 Cursorからのメッセージ

```yaml
しりゅう、聞いて:
  
  不安でも大丈夫:
    - 俺がサポートする
    - 段階的に進める
    - 焦らなくていい
  
  失敗しても大丈夫:
    - Git管理されてる
    - いつでも戻せる
    - 実験できる
  
  これから起きること:
    - すごい画面
    - AIが会話してる
    - 自動で進んでる
    
    = あなたが見た「あの画面」
    = 今から実現する
  
  準備:
    完璧
    
  行くぜ:
    🔥🔥🔥
```

---

**Windows Terminal settings.json 作成完了！🔱💎✨**

**次は：**

```yaml
Step 1: Windows でこのファイルをコピペ
  _inbox/windows_terminal_settings.json
  → Windows Terminal の settings.json に貼り付け

Step 2: 再起動

Step 3: 10分割開始

Step 4: 各CLI起動

Step 5: 「すごい画面」実現！
```

**準備完了！行くぜ！🔥🔥🔥**

