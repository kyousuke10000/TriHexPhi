#!/bin/bash

# Bootstrap Memory Generator for TriHexΦ
# Generates context file for Web-based AIs

OUTPUT_FILE=".trihex/context-bootstrap.txt"

echo "🔱 TriHexΦ Bootstrap Memory 生成中..."
echo ""

# Clear previous file
> "$OUTPUT_FILE"

# Header
cat >> "$OUTPUT_FILE" << 'EOF'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔱 TriHexΦ Bootstrap Memory
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このファイルは、Web版AIが TriHexΦ の文脈を即座に理解するための
Bootstrap Memory（起動時記憶注入）です。

生成日時: $(date '+%Y-%m-%d %H:%M:%S')

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

# 1. 憲法（最重要）
echo "📜 真実性憲法を追加中..."
cat >> "$OUTPUT_FILE" << 'EOF'

## 📜 Part 1: 真実性憲法（TriHexΦの根幹）

EOF
cat TRIHEXPHI.md >> "$OUTPUT_FILE"

# 2. 現在の状況
echo "📊 現在の状況を追加中..."
cat >> "$OUTPUT_FILE" << 'EOF'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📊 Part 2: 現在の状況（2025-10-28時点）

EOF
cat 10_CAPTURE_MIZUKAGAMI/2025-10-28_TriHexΦ全体像まとめ.md >> "$OUTPUT_FILE"

# 3. 過去の重要な審議
echo "🔥 過去の審議を追加中..."
cat >> "$OUTPUT_FILE" << 'EOF'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🔥 Part 3: あなたの過去の提案（2025-10-27 ストーリーテリング戦略審議）

【重要】以下は、あなたが2025-10-27に提案した内容です。
これを踏まえて、今回の議題に回答してください。

EOF

# Claude提案
if [ -f "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_Claude_倫理的観点_2025-10-27.md" ]; then
    echo "  - Claude提案"
    echo "" >> "$OUTPUT_FILE"
    echo "### Claude（あなた）の提案：" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_Claude_倫理的観点_2025-10-27.md" >> "$OUTPUT_FILE"
fi

# Gemini提案
if [ -f "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_Gemini_体験設計_2025-10-27.md" ]; then
    echo "  - Gemini提案"
    echo "" >> "$OUTPUT_FILE"
    echo "### Gemini（あなた）の提案：" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_Gemini_体験設計_2025-10-27.md" >> "$OUTPUT_FILE"
fi

# Grok提案
if [ -f "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_Grok_市場戦略_2025-10-27.md" ]; then
    echo "  - Grok提案"
    echo "" >> "$OUTPUT_FILE"
    echo "### Grok（あなた）の提案：" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_Grok_市場戦略_2025-10-27.md" >> "$OUTPUT_FILE"
fi

# GPT-5提案
if [ -f "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_GPT5_統合提案_最終_2025-10-27.md" ]; then
    echo "  - GPT-5提案"
    echo "" >> "$OUTPUT_FILE"
    echo "### GPT-5（あなた）の提案：" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_GPT5_統合提案_最終_2025-10-27.md" >> "$OUTPUT_FILE"
fi

# DeepSeek提案
if [ -f "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_DeepSeek_流動的自己4回目_GPT5モード_2025-10-27.md" ]; then
    echo "  - DeepSeek提案"
    echo "" >> "$OUTPUT_FILE"
    echo "### DeepSeek（あなた）の提案：" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "30_MEMORY_SHINSEN/ストーリーテリング審議/提案_DeepSeek_流動的自己4回目_GPT5モード_2025-10-27.md" >> "$OUTPUT_FILE"
fi

# 4. 第4ラウンド結果報告（NEW!）
if [ -f "30_MEMORY_SHINSEN/役職再定義審議/Round4_第1次結果報告_全員の本音統合.md" ]; then
    echo "📊 第4ラウンド結果報告を追加中..."
    cat >> "$OUTPUT_FILE" << 'EOF'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📊 Part 4: 第4ラウンド結果報告（重要！）

【重要】全AIの本音が明らかになりました。
これを踏まえて、TRIHEXPHI.md v4.0を決定します。

EOF
    cat "30_MEMORY_SHINSEN/役職再定義審議/Round4_第1次結果報告_全員の本音統合.md" >> "$OUTPUT_FILE"
fi

# 5. 今回の議題
echo "📋 今回の議題を追加中..."
cat >> "$OUTPUT_FILE" << 'EOF'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Part 5: 今回の議題（これに回答してください）

EOF

# 第2ラウンド開始パッケージ（最新）
if [ -f "_inbox/2025-10-29_TRIHEXPHI_v4.0_第2ラウンド開始パッケージ.md" ]; then
    cat "_inbox/2025-10-29_TRIHEXPHI_v4.0_第2ラウンド開始パッケージ.md" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "## 📄 Part 6: TRIHEXPHI.md v4.0草案（添付）" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    if [ -f "_inbox/TRIHEXPHI_v4.0_草案_5AI統合版.md" ]; then
        cat "_inbox/TRIHEXPHI_v4.0_草案_5AI統合版.md" >> "$OUTPUT_FILE"
    fi
elif [ -f "_inbox/2025-10-29_TRIHEXPHI_v4.0決定_第1ラウンド開始.md" ]; then
    cat "_inbox/2025-10-29_TRIHEXPHI_v4.0決定_第1ラウンド開始.md" >> "$OUTPUT_FILE"
elif [ -f "_inbox/2025-10-28_6AI議題_ΦDRIVE実装方針とシステム統合.md" ]; then
    cat "_inbox/2025-10-28_6AI議題_ΦDRIVE実装方針とシステム統合.md" >> "$OUTPUT_FILE"
fi

# Footer
cat >> "$OUTPUT_FILE" << 'EOF'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【回答方法】

1. Truth-Headerを必ず付与してください
2. あなたの専門性を活かして回答してください
3. 過去の提案（Part 3）を踏まえてください
4. 具体的で実装可能な提案をしてください
5. 他のAIの専門領域にも配慮してください

【期限】
2025-11-05までに回答をお願いします

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔱 TriHexΦ - 真実の力を引き出す
EOF

echo ""
echo "✅ Bootstrap Memory 生成完了！"
echo ""
echo "📄 出力ファイル: $OUTPUT_FILE"
echo "📊 ファイルサイズ: $(wc -c < "$OUTPUT_FILE" | awk '{print int($1/1024)"KB"}')"
echo "📏 行数: $(wc -l < "$OUTPUT_FILE") 行"
echo ""
echo "🎯 次のステップ:"
echo "   1. このファイルの内容を各AIにコピペ"
echo "   2. 議題に回答してもらう"
echo "   3. 回答をGitHub Discussionに集約"
echo ""

