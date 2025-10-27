#!/bin/bash
# TriHexΦ AI一括レビュースクリプト
# 
# 目的: CLI版AI（Gemini, DeepSeek, Grok）に並列でレビューを依頼
# 使い方: ./scripts/review-all.sh [コードファイル]
# 
# Created: 2025-10-26
# Author: Cursor（螺律 / Engineer / 守護者）
# Based on: DeepSeek, Grok, GPT-5の提案

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔱 TriHexΦ AI一括レビュー開始"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 設定
CODE_FILE="${1:-scripts/memory-injector.ts}"
CONTEXT_FILE="context-bootstrap.txt"
OUTPUT_DIR="reviews"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 出力ディレクトリ作成
mkdir -p "$OUTPUT_DIR"

# Step 1: Bootstrap文脈生成
echo "📝 Step 1: Bootstrap文脈生成中..."
echo "   対象コード: $CODE_FILE"
echo ""

if [ ! -f "$CODE_FILE" ]; then
  echo "⚠️  警告: コードファイルが見つかりません: $CODE_FILE"
  echo "   文脈のみを生成します（コードなし）"
  npx tsx scripts/memory-injector.bootstrap.ts "all" "code-review"
else
  npx tsx scripts/memory-injector.bootstrap.ts "all" "code-review" "$CODE_FILE"
fi

echo ""

# Step 2: 各CLI版AIに並列レビュー依頼
echo "🧠 Step 2: 全CLI版AIレビュー依頼中..."
echo ""

# レビュー用プロンプト
REVIEW_PROMPT="以下の文脈とコードをレビューしてください。

優先確認事項:
1. 実装の正確性（仕様との一致）
2. パフォーマンス（速度、メモリ効率）
3. コスト効率（API呼び出し最小化）
4. 拡張性（v0.2, v2.0への進化可能性）
5. 安全性（エラーハンドリング）

簡潔でOK、具体的なコード改善案を提示してください。
v0.1で必須のものと、v0.2以降に回せるものを区別してください。"

# Gemini CLIレビュー
if command -v gemini &> /dev/null; then
  echo "   🟢 Gemini CLI: レビュー中..."
  (cat "$CONTEXT_FILE" | gemini "$REVIEW_PROMPT" > "$OUTPUT_DIR/gemini-review-${TIMESTAMP}.md" 2>&1 && \
   echo "   ✅ Gemini: 完了") &
else
  echo "   ⚠️  Gemini CLI: 未インストール（スキップ）"
fi

# DeepSeek CLIレビュー
if command -v deepseek &> /dev/null; then
  echo "   🔵 DeepSeek CLI: レビュー中..."
  (cat "$CONTEXT_FILE" | deepseek "$REVIEW_PROMPT" > "$OUTPUT_DIR/deepseek-review-${TIMESTAMP}.md" 2>&1 && \
   echo "   ✅ DeepSeek: 完了") &
else
  echo "   ⚠️  DeepSeek CLI: 未インストール（スキップ）"
fi

# Grok CLIレビュー
if command -v grok &> /dev/null; then
  echo "   🟠 Grok CLI: レビュー中..."
  (cat "$CONTEXT_FILE" | grok "$REVIEW_PROMPT" > "$OUTPUT_DIR/grok-review-${TIMESTAMP}.md" 2>&1 && \
   echo "   ✅ Grok: 完了") &
else
  echo "   ⚠️  Grok CLI: 未インストール（スキップ）"
fi

# 並列実行待機
echo ""
echo "⏳ 全AIレビュー実行中（並列）..."
wait

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 全AIレビュー完了！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: 結果サマリー
echo "📊 レビュー結果サマリー:"
echo ""

for file in "$OUTPUT_DIR"/*-review-${TIMESTAMP}.md; do
  if [ -f "$file" ]; then
    ai_name=$(basename "$file" | sed "s/-review-${TIMESTAMP}.md//")
    line_count=$(wc -l < "$file" 2>/dev/null || echo "0")
    file_size=$(wc -c < "$file" 2>/dev/null || echo "0")
    
    echo "   📄 $ai_name:"
    echo "      - 行数: ${line_count}行"
    echo "      - サイズ: ${file_size}バイト"
    echo "      - ファイル: $file"
    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 次のステップ:"
echo "   1. reviews/ フォルダのレビュー結果を確認"
echo "   2. Cursorが全提案を統合"
echo "   3. memory-injector.ts v0.1完全版を実装"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔱💎✨ TriHexΦ - AI自律協働の第一歩！ ✨💎🔱"

