#!/usr/bin/env bash
# 既存リポジトリから新しいOrganizationリポジトリへの移行スクリプト

set -euo pipefail

OLD_REPO="kyousuke10000/TriHexPhi"
NEW_ORG="Seventh-Sense-Systems-S3"
NEW_REPO="TriHexPhi"

echo "🔄 リポジトリ移行スクリプト"
echo "=================================================="
echo ""
echo "📋 移行内容:"
echo "  既存: $OLD_REPO"
echo "  新規: $NEW_ORG/$NEW_REPO"
echo ""

read -p "この移行を実行しますか？ (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "❌ キャンセルしました"
  exit 1
fi

# 現在のブランチを確認
CURRENT_BRANCH=$(git branch --show-current)
echo ""
echo "📋 現在のブランチ: $CURRENT_BRANCH"
echo ""

# 新しいリモートを追加（既に存在する場合はスキップ）
if git remote | grep -q "^s3$"; then
  echo "  ℹ️  リモート 's3' は既に存在します"
  git remote set-url s3 "https://github.com/$NEW_ORG/$NEW_REPO.git"
else
  echo "  📝 リモート 's3' を追加中..."
  git remote add s3 "https://github.com/$NEW_ORG/$NEW_REPO.git"
fi

echo ""
echo "📋 2. 新しいリポジトリにプッシュ中..."
echo "──────────────────────────────────────────────────"

# mainブランチにプッシュ
if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "  📝 mainブランチをプッシュ中..."
  git push s3 main:main || {
    echo "  ⚠️  プッシュに失敗しました"
    echo "  💡 手動で実行してください:"
    echo "     git push s3 main:main"
    exit 1
  }
else
  echo "  📝 現在のブランチ ($CURRENT_BRANCH) をmainとしてプッシュ中..."
  git push s3 "$CURRENT_BRANCH:main" || {
    echo "  ⚠️  プッシュに失敗しました"
    echo "  💡 手動で実行してください:"
    echo "     git push s3 $CURRENT_BRANCH:main"
    exit 1
  }
fi

echo ""
echo "✅ プッシュ完了"
echo ""
echo "📋 3. 新しいリポジトリの状態確認"
echo "──────────────────────────────────────────────────"

gh repo view $NEW_ORG/$NEW_REPO --json name,defaultBranchRef --jq '{name: .name, defaultBranch: .defaultBranchRef.name}'

echo ""
echo "✅ 移行完了"
echo ""
echo "📝 次のステップ:"
echo "  1. 新しいリポジトリでワークフローを実行"
echo "  2. 実行状況を確認"
echo ""
echo "🚀 ワークフロー実行:"
echo "  ./scripts/run-initial-setup.sh"

