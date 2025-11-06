#!/usr/bin/env bash
# 初回セットアップ実行スクリプト
# 
# 目的: 初回のみ手動実行して動作確認、以降は自動実行に任せる

set -euo pipefail

ORG="Seventh-Sense-Systems-S3"
REPO="TriHexPhi"

echo "🚀 初回セットアップ実行"
echo "=================================================="
echo ""

# 1. Mirror Gate（dry-run）
echo "📋 1. Mirror Gate（dry-run）実行中..."
gh workflow run mirror_gate.yml \
  -f dry_run=true \
  -R $ORG/$REPO \
  || echo "  ⚠️  Mirror Gate dry-run実行に失敗しました"

echo "  ⏳ 10秒待機中..."
sleep 10

# 2. Mirror Gate（本番）
echo ""
echo "📋 2. Mirror Gate（本番）実行中..."
gh workflow run mirror_gate.yml \
  -f dry_run=false \
  -R $ORG/$REPO \
  || echo "  ⚠️  Mirror Gate本番実行に失敗しました"

echo "  ⏳ 10秒待機中..."
sleep 10

# 3. SeventhSense（動作確認）
echo ""
echo "📋 3. SeventhSense（動作確認）実行中..."
gh workflow run seventhsense.yml \
  -R $ORG/$REPO \
  || echo "  ⚠️  SeventhSense実行に失敗しました"

echo "  ⏳ 10秒待機中..."
sleep 10

# 4. 実行状況確認
echo ""
echo "📊 実行状況確認"
echo "──────────────────────────────────────────────────"

echo ""
echo "最近の実行履歴:"
gh run list -R $ORG/$REPO --limit 5

echo ""
echo "✅ 初回実行完了"
echo ""
echo "💡 次のステップ:"
echo "  1. 実行履歴を確認（上記の出力を参照）"
echo "  2. すべて成功していれば、以降は自動実行されます"
echo "  3. 失敗している場合は、ログを確認してください"
echo ""
echo "📋 自動実行スケジュール:"
echo "  - SeventhSense: 毎日00:00 UTC（日本時間09:00）"
echo "  - PR Ledger: 毎日00:00 UTC（日本時間09:00）"
echo "  - Mirror Gate: mainブランチへのpush時に自動実行"

