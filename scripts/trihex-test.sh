#!/usr/bin/env bash

# TriHex CLI Test Script
# Usage: ./scripts/trihex-test.sh

source "$(dirname "$0")/env-utf8.sh"

export OPENAI_API_KEY="${OPENAI_API_KEY:-CHANGEME}"

echo "[TriHex] Testing CLI..."

if [ "$OPENAI_API_KEY" = "CHANGEME" ]; then
  echo "⚠️  OPENAI_API_KEY not set. Please set it first."
  exit 1
fi

node tools/trihex/trihex.mjs --exec "Memory Reactivation Protocol を読んで TriHex の文脈を再起動して"

echo ""


