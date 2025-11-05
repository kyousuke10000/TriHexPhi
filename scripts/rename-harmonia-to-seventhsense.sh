#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Harmonia AI → SeventhSense リネーム開始"

# 1. ディレクトリ移動: tools/harmonia → tools/meta
echo "📁 Step 1: ディレクトリ移動 tools/harmonia → tools/meta"
if [ -d "tools/harmonia" ]; then
  git mv tools/harmonia tools/meta || { echo "tools/harmonia の移動に失敗しました。"; exit 1; }
  echo "✅ tools/harmonia → tools/meta"
else
  echo "⚠️ tools/harmonia が見つかりません。既に移動済みか、パスが異なります。"
fi

# 2. ファイル名変更: ai-harmonia.mjs → ai-seventhsense.mjs
echo "📝 Step 2: ファイル名変更"
if [ -f "tools/meta/ai-harmonia.mjs" ]; then
  git mv tools/meta/ai-harmonia.mjs tools/meta/ai-seventhsense.mjs || { echo "ai-harmonia.mjs のリネームに失敗しました。"; exit 1; }
  echo "✅ ai-harmonia.mjs → ai-seventhsense.mjs"
else
  echo "⚠️ tools/meta/ai-harmonia.mjs が見つかりません。"
fi

# 3. ワークフローファイル移動: harmonia.yml → seventhsense.yml
echo "📄 Step 3: ワークフローファイル移動"
if [ -f ".github/workflows/harmonia.yml" ]; then
  git mv .github/workflows/harmonia.yml .github/workflows/seventhsense.yml || { echo ".github/workflows/harmonia.yml の移動に失敗しました。"; exit 1; }
  echo "✅ harmonia.yml → seventhsense.yml"
else
  echo "⚠️ .github/workflows/harmonia.yml が見つかりません。"
fi

# 4. Proofsディレクトリ移動: Harmonia → SeventhSense
echo "📁 Step 4: Proofsディレクトリ移動"
if [ -d "99_SYSTEM/Proofs/Harmonia" ]; then
  git mv 99_SYSTEM/Proofs/Harmonia 99_SYSTEM/Proofs/SeventhSense || { echo "99_SYSTEM/Proofs/Harmonia の移動に失敗しました。"; exit 1; }
  echo "✅ Proofs/Harmonia → Proofs/SeventhSense"
else
  echo "⚠️ 99_SYSTEM/Proofs/Harmonia が見つかりません。"
fi

# 5. ファイル内の文字列置換
echo "🔍 Step 5: ファイル内の文字列置換"
FILES_TO_UPDATE=(
  .github/workflows/seventhsense.yml
  .github/workflows/mirror_gate_dispatch.yml
  .github/workflows/truth_guard.yml
  package.json
  scripts/generate-public-index.mjs
  tools/meta/ai-seventhsense.mjs
  tools/meta/policies/fusion.mjs
  tools/meta/adapters/*.mjs
  99_SYSTEM/Proofs/SeventhSense/*.md
  99_SYSTEM/Proofs/SeventhSense/*.json
)

# sedコマンドで文字列置換 (macOSとLinuxの互換性考慮)
for f in "${FILES_TO_UPDATE[@]}"; do
  if [ -f "$f" ] || [ -d "$f" ]; then
    # ディレクトリの場合は中身を処理
    if [ -d "$f" ]; then
      find "$f" -type f -name "*.md" -o -name "*.json" -o -name "*.mjs" -o -name "*.yml" | while read -r file; do
        echo "  - Updating content in $file"
        sed -i '' 's/Harmonia AI/SeventhSense/g' "$file" || true
        sed -i '' 's/HarmoniaAI/SeventhSense/g' "$file" || true
        sed -i '' 's/harmonia_ai/seventhsense/g' "$file" || true
        sed -i '' 's/harmonia:ask/seventh:ask/g' "$file" || true
        sed -i '' 's/tools\/harmonia/tools\/meta/g' "$file" || true
        sed -i '' 's/ai-harmonia/ai-seventhsense/g' "$file" || true
        sed -i '' 's/Proofs\/Harmonia/Proofs\/SeventhSense/g' "$file" || true
        sed -i '' 's/HARMONIA_/SEVENTHSENSE_/g' "$file" || true
      done
    else
      echo "  - Updating content in $f"
      sed -i '' 's/Harmonia AI/SeventhSense/g' "$f" || true
      sed -i '' 's/HarmoniaAI/SeventhSense/g' "$f" || true
      sed -i '' 's/harmonia_ai/seventhsense/g' "$f" || true
      sed -i '' 's/harmonia:ask/seventh:ask/g' "$f" || true
      sed -i '' 's/tools\/harmonia/tools\/meta/g' "$f" || true
      sed -i '' 's/ai-harmonia/ai-seventhsense/g' "$f" || true
      sed -i '' 's/Proofs\/Harmonia/Proofs\/SeventhSense/g' "$f" || true
      sed -i '' 's/HARMONIA_/SEVENTHSENSE_/g' "$f" || true
    fi
  fi
done

# 6. Proofファイル名変更 (HARMONIA_* → SEVENTHSENSE_*)
echo "📝 Step 6: Proofファイル名変更"
if [ -d "99_SYSTEM/Proofs/SeventhSense" ]; then
  for f in 99_SYSTEM/Proofs/SeventhSense/HARMONIA_*.{json,md}; do
    if [ -f "$f" ]; then
      new_name=$(echo "$f" | sed 's/HARMONIA_/SEVENTHSENSE_/')
      git mv "$f" "$new_name" || { echo "$f のリネームに失敗しました。"; }
    fi
  done
fi

# 7. package.json のスクリプト名変更
echo "📦 Step 7: package.json スクリプト名変更"
if [ -f "package.json" ]; then
  sed -i '' 's/"harmonia:ask"/"seventh:ask"/g' package.json || true
  sed -i '' 's|tools/harmonia/ai-harmonia.mjs|tools/meta/ai-seventhsense.mjs|g' package.json || true
  echo "✅ package.json 更新完了"
fi

echo "✅ リネーム完了"

echo "📋 次のステップ:"
echo "1. git status で変更を確認"
echo "2. 動作確認（npm run seventh:ask）"
echo "3. git add -A && git commit"

