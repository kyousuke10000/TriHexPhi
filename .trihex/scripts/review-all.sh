#!/usr/bin/env bash
# TriHexΦ AI Review Batch Script v1.0
# 
# Usage: review-all.sh <taskpack.yaml> <context-bootstrap.txt>
#
# 各AIに統一タスクを配布し、回答を収集する（擬似実装）

TASK=$1
CTX=$2

if [ -z "$TASK" ] || [ -z "$CTX" ]; then
  echo "Usage: $0 <taskpack.yaml> <context-bootstrap.txt>"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TriHexΦ AI Review Batch"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Task: $TASK"
echo "Context: $CTX"
echo ""

mkdir -p reviews

echo "各AIに配布中..."
echo ""

# 注意: 実際のAI CLIは各自で設定が必要
# 現状は、しりゅうが手動でコピペする想定

for ai in claude gemini grok deepseek; do
  echo "[$ai] タスク生成中..."
  
  # タスクパケットとコンテキストを結合
  cat "$CTX" "$TASK" > "reviews/${ai}_input.md"
  
  echo "[$ai] reviews/${ai}_input.md 作成完了"
  echo "       → しりゅうが ${ai} にコピペしてください"
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ タスク配布準備完了"
echo ""
echo "次のステップ:"
echo "1. しりゅうが reviews/*_input.md を各AIにコピペ"
echo "2. 各AIの回答を reviews/<ai>_output.md に保存"
echo "3. GPT-5が統合レポート作成"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

