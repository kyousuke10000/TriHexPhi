## PHASE 4: 検証チェックリスト

### 1) git worktree list
/Users/shiryu/【Shii】/Active/TriHexΦ           29ee9f3 [feat/kyoen-phase2]
/Users/shiryu/【Shii】/Active/TriHex.core       1ed011e [main]
/Users/shiryu/【Shii】/Active/trihex_council    29ee9f3 [council]
/Users/shiryu/【Shii】/Active/trihex_history    29ee9f3 [history]
/Users/shiryu/【Shii】/Active/trihex_impl       29ee9f3 [impl]
/Users/shiryu/【Shii】/Active/trihex_ops        29ee9f3 [ops]
/Users/shiryu/【Shii】/Active/trihex_specs      29ee9f3 [specs]

### 2) Proof files
99_SYSTEM/Proofs/AIOS_Gemini_Mode_2025-11-05_08-04.md
99_SYSTEM/Proofs/AIOS_Gemini_Mode_2025-11-05_08-03.md
99_SYSTEM/Proofs/AIOS_TOTAL_BOOT_2025-11-05_06-43.md
No bridge logs found

### 3) Council Records
⚠️ REC_2025-11-05_demo.md not found (will be created when plan is applied)

### 4) Council Gate Workflow
✅ council_gate.yml exists

---

## 使い方メモ


### 実装（Gemini CLI常駐）

```bash
WT=$(tools/bin/ai switch impl) && cd "$WT" && gemini
# 以降、このワークツリーを実装の主戦場に
```

### 設計レビュー（Gemini長文脈）

```bash
WT=$(tools/bin/ai switch specs) && cd "$WT"
gemini run "このリポジトリの構造を評価し、改善計画を段階的に提案して。出力は '99_SYSTEM/Proofs/PLAN_specs_${RANDOM}.md' に保存するシェルコマンドも添えて"
```

### Web版GPT/他AI → 実行計画 → bridge適用

```bash
tools/bin/ai plan > /tmp/plan.txt
# /tmp/plan.txt を編集（MKDIR/WRITE/RUN...）
tools/bin/ai apply impl /tmp/plan.txt
```

### 合議 → PR Gate

```bash
# DECファイル作成
DEC=$(tools/bin/council new topic_name)
# decisionをapprovedに変更
sed -i '' 's/decision: pending/decision: approved/' "$DEC"

# PR本文末用フッター出力
tools/bin/council footer "$DEC" "https://github.com/<org>/<repo>/discussions/1234"
```


---

**Status:** ✅ Complete
**Generated:** 2025-11-05 08:04:05
