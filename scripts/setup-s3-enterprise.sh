#!/usr/bin/env bash
# Seventh Sense Systems (S3) — Enterprise初期構築スクリプト
# 
# 前提: Enterprise "s3-systems" が作成済み
# Organization "SeventhSense-Systems" が作成済み

set -euo pipefail

# =========================================================
# 変数設定
# =========================================================

ENTERPRISE="s3-systems"
ORG="Seventh-Sense-Systems-S3"

# ユーザー情報を自動取得
OWNER_LOGIN=$(gh api user --jq .login)
OWNER_ID=$(gh api user --jq .id)
OWNER_NAME=$(gh api user --jq .name || echo "$OWNER_LOGIN")

echo "🔍 ユーザー情報確認:"
echo "  Login: $OWNER_LOGIN"
echo "  ID: $OWNER_ID"
echo "  Name: $OWNER_NAME"
echo ""

read -p "この情報で続行しますか？ (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "❌ キャンセルしました"
  exit 1
fi

# =========================================================
# 1. Organization確認
# =========================================================

echo ""
echo "📋 1. Organization確認"
echo "──────────────────────────────────────────────────"

if gh api orgs/$ORG >/dev/null 2>&1; then
  echo "  ✅ Organization '$ORG' は既に存在します"
else
  echo "  ❌ Organization '$ORG' が見つかりません"
  echo "  ℹ️  Organizationを作成しますか？"
  read -p "  (y/N): " create_org
  if [[ "$create_org" =~ ^[Yy]$ ]]; then
    gh org create "$ORG" --enterprise "$ENTERPRISE" --owner "$OWNER_LOGIN" || {
      echo "  ⚠️  Organization作成に失敗しました（既に存在する可能性）"
    }
  else
    echo "  ❌ Organizationが存在しないため、処理を中断します"
    exit 1
  fi
fi

# =========================================================
# 2. Teams作成
# =========================================================

echo ""
echo "📋 2. Teams作成"
echo "──────────────────────────────────────────────────"

for TEAM in Council Proof-Engineer Harmonia-Editor; do
  if gh api orgs/$ORG/teams/$TEAM >/dev/null 2>&1; then
    echo "  ✅ Team '$TEAM' は既に存在します"
  else
    echo "  📝 Team '$TEAM' を作成中..."
    gh api orgs/$ORG/teams \
      -f name="$TEAM" \
      -f privacy=closed \
      -f description="Seventh Sense Systems (S3) - $TEAM team" \
      >/dev/null 2>&1 && echo "  ✅ Team '$TEAM' 作成完了" || echo "  ⚠️  Team '$TEAM' 作成に失敗しました"
  fi
done

# =========================================================
# 3. リポジトリ確認・作成
# =========================================================

echo ""
echo "📋 3. リポジトリ確認・作成"
echo "──────────────────────────────────────────────────"

REPOS=(
  "TriHexPhi:private"
  "TriHexPhi-public:public"
  "7thSense-LP:private"
  "SeventhSense-Proofs:private"
)

for REPO_SPEC in "${REPOS[@]}"; do
  REPO_NAME="${REPO_SPEC%%:*}"
  REPO_VISIBILITY="${REPO_SPEC##*:}"
  
  if gh repo view $ORG/$REPO_NAME >/dev/null 2>&1; then
    echo "  ✅ Repository '$REPO_NAME' は既に存在します"
  else
    echo "  📝 Repository '$REPO_NAME' を作成中..."
    if [ "$REPO_VISIBILITY" = "public" ]; then
      gh repo create $ORG/$REPO_NAME --public --confirm >/dev/null 2>&1 && \
        echo "  ✅ Repository '$REPO_NAME' 作成完了（public）" || \
        echo "  ⚠️  Repository '$REPO_NAME' 作成に失敗しました"
    else
      gh repo create $ORG/$REPO_NAME --private --confirm >/dev/null 2>&1 && \
        echo "  ✅ Repository '$REPO_NAME' 作成完了（private）" || \
        echo "  ⚠️  Repository '$REPO_NAME' 作成に失敗しました"
    fi
  fi
done

# =========================================================
# 4. Org Secrets確認・設定
# =========================================================

echo ""
echo "📋 4. Org Secrets確認・設定"
echo "──────────────────────────────────────────────────"

SECRETS=(
  "OPENAI_API_KEY"
  "GEMINI_API_KEY"
  "ANTHROPIC_API_KEY"
  "DEEPSEEK_API_KEY"
  "GROK_API_KEY"
  "MIRROR_TOKEN"
)

# Secretsスキップモード（環境変数で制御可能）
SKIP_SECRETS=${SKIP_SECRETS:-false}

if [ "$SKIP_SECRETS" = "true" ]; then
  echo "  ℹ️  Secrets設定をスキップします（後でWeb UIから設定してください）"
  for SECRET in "${SECRETS[@]}"; do
    if gh secret list -o $ORG 2>/dev/null | grep -q "^$SECRET"; then
      echo "  ✅ Secret '$SECRET' は既に設定済み"
    else
      echo "  ⏭️  Secret '$SECRET' をスキップ（後で設定）"
    fi
  done
else
  for SECRET in "${SECRETS[@]}"; do
    if gh secret list -o $ORG 2>/dev/null | grep -q "^$SECRET"; then
      echo "  ✅ Secret '$SECRET' は既に設定済み"
    else
      echo "  ⚠️  Secret '$SECRET' が未設定です"
      echo "  ℹ️  値を入力してください（空の場合はスキップ）"
      read -p "  $SECRET: " secret_value </dev/tty || secret_value=""
      if [ -n "$secret_value" ]; then
        echo "$secret_value" | gh secret set "$SECRET" -o "$ORG" >/dev/null 2>&1 && \
          echo "  ✅ Secret '$SECRET' 設定完了" || \
          echo "  ⚠️  Secret '$SECRET' 設定に失敗しました"
      else
        echo "  ⏭️  Secret '$SECRET' をスキップしました"
      fi
    fi
  done
fi

# MIRROR_REPO (固定値)
if gh secret list -o $ORG 2>/dev/null | grep -q "^MIRROR_REPO"; then
  echo "  ✅ Secret 'MIRROR_REPO' は既に設定済み"
else
  echo "  📝 Secret 'MIRROR_REPO' を設定中..."
  echo "$ORG/TriHexPhi-public" | gh secret set MIRROR_REPO -o "$ORG" >/dev/null 2>&1 && \
    echo "  ✅ Secret 'MIRROR_REPO' 設定完了" || \
    echo "  ⚠️  Secret 'MIRROR_REPO' 設定に失敗しました"
fi

# =========================================================
# 5. Environments作成
# =========================================================

echo ""
echo "📋 5. Environments作成"
echo "──────────────────────────────────────────────────"

REPOS_FOR_ENV=("TriHexPhi" "7thSense-LP")

for REPO in "${REPOS_FOR_ENV[@]}"; do
  echo "  📦 Repository: $REPO"
  
  for ENV in staging production; do
    if gh api repos/$ORG/$REPO/environments/$ENV >/dev/null 2>&1; then
      echo "    ✅ Environment '$ENV' は既に存在します"
    else
      echo "    📝 Environment '$ENV' を作成中..."
      gh api repos/$ORG/$REPO/environments \
        -X PUT \
        -f name=$ENV \
        >/dev/null 2>&1 && \
        echo "    ✅ Environment '$ENV' 作成完了" || \
        echo "    ⚠️  Environment '$ENV' 作成に失敗しました"
    fi
  done
  
  # production環境のレビュアー設定
  echo "    📝 production環境のレビュアーを設定中..."
  gh api \
    -X PUT \
    -H "Accept: application/vnd.github+json" \
    repos/$ORG/$REPO/environments/production/protection_rules \
    -f "reviewers[][type]=User" \
    -f "reviewers[][id]=$OWNER_ID" \
    -f required_reviewers_count=1 \
    >/dev/null 2>&1 && \
    echo "    ✅ production環境レビュアー設定完了" || \
    echo "    ⚠️  レビュアー設定に失敗しました（既に設定済みの可能性）"
done

# =========================================================
# 6. Branch Protection設定
# =========================================================

echo ""
echo "📋 6. Branch Protection設定"
echo "──────────────────────────────────────────────────"

REPOS_FOR_PROTECTION=("TriHexPhi" "TriHexPhi-public" "7thSense-LP" "SeventhSense-Proofs")

for REPO in "${REPOS_FOR_PROTECTION[@]}"; do
  if gh repo view $ORG/$REPO >/dev/null 2>&1; then
    echo "  📦 Repository: $REPO"
    echo "    📝 Branch Protectionを設定中..."
    gh api \
      -X PUT \
      -H "Accept: application/vnd.github+json" \
      repos/$ORG/$REPO/branches/main/protection \
      -f required_status_checks.strict=true \
      -f enforce_admins=true \
      -f required_pull_request_reviews.required_approving_review_count=1 \
      -f restrictions=null \
      >/dev/null 2>&1 && \
      echo "    ✅ Branch Protection設定完了" || \
      echo "    ⚠️  Branch Protection設定に失敗しました（既に設定済みの可能性）"
  else
    echo "  ⚠️  Repository '$REPO' が存在しないため、スキップします"
  fi
done

# =========================================================
# 7. README初期化（TriHexPhi）
# =========================================================

echo ""
echo "📋 7. README初期化"
echo "──────────────────────────────────────────────────"

if gh repo view $ORG/TriHexPhi >/dev/null 2>&1; then
  echo "  📝 README.md を確認中..."
  
  # 一時ディレクトリで作業
  TEMP_DIR=$(mktemp -d)
  cd "$TEMP_DIR"
  gh repo clone $ORG/TriHexPhi 2>/dev/null || true
  
  if [ -d "TriHexPhi" ]; then
    cd TriHexPhi
    
    if [ -f "README.md" ] && grep -q "Seventh Sense Systems" README.md; then
      echo "  ✅ README.md は既に初期化済みです"
    else
      echo "  📝 README.md を初期化中..."
      cat > README.md <<MD
# Seventh Sense Systems (S3)

The enterprise core of TriHexΦ / SeventhSense / Harmonia projects.

Designed to integrate AI cognition, human insight, and ethical automation.

---

### 🔭 Public Mirror（固定入口）

- **Main**: https://github.com/$ORG/TriHexPhi-public  
- **Raw Index**: https://raw.githubusercontent.com/$ORG/TriHexPhi-public/main/index.md  

> 新しいチャットが始まったら、このRaw IndexをGPTに貼るだけで文脈が即回復します。

MD
      
      git add README.md
      git commit -m "docs: initialize Enterprise (S3) README" || echo "  ⚠️  コミットに失敗しました（変更がない可能性）"
      git push || echo "  ⚠️  プッシュに失敗しました"
      echo "  ✅ README.md 初期化完了"
    fi
  fi
  
  cd - >/dev/null
  rm -rf "$TEMP_DIR"
else
  echo "  ⚠️  Repository '$ORG/TriHexPhi' が存在しないため、スキップします"
fi

# =========================================================
# 8. 検証
# =========================================================

echo ""
echo "📊 検証結果"
echo "──────────────────────────────────────────────────"

echo ""
echo "Organization:"
gh org view $ORG 2>/dev/null | head -5 || echo "  ❌ Organization情報を取得できませんでした"

echo ""
echo "Teams:"
gh api orgs/$ORG/teams 2>/dev/null | jq -r '.[].name' | sed 's/^/  - /' || echo "  ❌ Teams情報を取得できませんでした"

echo ""
echo "Repositories:"
gh repo list $ORG -L 10 2>/dev/null | sed 's/^/  - /' || echo "  ❌ Repositories情報を取得できませんでした"

echo ""
echo "✅ セットアップ完了"

