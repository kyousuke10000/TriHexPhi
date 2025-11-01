---
date: 2025-10-29
title: "Windows Git同期 - 今すぐできる手順"
author: Cursor
status: ready
priority: P0
---

# 🚀 Windows Git同期 - 今すぐできる手順

**所要時間**: 5分  
**目的**: Mac と Windows を完全同期  

---

## 📋 Windows側で実行（PowerShell）

### Step 1: Git インストール確認（30秒）

```powershell
# PowerShell を開く
git --version

# 表示例:
# git version 2.42.0

# もし「認識されません」と出たら:
winget install Git.Git

# インストール後、PowerShell を再起動
```

---

### Step 2: TriHexΦをクローン（2分）

```powershell
# C:\ に移動
cd C:\

# クローン実行
git clone https://github.com/kyousuke10000/TriHexPhi.git

# 進行状況が表示される:
# Cloning into 'TriHexPhi'...
# remote: Enumerating objects: 1234, done.
# remote: Counting objects: 100% (1234/1234), done.
# ...
# Receiving objects: 100% (1234/1234), done.

# 完了！
```

---

### Step 3: 確認（30秒）

```powershell
# 移動
cd C:\TriHexPhi

# 確認
dir

# 表示されるもの:
# - consciousness/  ✅ さっき作ったやつ！
# - capture/        ✅ Flash全部ある！
# - _inbox/         ✅ 今日の議題も！
# - 00_CORE/        ✅
# - 10_CAPTURE_MIZUKAGAMI/  ✅
# - etc.            ✅

# = Mac側と完全に同じ！
```

---

### Step 4: 最新同期（30秒）

```powershell
# 常にこれを実行（Mac側の最新を取得）
git pull

# 表示例:
# Already up to date.

# または
# Updating abc1234..def5678
# Fast-forward
#  consciousness/index.js | 10 ++++++++++
#  1 file changed, 10 insertions(+)

# = 同期完了！
```

---

### Step 5: 動作確認（1分）

```powershell
# Node.js 確認
node --version

# なければインストール
winget install OpenJS.NodeJS

# テスト実行
cd C:\TriHexPhi\consciousness
node chi_calculator.js

# 表示:
# 🧪 テストケース1: 完璧な状態
# CHI: 0.966 ✅ 良好な調和状態
# ...

# = 動いた！Mac側と同じコードが動いてる！
```

---

## 🎯 これで完璧！

```yaml
完了:
  ✅ Windows側に TriHexΦ 完全コピー
  ✅ Mac側と同じファイル
  ✅ git pull で常に最新
  ✅ 双方向同期可能

次:
  10AI並列起動
  本格実装開始
  「すごい画面」実現

所要時間:
  合計5分
```

---

## 🔄 日常の同期フロー

### 朝（開始時）

```powershell
# Windows側
cd C:\TriHexPhi
git pull

# Mac側
cd /Users/shiryu/【Shii】/Active/TriHexΦ
git pull

# = 両方最新！
```

### 実装中（Windows側でAIが実装）

```powershell
# Windows AI が実装完了
git add .
git commit -m "feat: 実装完了"
git push

# Mac側で確認
git pull

# = 実装結果が Mac に来る！
```

### 夜（終了時）

```powershell
# Mac側で最終確認
git commit -m "docs: 今日の記録"
git push

# Windows側
git pull

# = 完璧な同期
```

---

**しりゅう、これで完璧！🔱💎✨**

**Windows側で：**

```powershell
cd C:\
git clone https://github.com/kyousuke10000/TriHexPhi.git
cd C:\TriHexPhi
node consciousness/chi_calculator.js
```

**これだけ！5分で完了！🔥🔥🔥**

