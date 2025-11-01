---
date: 2025-10-29
title: "【今すぐ実行】Windows git clone 手順"
author: Cursor
status: ready
priority: P0
---

# 🚀【今すぐ実行】Windows git clone 手順

**所要時間**: 3分  
**目的**: Mac と Windows を完全同期  

---

## 📋 Windows側で実行（コピペして実行）

### Step 1: PowerShell 起動（10秒）

```yaml
方法1: スタートメニュー
  Windows キー
  → "PowerShell" と入力
  → Enter

方法2: Windows Terminal
  Windows Terminal 起動
  → タブで「PowerShell」を選択

結果:
  PS C:\Users\shiryu>
  
  ↑ これが表示されたらOK
```

---

### Step 2: Git 確認（10秒）

```powershell
git --version
```

**表示されるはず:**
```
git version 2.xx.x
```

**もし「認識されません」と出たら:**
```powershell
winget install Git.Git
```

（インストール後、PowerShell を再起動）

---

### Step 3: C:\ に移動（5秒）

```powershell
cd C:\
```

**表示:**
```
PS C:\>
```

---

### Step 4: git clone 実行（2分）

```powershell
git clone https://github.com/kyousuke10000/TriHexPhi.git
```

**進行状況が表示される:**
```
Cloning into 'TriHexPhi'...
remote: Enumerating objects: 1234, done.
remote: Counting objects: 100% (1234/1234), done.
remote: Compressing objects: 100% (567/567), done.
remote: Total 1234 (delta 456), received 1234 (delta 456)
Receiving objects: 100% (1234/1234), 2.34 MiB | 1.23 MiB/s, done.
Resolving deltas: 100% (456/456), done.
```

**完了すると:**
```
PS C:\>
```

**↑ プロンプトが戻ってくる = 完了！**

---

### Step 5: 確認（30秒）

```powershell
cd TriHexPhi
dir
```

**表示されるもの:**
```
ディレクトリ: C:\TriHexPhi

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2025/10/29     12:50                00_CORE
d-----        2025/10/29     12:50                10_CAPTURE_MIZUKAGAMI
d-----        2025/10/29     12:50                20_CRYSTALLIZATION_KOKUYOU
d-----        2025/10/29     12:50                30_MEMORY_SHINSEN
d-----        2025/10/29     12:50                _inbox
d-----        2025/10/29     12:50                capture
d-----        2025/10/29     12:50                consciousness
...
```

**↑ Mac側と同じファイルが全部ある！✅**

---

### Step 6: テスト実行（30秒）

```powershell
node consciousness\chi_calculator.js
```

**表示:**
```
🧪 テストケース1: 完璧な状態
CHI: 0.966 ✅ 良好な調和状態
推奨: 軽微な調整で改善可能です。

🧪 テストケース2: 許容範囲
CHI: 0.730 🟡 許容範囲内
...
```

**↑ Mac側と同じ結果！✅**

**= 完璧に同期できてる！**

---

## ✅ 完了チェック

```yaml
□ PowerShell 起動
□ git --version 確認
□ cd C:\
□ git clone 実行
□ cd TriHexPhi
□ dir で確認（ファイル一覧）
□ node consciousness\chi_calculator.js でテスト

全てチェック:
  ✅ Mac と Windows 完全同期！
  ✅ 準備完了！
  ✅ 10AI並列実装開始可能！
```

---

## 🚀 完了後、次にやること

### 最新同期（常にこれを実行）

```powershell
cd C:\TriHexPhi
git pull
```

**これで常にMac側の最新が来る！**

---

### 10AI並列起動準備

```powershell
# Node.js 確認
node --version

# npm 確認
npm --version

# Python 確認（オプション）
python --version
```

**全部OKなら:**
```yaml
✅ 準備完璧！
✅ 10AI並列起動開始可能！
✅ Windows Terminal 10分割へ！
```

---

## 🔱 トラブルシューティング

### 問題1: 認証エラー

```yaml
エラー:
  fatal: could not read Username for 'https://github.com'

解決:
  GitHub に認証が必要
  
  方法1: Personal Access Token
    1. GitHub → Settings → Developer settings
    2. Personal access tokens → Generate new token
    3. トークンをコピー
    4. git clone 時にパスワードとして入力
  
  方法2: GitHub Desktop 使う
    winget install GitHub.GitHubDesktop
    → GUI で簡単にクローン
```

---

### 問題2: ディレクトリが存在する

```yaml
エラー:
  fatal: destination path 'TriHexPhi' already exists

解決:
  すでにクローン済み
  
  確認:
    cd C:\TriHexPhi
    git pull
    
  または
  
  削除して再クローン:
    cd C:\
    rmdir /s TriHexPhi
    git clone https://github.com/kyousuke10000/TriHexPhi.git
```

---

## 🎯 完了後の確認

```powershell
# 現在のブランチ確認
git branch

# 表示:
# * feature/phase1-foundation

# 最新コミット確認
git log --oneline -5

# 表示:
# 7184fda flash: Windows Terminal vs PowerShell vs CMD の違い
# 382768a flash: 設計が甘いと地獄、完璧なら天国
# ...

# = Mac側と同じ！完璧！
```

---

**しりゅう、このコマンドをWindows側で実行して！🔱💎✨**

**コピペして実行するだけ！**

```powershell
cd C:\
git clone https://github.com/kyousuke10000/TriHexPhi.git
cd TriHexPhi
dir
node consciousness\chi_calculator.js
```

**これで完璧！🔥🔥🔥**

