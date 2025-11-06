#!/usr/bin/env bash
# Environments作成とBranch Protection設定（修正版）

set -euo pipefail

ORG="kyousuke10000"
REPO="TriHexPhi"
ADMIN_USER="kyousuke10000"

echo "📋 Environments作成"
echo "──────────────────────────────────────────────────"

# staging環境
echo "  staging環境を作成中..."
gh api \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  repos/$ORG/$REPO/environments/staging \
  -f name=staging \
  || echo "  ⚠️  staging環境は既に存在するか、作成に失敗しました"

# production環境
echo "  production環境を作成中..."
gh api \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  repos/$ORG/$REPO/environments/production \
  -f name=production \
  || echo "  ⚠️  production環境は既に存在するか、作成に失敗しました"

# production環境のレビュアー設定
echo "  production環境のレビュアーを設定中..."
gh api \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  repos/$ORG/$REPO/environments/production/protection_rules \
  -f reviewers[][type]=User \
  -f reviewers[][id]=$ADMIN_USER \
  -f required_reviewers_count=1 \
  || echo "  ⚠️  レビュアー設定に失敗しました（既に設定済みの可能性）"

echo ""
echo "📋 Branch Protection設定"
echo "──────────────────────────────────────────────────"

# Branch Protection設定（正しい形式）
echo "  mainブランチ保護を設定中..."
gh api \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  repos/$ORG/$REPO/branches/main/protection \
  -f '{
    "required_status_checks": {
      "strict": true,
      "contexts": []
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1
    },
    "restrictions": null
  }' \
  || echo "  ⚠️  ブランチ保護設定に失敗しました"

echo ""
echo "✅ 設定完了"

