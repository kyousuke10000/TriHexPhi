# 響縁AI（KYOEN AI）

**サブキャッチ:** 人のご縁が、AIで響く。

---

## Ⅰ. Purpose & Vision

**目的:** ご縁（縁）× 共鳴（響）をAIで増幅し、優しい循環を生む。

**哲学:** AI = Amplified Intuition（直感の増幅装置）

**価値:** 想いを言語化し、縁を可視化し、感謝を循環させる。

---

## Ⅱ. Brand Architecture

### 表ブランド: 響縁AI

**名前:** 響縁AI（KYOEN AI）  
**認知:** TriHexは表に出さない  
**焦点:** 人の縁とAIの共鳴

### 裏OS: TriHex

**基盤:** TriHex Breathing Architecture  
**循環:** Harmonia Council Protocol  
**証明:** Proof-based documentation

---

## Ⅲ. Introduction Targets

**徳之島チーム:**
- **辻さん** - 拡散/営業
- **知恵里さん** - 共感/翻訳
- **子竜** - 設計/AI

**役割分担:**
- 辻: pitch / 行脚 / 導入
- 知恵里: 共感共有 / 証言
- 子竜: 設計 / 改善 / AI運用

---

## Ⅳ. KPIs

| KPI | 定義 | 目標 |
|-----|------|------|
| **投稿本数** | AI生成投稿の週次本数 | 20本/週 |
| **響き（紹介）** | 紹介文生成→投稿→反応 | 50%反応率 |
| **共鳴（応援）** | 感謝メッセージ生成→送信 | 80%到達 |
| **還流（ポイント）** | 生成→投稿→成約率 | 15%成約率 |
| **再来率** | 1回使った→2回目使用 | 60%再来 |

---

## Ⅴ. Terminology

| 用語 | 意味 | 使い方 |
|------|------|--------|
| **響き** | 紹介文生成 | 「○○さんを響かせる」 |
| **共鳴** | 感謝/応援メッセージ | 「共鳴を送る」 |
| **還流** | マイルポイント/報酬 | 「還流を受け取る」 |
| **AI生成** | 響縁AIが作る文章 | 「AI生成を使う」 |
| **想いの言語化** | 直感→文章 | 「想いを言語化する」 |

---

## Ⅵ. Operating Rules

1. **すべての生成結果をProofsへ記録**
   - 保存先: `99_SYSTEM/Proofs/KyoenAI/`
   - 日時、対象、要約を自動記録

2. **UTF-8/NFC/LF強制**
   - 文字化けゼロ
   - あたたかみを損なわない

3. **想い優先**
   - 難しさ不要
   - AI設定不要
   - 話すだけ

4. **循環重視**
   - 売る前に響かせる
   - 説明じゃなく共演
   - ありがとうが最強

---

## Ⅵ-A. Preset運用

### 原則

**台本ではなく、"本人の言葉を整える"**

- 辻モード: 断定・熱量・比喩を自然に織り込み
- 知恵里モード: 柔らか・感情の証拠・ブリッジ表現
- Channel調整: line/tsukutsuku/stageで語気/長さを変える

### 使い方

```bash
# 辻さん短文
node tools/kyoenAI/generator.mjs --preset tsuji --channel line --topic "ツクツク=分け合い"

# 知恵里さん共感
node tools/kyoenAI/generator.mjs --preset chieri --channel line --topic "AI怖い→安心"
```

---

## Ⅶ. Integration Points

### With TriHex

- **呼吸:** 徳之島ノード → Proof → 循環
- **整合:** KYOEN AI = TriHexの外向け顔
- **記憶:** 全生成物はSupabaseへ同期予定

### With 徳之島チーム

- **LINE導入:** Day1-3テンプレ使用
- **初期運用:** 1週間で最初の結果可視化
- **改善サイクル:** 週次KPI → フィードバック → 改善

### With Ryūdō導線（Actions）

- **Discussion→Router:** GitHub Discussions → Conductor
- **Live/Demo切替:** 秘密あり→live、なし→demo自動フォールバック
- **失敗時:** 常にdemoで完走保証

---

## Ⅷ. Success Definition

**短期（1週間）:**
- 全メンバーが1回以上AI生成使用
- 10本以上の投稿生成
- 5件以上の反応獲得

**中期（1ヶ月）:**
- 紹介→成約率15%達成
- ツクツク内地域一位
- 月次還流最大化

**長期（継続）:**
- 応援文化の可視化
- 優しい循環の定着
- ご縁の増幅

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** VI Consolidation  
**Brand:** KYOEN AI Launch

---

*"想いが響けば、結果は後からついてくる。"*
