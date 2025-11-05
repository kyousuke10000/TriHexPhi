#!/usr/bin/env bash
# Meta AI → Harmonia AI リネームスクリプト
# 安全な実行順序でリネームを実施

set -euo pipefail

echo "🔄 Meta AI → Harmonia AI リネーム開始"

# 0) 事前確認
if [ ! -d "tools/meta" ]; then
  echo "❌ tools/meta が見つかりません"
  exit 1
fi

# 1) ディレクトリ移動（git mv推奨）
echo "📁 Step 1: ディレクトリ移動"
if [ -d "tools/harmonia" ]; then
  echo "⚠️  tools/harmonia が既に存在します。スキップします。"
else
  git mv tools/meta tools/harmonia || {
    echo "⚠️  git mv に失敗。cp で対応します。"
    cp -R tools/meta tools/harmonia
    rm -rf tools/meta
  }
fi

# 2) ワークフローファイル移動
echo "📄 Step 2: ワークフローファイル移動"
if [ -f ".github/workflows/meta_ai.yml" ]; then
  git mv .github/workflows/meta_ai.yml .github/workflows/harmonia.yml || {
    echo "⚠️  git mv に失敗。cp で対応します。"
    cp .github/workflows/meta_ai.yml .github/workflows/harmonia.yml
    rm .github/workflows/meta_ai.yml
  }
fi

# 3) Proofsディレクトリ移動
echo "📁 Step 3: Proofsディレクトリ移動"
if [ -d "99_SYSTEM/Proofs/Meta" ]; then
  if [ -d "99_SYSTEM/Proofs/Harmonia" ]; then
    echo "⚠️  99_SYSTEM/Proofs/Harmonia が既に存在します。スキップします。"
  else
    git mv 99_SYSTEM/Proofs/Meta 99_SYSTEM/Proofs/Harmonia || {
      echo "⚠️  git mv に失敗。cp で対応します。"
      cp -R 99_SYSTEM/Proofs/Meta 99_SYSTEM/Proofs/Harmonia
      rm -rf 99_SYSTEM/Proofs/Meta
    }
  fi
fi

# 4) ファイル内の文字列置換
echo "🔍 Step 4: ファイル内の文字列置換"

# "Meta AI" → "Harmonia AI"
find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.mjs" -o -name "*.json" \) \
  -not -path "./.git/*" -not -path "./node_modules/*" \
  -exec sed -i '' 's/Meta AI/Harmonia AI/g' {} +

# "tools/meta" → "tools/harmonia"
find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.mjs" -o -name "*.json" \) \
  -not -path "./.git/*" -not -path "./node_modules/*" \
  -exec sed -i '' 's|tools/meta|tools/harmonia|g' {} +

# "99_SYSTEM/Proofs/Meta" → "99_SYSTEM/Proofs/Harmonia"
find . -type f \( -name "*.md" -o -name "*.yml" -o -name "*.mjs" -o -name "*.json" \) \
  -not -path "./.git/*" -not -path "./node_modules/*" \
  -exec sed -i '' 's|99_SYSTEM/Proofs/Meta|99_SYSTEM/Proofs/Harmonia|g' {} +

# "meta:" → "harmonia:" (package.jsonなど)
find . -type f \( -name "package.json" -o -name "*.yml" \) \
  -not -path "./.git/*" -not -path "./node_modules/*" \
  -exec sed -i '' 's/"meta:/"harmonia:/g' {} +
find . -type f \( -name "package.json" -o -name "*.yml" \) \
  -not -path "./.git/*" -not -path "./node_modules/*" \
  -exec sed -i '' "s/'meta:/'harmonia:/g" {} +

# "meta_ai" → "harmonia" (ワークフロー名など)
find . -type f -name "*.yml" \
  -not -path "./.git/*" -not -path "./node_modules/*" \
  -exec sed -i '' 's/meta_ai/harmonia/g' {} +

# 5) ファイル名の変更（ai-meta.mjs → ai-harmonia.mjs）
echo "📝 Step 5: ファイル名変更"
if [ -f "tools/harmonia/ai-meta.mjs" ]; then
  git mv tools/harmonia/ai-meta.mjs tools/harmonia/ai-harmonia.mjs || {
    echo "⚠️  git mv に失敗。cp で対応します。"
    cp tools/harmonia/ai-meta.mjs tools/harmonia/ai-harmonia.mjs
    rm tools/harmonia/ai-meta.mjs
  }
  # ファイル内の参照も更新
  find . -type f -name "*.mjs" -o -name "*.json" -o -name "*.yml" \
    -not -path "./.git/*" -not -path "./node_modules/*" \
    -exec sed -i '' 's|ai-meta\.mjs|ai-harmonia.mjs|g' {} +
fi

# 6) Proofファイル名の変更（META_*.md → HARMONIA_*.md）
echo "📝 Step 6: Proofファイル名変更"
if [ -d "99_SYSTEM/Proofs/Harmonia" ]; then
  cd 99_SYSTEM/Proofs/Harmonia
  for f in META_*.md META_*.json; do
    if [ -f "$f" ]; then
      newf=$(echo "$f" | sed 's/^META_/HARMONIA_/')
      git mv "$f" "$newf" 2>/dev/null || mv "$f" "$newf"
    fi
  done
  cd - > /dev/null
fi

echo "✅ リネーム完了"
echo ""
echo "📋 次のステップ:"
echo "1. git status で変更を確認"
echo "2. 動作確認（npm run harmonia:ask）"
echo "3. git add -A && git commit"

