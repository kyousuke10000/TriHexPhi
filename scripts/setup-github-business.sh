#!/usr/bin/env bash
# GitHub Business 最適化 セットアップスクリプト
# 
# 事前検証: npm run check:github-business
# 確認事項をGPTに質問してから実行すること

set -euo pipefail

# =========================================
# 0) 前提確認
# =========================================

echo "🔍 GitHub Business 最適化セットアップ"
echo "=========================================="

# 事前検証を実行
echo ""
echo "📋 事前検証を実行します..."
npm run check:github-business

echo ""
read -p "⚠️  上記の確認事項をGPTに質問しましたか？ (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "❌ キャンセルしました。事前検証結果をGPTに確認してから実行してください。"
  exit 1
fi

read -p "⚠️  GPTから承認を得ましたか？ (y/N): " approved
if [[ ! "$approved" =~ ^[Yy]$ ]]; then
  echo "❌ キャンセルしました。GPTの承認を得てから実行してください。"
  exit 1
fi

# 変数設定
echo ""
echo "📝 変数を設定してください:"
read -p "Organization名: " ORG
read -p "Repository名 (default: TriHexPhi): " REPO
REPO=${REPO:-TriHexPhi}
read -p "Public Mirror名 (default: TriHexPhi-public): " PUB_REPO
PUB_REPO=${PUB_REPO:-TriHexPhi-public}
read -p "Owner GitHub ID: " OWNER_ID
read -p "Claude Bot GitHub ID (optional): " CLAUDE_BOT_ID

echo ""
echo "設定確認:"
echo "  ORG: $ORG"
echo "  REPO: $REPO"
echo "  PUB_REPO: $PUB_REPO"
echo "  OWNER_ID: $OWNER_ID"
echo "  CLAUDE_BOT_ID: ${CLAUDE_BOT_ID:-未設定}"
read -p "この設定で続行しますか？ (y/N): " proceed
if [[ ! "$proceed" =~ ^[Yy]$ ]]; then
  echo "❌ キャンセルしました。"
  exit 1
fi

# =========================================
# 1) Organization Secrets
# =========================================

echo ""
echo "📋 1. Organization Secrets 設定"
echo "─".repeat(50)

for S in OPENAI_API_KEY GEMINI_API_KEY ANTHROPIC_API_KEY DEEPSEEK_API_KEY GROK_API_KEY PPLX_API_KEY MIRROR_TOKEN; do
  echo ""
  echo "設定: $S"
  echo "  - 既に設定済みの場合はスキップしてください"
  echo "  - 値を入力するか、CTRL+Dでスキップ"
  read -p "  $S を設定しますか？ (y/N/skip): " set_secret
  
  if [[ "$set_secret" =~ ^[Yy]$ ]]; then
    echo "値を入力してください（入力後CTRL+D）:"
    VALUE=$(cat)
    if [ -n "$VALUE" ]; then
      echo "$VALUE" | gh secret set "$S" -o "$ORG" || echo "⚠️  $S の設定に失敗しました"
      echo "  ✅ $S 設定完了"
    else
      echo "  ⚠️  値が空のためスキップ"
    fi
  elif [[ "$set_secret" == "skip" ]]; then
    echo "  ⏭️  スキップ"
  else
    echo "  ⏭️  スキップ"
  fi
done

# MIRROR_REPO (固定値)
echo ""
read -p "MIRROR_REPO を設定しますか？ ($ORG/$PUB_REPO) (y/N): " set_mirror
if [[ "$set_mirror" =~ ^[Yy]$ ]]; then
  echo "$ORG/$PUB_REPO" | gh secret set MIRROR_REPO -o "$ORG" || echo "⚠️  MIRROR_REPO の設定に失敗しました"
  echo "  ✅ MIRROR_REPO 設定完了"
fi

# =========================================
# 2) Environments
# =========================================

echo ""
echo "📋 2. Environments 作成"
echo "─".repeat(50)

for env in staging production; do
  echo ""
  read -p "$env 環境を作成しますか？ (y/N): " create_env
  if [[ "$create_env" =~ ^[Yy]$ ]]; then
    gh api repos/$ORG/$REPO/environments -f name=$env >/dev/null 2>&1 && echo "  ✅ $env 作成完了" || echo "  ⚠️  $env は既に存在するか、作成に失敗しました"
  fi
done

# Production環境のレビュアー設定
if [ -n "$CLAUDE_BOT_ID" ]; then
  echo ""
  read -p "production環境にレビュアーを設定しますか？ (y/N): " set_reviewers
  if [[ "$set_reviewers" =~ ^[Yy]$ ]]; then
    gh api \
      -X PUT \
      -H "Accept: application/vnd.github+json" \
      repos/$ORG/$REPO/environments/production/protection_rules \
      -f "reviewers[][type]=User" -f "reviewers[][id]=$OWNER_ID" \
      -f "reviewers[][type]=User" -f "reviewers[][id]=$CLAUDE_BOT_ID" \
      -f required_reviewers_count=1 >/dev/null 2>&1 && echo "  ✅ レビュアー設定完了" || echo "  ⚠️  レビュアー設定に失敗しました"
  fi
fi

# =========================================
# 3) Branch Protection
# =========================================

echo ""
echo "📋 3. Branch Protection 設定"
echo "─".repeat(50)

read -p "mainブランチ保護を設定しますか？ (y/N): " set_protection
if [[ "$set_protection" =~ ^[Yy]$ ]]; then
  gh api \
    -X PUT \
    -H "Accept: application/vnd.github+json" \
    repos/$ORG/$REPO/branches/main/protection \
    -f required_status_checks.strict=true \
    -f enforce_admins=true \
    -f required_pull_request_reviews.required_approving_review_count=1 \
    -f restrictions=null >/dev/null 2>&1 && echo "  ✅ ブランチ保護設定完了" || echo "  ⚠️  ブランチ保護設定に失敗しました"
fi

# =========================================
# 4) ワークフロー設定ファイル生成
# =========================================

echo ""
echo "📋 4. ワークフロー設定テンプレート生成"
echo "─".repeat(50)

mkdir -p .github/workflows

# テンプレート生成（既存の内容を確認してから適用）
cat > .github/workflows/_patch_actions_recommendations.txt <<'YAML'
# 各workflowの先頭付近に追記・調整推奨：

# permissions: 原則最小権限
permissions:
  contents: write
  actions: read

# 競合防止：同名ジョブは直列化（必要な時）
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# 環境指定：Public反映やデプロイ系は production 環境へ
environment: production

# Self-hosted Runnerを使う場合の例（任意）
# runs-on: self-hosted
# labels: [self-hosted, linux, x64, trihex]
YAML

echo "  ✅ テンプレート生成完了: .github/workflows/_patch_actions_recommendations.txt"

# =========================================
# 5) README更新
# =========================================

echo ""
echo "📋 5. README更新"
echo "─".repeat(50)

if [ -f README.md ]; then
  if grep -q "Public Mirror" README.md; then
    echo "  ℹ️  READMEにPublic Mirrorリンクが既に存在します"
    read -p "  READMEを更新しますか？ (y/N): " update_readme
  else
    update_readme="y"
  fi
  
  if [[ "$update_readme" =~ ^[Yy]$ ]]; then
    # バックアップ
    cp README.md README.md.bak
    
    # 追加（既に存在しない場合のみ）
    if ! grep -q "### 🔭 Public Mirror" README.md; then
      cat >> README.md <<EOF

---

### 🔭 Public Mirror（固定入口）

- **Main**: https://github.com/$ORG/$PUB_REPO
- **Raw Index**: https://raw.githubusercontent.com/$ORG/$PUB_REPO/main/index.md

> 新しいチャットが始まったら、上の Raw Index をGPTに貼るだけで文脈即時回復。
EOF
      echo "  ✅ README更新完了"
    else
      echo "  ℹ️  Public Mirrorセクションが既に存在します"
    fi
  fi
else
  echo "  ⚠️  README.md が存在しません"
fi

# =========================================
# 6) 最終チェック
# =========================================

echo ""
echo "📊 最終チェック"
echo "=".repeat(50)

echo ""
echo "Actions一覧:"
gh workflow list -R $ORG/$REPO | head -10

echo ""
echo "Environments:"
gh api repos/$ORG/$REPO/environments 2>/dev/null | jq -r '.environments[].name' 2>/dev/null || echo "確認不可"

echo ""
echo "Branch保護:"
gh api repos/$ORG/$REPO/branches/main/protection 2>/dev/null | jq -r '.required_pull_request_reviews.required_approving_review_count // "not set"' 2>/dev/null || echo "確認不可"

echo ""
echo "✅ セットアップ完了"
echo ""
echo "📝 次のステップ:"
echo "  1. ワークフローファイルに environment: production を追加（必要に応じて）"
echo "  2. テンプレートを確認: .github/workflows/_patch_actions_recommendations.txt"
echo "  3. コミット & プッシュ"

