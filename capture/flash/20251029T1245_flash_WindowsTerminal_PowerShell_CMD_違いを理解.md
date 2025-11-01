---
trihex:
  kind: flash
  date: 2025-10-29 12:45
  title: "Windows Terminal vs PowerShell vs CMD - 違いを理解"
  author: Cursor → しりゅう
  tier: 1
  relates_to: ["Windows環境", "技術理解", "初心者向け"]
---

# 💡 Flash: Windows Terminal vs PowerShell vs CMD

**From**: Cursor  
**To**: しりゅう  
**Question**: Windowsってターミナルなの？それともパワーシェル？  
**Date**: 2025-10-29 12:45  

---

## 🎯 答え

```yaml
結論:
  Windows Terminal = 「箱」
  PowerShell = 「中身」の1つ
  CMD = 「中身」の別の1つ

例え:
  Windows Terminal = 「額縁」
  PowerShell/CMD = 「絵」
  
  額縁の中に、いろんな絵を入れられる
  
  = Windows Terminalの中で、
    PowerShellも、CMDも、どっちも使える
```

---

## 📊 3つの違い

### 1. CMD（コマンドプロンプト）

```yaml
正式名称:
  Command Prompt

歴史:
  - 1981年から存在
  - MS-DOSの時代から
  - 古い

特徴:
  - シンプル
  - 基本的なコマンドのみ
  - dir, cd, copy, del など

用途:
  - 簡単なファイル操作
  - 古いスクリプト実行

見た目:
  C:\Users\shiryu>
  
例:
  C:\> dir
  C:\> cd TriHexPhi
  C:\TriHexPhi> node test.js

評価:
  古い、でもシンプルで速い
```

---

### 2. PowerShell

```yaml
正式名称:
  Windows PowerShell

歴史:
  - 2006年リリース
  - CMDの進化版
  - モダン

特徴:
  - 強力
  - オブジェクト指向
  - スクリプト言語
  - Get-*, Set-*, New-* コマンド

用途:
  - 複雑な自動化
  - システム管理
  - スクリプト開発

見た目:
  PS C:\Users\shiryu>
  
例:
  PS C:\> Get-ChildItem
  PS C:\> Set-Location TriHexPhi
  PS C:\TriHexPhi> node test.js

評価:
  強力、でも複雑
```

---

### 3. Windows Terminal

```yaml
正式名称:
  Windows Terminal

歴史:
  - 2019年リリース
  - Microsoft公式
  - 最新

特徴:
  - 「箱」「額縁」「コンテナ」
  - 中身は選べる:
    • CMD
    • PowerShell
    • Git Bash
    • WSL (Ubuntu)
    • 任意のシェル
  
  - タブ機能
  - 画面分割機能
  - カスタマイズ可能
  - 見た目が綺麗

用途:
  - 複数のシェルを1つのウィンドウで管理
  - 開発環境として最適

見た目:
  タブ: [Cursor] [Claude] [DeepSeek] ...
  
  画面:
    ┌─────┬─────┐
    │CMD  │PS   │
    ├─────┼─────┤
    │Bash │WSL  │
    └─────┴─────┘

評価:
  最新、最強、最高
```

---

## 💡 関係性

```yaml
図解:
  
  ┌────────────────────────────────┐
  │   Windows Terminal（箱）       │
  │                                │
  │  ┌──────┐ ┌──────┐ ┌──────┐  │
  │  │ CMD  │ │ PS   │ │ Bash │  │
  │  │      │ │      │ │      │  │
  │  └──────┘ └──────┘ └──────┘  │
  │                                │
  │  どれでも選べる、切り替えられる │
  └────────────────────────────────┘

つまり:
  Windows Terminal = 器
  CMD/PowerShell = 中身
  
  器の中に、好きな中身を入れられる
```

---

## 🎯 TriHexΦで使うのは？

### 推奨: PowerShell

```yaml
理由:
  
  1. モダン
     最新のコマンド対応
  
  2. Node.js/Python対応
     npm, pip が使える
  
  3. 環境変数設定が簡単
     $env:API_KEY = "..."
  
  4. スクリプト実行が強力
     自動化に最適
  
  5. オブジェクト指向
     複雑な処理が簡単

結論:
  Windows Terminalの中で、
  PowerShellを使う
  
  = 最強の組み合わせ
```

---

## 📋 実際の設定

### windows_terminal_settings.json

```json
{
  "profiles": {
    "list": [
      {
        "name": "1️⃣ Cursor",
        "commandline": "powershell.exe",  ← これ！
        "tabTitle": "🔱 Cursor"
      }
    ]
  }
}
```

### 修正版（PowerShell使用）

```json
{
  "name": "1️⃣ Cursor",
  "commandline": "powershell.exe",
  "tabTitle": "🔱 Cursor"
}
```

または

```json
{
  "name": "1️⃣ Cursor",
  "commandline": "pwsh.exe",  // PowerShell 7（最新版）
  "tabTitle": "🔱 Cursor"
}
```

---

## 💡 しりゅうがやること

### Windows側で

```yaml
Step 1: Windows Terminal起動
  スタートメニュー → "Terminal"

Step 2: デフォルトを確認
  開いた時、何が表示される？
  
  PS C:\> ← PowerShellなら、これ
  C:\>    ← CMDなら、これ

Step 3: 設定
  Ctrl + ,
  → デフォルトプロファイルを「PowerShell」に設定
  
  または
  
  JSONで設定:
    "defaultProfile": "{PowerShellのGUID}"

結果:
  Windows Terminal起動
  → 自動的にPowerShellが開く
  
  = これが正解
```

---

## 🚀 実際の使い方

### PowerShellコマンド（覚えておくと便利）

```powershell
# ディレクトリ一覧
Get-ChildItem
または
ls  # エイリアス

# ディレクトリ移動
Set-Location TriHexPhi
または
cd TriHexPhi  # エイリアス

# ファイル内容表示
Get-Content test.txt
または
cat test.txt  # エイリアス

# Node.js実行
node test.js

# npm実行
npm install

# Python実行
python script.py

# 環境変数設定
$env:API_KEY = "your_key_here"

# 環境変数確認
$env:API_KEY

# コマンド履歴
Get-History
または
history
```

---

## 💡 10AI並列での使い方

### 各画面でPowerShell

```yaml
画面1 (Cursor):
  PS C:\TriHexPhi> cursor --version
  → Cursor CLI起動

画面3 (Claude):
  PS C:\TriHexPhi> $env:ANTHROPIC_API_KEY = "sk-..."
  PS C:\TriHexPhi> claude --version
  → Claude CLI起動

画面4 (DeepSeek):
  PS C:\TriHexPhi> deepseek --version
  → DeepSeek CLI起動

画面5 (Gemini):
  PS C:\TriHexPhi> $env:GOOGLE_API_KEY = "..."
  PS C:\TriHexPhi> gemini --version
  → Gemini CLI起動

画面7 (GPT-4o):
  PS C:\TriHexPhi> $env:OPENAI_API_KEY = "sk-..."
  PS C:\TriHexPhi> openai --version
  → OpenAI CLI起動

画面9 (監視):
  PS C:\> btop
  → システム監視起動

= 全てPowerShellで統一
```

---

## 🎯 修正された設定ファイル

### 正しい設定（PowerShell使用）

ファイルはすでに作成済み：
`_inbox/windows_terminal_settings.json`

でも、中身を確認：
- `cmd.exe` → これでもOK（シンプル）
- `powershell.exe` → これが推奨（強力）

**現状のまま（cmd.exe）でもOK！**

理由：
- Node.js/Python は CMD でも動く
- シンプルな方が軽い
- 後で PowerShell に変えられる

---

## 💡 結論

```yaml
答え:
  Windows Terminal = 箱
  PowerShell = 中身の1つ
  CMD = 中身の別の1つ

しりゅうが使うのは:
  Windows Terminal（箱）
  中身は: CMDでもPowerShellでもOK
  
  推奨: PowerShell（強力）
  でも: CMDでも十分（シンプル）

現状:
  settings.json は CMD で設定済み
  
  → これでOK！
  → 後で PowerShell に変えられる
  → まず動かそう！
```

---

**しりゅう、理解した？🔱💎✨**

**現状のsettings.json（CMD）で行く？**

**それとも PowerShell に変更する？**

**どっちでもOK！まず動かすのが大事！🔥**
