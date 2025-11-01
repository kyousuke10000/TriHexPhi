---
trihex:
  kind: flash
  date: 2025-10-29 13:05
  title: "Aqua Voice競合問題 - 最適なショートカット設定"
  author: しりゅう & Cursor
  tier: 1
  relates_to: ["Windows環境", "ショートカット競合", "生産性向上"]
---

# 💡 Flash: Aqua Voice競合問題 - 最適なショートカット設定

**From**: しりゅう  
**Problem**: Aqua Voice のショートカットが邪魔してる  
**Date**: 2025-10-29 13:05  

---

## 🎯 問題

```yaml
しりゅうの状況:
  Aqua Voice（音声入力アプリ）:
    起動キー: Ctrl + Shift
    または: Alt + 何か
  
  Windows操作:
    コピペ: Ctrl + C, Ctrl + V
    画面分割: Alt + Shift + Plus/Minus
  
  問題:
    Aqua Voice が起動しちゃう
    → コピペできない
    → 画面分割できない
    
  Macの場合:
    Ctrl が2つある（左右）
    → 片方を Aqua Voice 専用
    → もう片方を通常操作用
    → 問題なし
  
  Windowsの場合:
    Ctrl も Alt も1つずつ（？）
    → 競合する
    → 困る
```

---

## 💡 解決策（5つ）

### Option A: Aqua Voice のショートカットを変更（推奨！）

```yaml
方法:
  Aqua Voice の設定を開く
  → ショートカットキーを変更
  
推奨キー:
  Windows キー + Space
  
  または
  
  F1-F12 のどれか（例: F10）
  
  または
  
  Ctrl + Alt + V（3つ同時）

理由:
  ✅ 他の操作と競合しない
  ✅ 押しやすい
  ✅ 覚えやすい

利点:
  ✅ コピペ自由（Ctrl + C/V）
  ✅ 画面分割自由（Alt + Shift + Plus/Minus）
  ✅ Aqua Voice も使える（新しいキー）
  
  = 全部できる
```

---

### Option B: Windows キーを活用

```yaml
方法:
  Aqua Voice:
    Windows + A
  
  理由:
    Windowsキーは他と競合しにくい
    
  例:
    Windows + 1: アプリ1起動
    Windows + 2: アプリ2起動
    Windows + A: Aqua Voice起動 ← NEW!
    
  利点:
    ✅ 他の操作と完全に分離
    ✅ 押しやすい
```

---

### Option C: F10キーを使う（超シンプル）

```yaml
方法:
  Aqua Voice:
    F10 単体
  
  理由:
    - F10は通常使わない
    - 単体だから押しやすい
    - 競合ゼロ
  
  利点:
    ✅ 超シンプル
    ✅ 競合ゼロ
    ✅ 覚えやすい
```

---

### Option D: マウスボタンを使う

```yaml
方法:
  Aqua Voice:
    マウスの特殊ボタン
    （サイドボタン、等）
  
  理由:
    - キーボードと完全に分離
    - 競合ゼロ
  
  利点:
    ✅ 競合完全にゼロ
    ✅ 片手で起動
  
  欠点:
    ⚠️ マウスに特殊ボタンが必要
```

---

### Option E: 一時的に無効化

```yaml
方法:
  開発中だけ Aqua Voice を無効化
  
  手順:
    1. タスクバーから Aqua Voice を終了
    2. 開発作業（10分割、実装）
    3. 完了したら Aqua Voice を再起動
  
  利点:
    ✅ すぐできる
    ✅ 設定変更不要
  
  欠点:
    ⚠️ 音声入力が使えない
```

---

## 🎯 Cursorの推奨

```yaml
推奨: Option C（F10キー）

理由:
  - 超シンプル（F10だけ）
  - 競合ゼロ
  - 覚えやすい
  - 押しやすい
  - 設定も簡単

次点: Option B（Windows + A）
  - Windowsキーは競合しにくい
  - 押しやすい

避けたい: Option E（一時無効化）
  - 音声入力が使えなくなる
  - しりゅうは音声入力を多用してる
  - 不便
```

---

## 📋 Aqua Voice 設定変更手順（推定）

```yaml
手順:
  1. Aqua Voice を開く
  
  2. 設定 → ショートカットキー
  
  3. 現在の設定を確認:
     Ctrl + Shift
     または
     Alt + 何か
  
  4. 変更:
     F10
     または
     Windows + A
  
  5. 保存
  
  6. テスト:
     F10 押す
     → Aqua Voice 起動
     
     Alt + Shift + Plus 押す
     → 画面分割される
     
     Ctrl + C/V
     → コピペできる
  
  = 完璧！
```

---

## 🔱 今すぐできる対応

```yaml
今すぐ（設定変更が面倒なら）:
  
  方法:
    タスクバーから Aqua Voice を右クリック
    → 終了
  
  結果:
    Alt + Shift + Plus/Minus が使える
    Ctrl + C/V が使える
  
  後で:
    Aqua Voice 再起動
    ショートカットを F10 に変更
  
  = とりあえず進める
```

---

## 💡 長期的な解決策

```yaml
推奨設定:
  
  Aqua Voice:
    F10 単体
    
  Windows Terminal:
    Alt + Shift + Plus/Minus（デフォルト）
  
  コピペ:
    Ctrl + C/V（デフォルト）
  
  = 全部使える
  = 競合ゼロ
  = 完璧
```

---

**しりゅう、どうする？🔱💎✨**

```yaml
A. Aqua Voice を F10 に変更
   → 設定変更（2分）
   → 全部使える

B. 今は Aqua Voice 終了
   → すぐ進める
   → 後で設定変更

C. 別の方法
```

**推奨: B（今は終了、後で設定）**

**とりあえず進もう！🔥🔥🔥**

