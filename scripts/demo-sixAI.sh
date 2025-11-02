#!/usr/bin/env bash

# TriHex Sixfold Conductor Demo Script
# Usage: ./scripts/demo-sixAI.sh

set -e

source "$(dirname "$0")/env-utf8.sh"

export OPENAI_API_KEY="${OPENAI_API_KEY:-CHANGEME}"

if [ "$OPENAI_API_KEY" = "CHANGEME" ]; then
  echo "⚠️  OPENAI_API_KEY not set. Please set it first."
  exit 1
fi

echo "🎼 Starting Sixfold Conductor Demo..."
echo ""

# Run conductor in demo mode
node tools/conductor/run.mjs \
  --topic "TriHexデモ：私命の定義を9.9点に磨く" \
  --mode=demo

# Find the generated file
LATEST_ROUND=$(ls -t 20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/Round_*.md 2>/dev/null | head -1)

if [ -n "$LATEST_ROUND" ]; then
  echo ""
  echo "✅ Demo Complete!"
  echo ""
  echo "📄 Output: $LATEST_ROUND"
  echo ""
  echo "💡 Open with:"
  echo "   cat $LATEST_ROUND | less"
  echo "   open $LATEST_ROUND"
else
  echo "⚠️  No Round file generated"
fi


