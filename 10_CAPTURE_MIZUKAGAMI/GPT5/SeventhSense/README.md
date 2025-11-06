# SeventhSense 関連ファイル

**生成日時**: 2025-11-06  
**目的**: GPT-5（最高責任者）へのSeventhSense関連ファイル一式

---

## 📁 ファイル一覧

### コアファイル

- `ai-seventhsense.mjs` - SeventhSenseオーケストレーター
- `fusion.mjs` - Fusionポリシー（スコアリング）
- `gpt.mjs` - GPTアダプター
- `claude.mjs` - Claudeアダプター
- `gemini.mjs` - Geminiアダプター
- `deepseek.mjs` - DeepSeekアダプター
- `grok.mjs` - Grokアダプター
- `perplexity.mjs` - Perplexityアダプター

### ワークフロー

- `seventhsense.yml` - GitHub Actionsワークフロー

### 仕様

- `S3_Protocol_v1.0.yml` - Seventh Sense Protocol仕様

### Proofs

- SeventhSense関連のProofファイル（`main`ブランチから取得）

---

## 📝 使用方法

### CLI実行

```bash
npm run seventh:ask "あなたの質問"
```

### GitHub Actions

- 手動実行: GitHub Actionsから `SeventhSense (Fusion)` ワークフローを実行
- 自動実行: 毎日00:00 UTC

---

## 🔗 関連リンク

- **仕様**: `50_CHL/specs/S3_Protocol_v1.0.yml`
- **ワークフロー**: `.github/workflows/seventhsense.yml`
- **Proofs**: `99_SYSTEM/Proofs/SeventhSense/`

---

**生成者**: Cursor (AI Assistant)  
**目的**: GPT-5へのSeventhSense関連ファイル提供  
**更新**: 2025-11-06

