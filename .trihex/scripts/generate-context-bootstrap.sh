#!/usr/bin/env bash
# TriHexΦ Context Bootstrap Generator v1.0
# 
# Bootstrap Memory: 起動時に全AIが参照すべき文脈を自動生成

OUTPUT=".trihex/context-bootstrap.txt"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" > "$OUTPUT"
echo "TriHexΦ Context Bootstrap v1.0" >> "$OUTPUT"
echo "生成日時: $(date '+%Y-%m-%d %H:%M:%S')" >> "$OUTPUT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# TRIHEXPHI.md（将来作成予定）
if [ -f "00_CORE/TRIHEXPHI.md" ]; then
  echo "## TRIHEXPHI.md" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
  cat "00_CORE/TRIHEXPHI.md" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
else
  echo "## TRIHEXPHI.md（未作成）" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
fi

# 続きから始める.md
if [ -f "10_CAPTURE_MIZUKAGAMI/続きから始める.md" ]; then
  echo "## 続きから始める.md" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
  cat "10_CAPTURE_MIZUKAGAMI/続きから始める.md" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
fi

# 最新の決定書（ヘッダのみ、先頭200行）
echo "## 最新の決定書（ヘッダ）" >> "$OUTPUT"
echo "" >> "$OUTPUT"

if [ -d "20_CRYSTALLIZATION_KOKUYOU/Decisions" ]; then
  for file in $(ls -t 20_CRYSTALLIZATION_KOKUYOU/Decisions/DEC_*.md 2>/dev/null | head -3); do
    echo "### $(basename $file)" >> "$OUTPUT"
    head -n 50 "$file" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  done
fi

# 最新の仕様書（ヘッダのみ）
echo "## 最新の仕様書（ヘッダ）" >> "$OUTPUT"
echo "" >> "$OUTPUT"

if [ -d "20_CRYSTALLIZATION_KOKUYOU/Specs" ]; then
  for file in $(ls -t 20_CRYSTALLIZATION_KOKUYOU/Specs/SPEC_*.md 2>/dev/null | head -3); do
    echo "### $(basename $file)" >> "$OUTPUT"
    head -n 50 "$file" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  done
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT"
echo "✅ Context Bootstrap 生成完了" >> "$OUTPUT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$OUTPUT"

echo "✅ Context Bootstrap を生成しました: $OUTPUT"
wc -l "$OUTPUT"

