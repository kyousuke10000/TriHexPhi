#!/bin/bash
# Bootstrap動作テストスクリプト

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔱 Bootstrap v0.0.1 動作テスト"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd "/Users/shiryu/【Shii】/Active/TriHexΦ"

# テスト1: 基本実行
echo "📝 テスト1: 基本実行（コードなし）"
npx tsx scripts/memory-injector.bootstrap.ts all code-review

echo ""
echo "✅ テスト1完了"
echo ""

# テスト2: コード付き実行
echo "📝 テスト2: コード付き実行"
npx tsx scripts/memory-injector.bootstrap.ts all implementation scripts/memory-injector.bootstrap.ts

echo ""
echo "✅ テスト2完了"
echo ""

# 結果確認
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 生成結果:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "context-bootstrap.txt" ]; then
  echo "✅ context-bootstrap.txt 生成成功"
  echo "   サイズ: $(wc -c < context-bootstrap.txt) バイト"
  echo "   行数: $(wc -l < context-bootstrap.txt) 行"
else
  echo "❌ context-bootstrap.txt が見つかりません"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 全テスト完了！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"



