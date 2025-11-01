#!/usr/bin/env bash

# Quick Conductor Test (Single Agent)
# Usage: ./scripts/test-conductor-quick.sh

set -e

source "$(dirname "$0")/env-utf8.sh"

export OPENAI_API_KEY="${OPENAI_API_KEY:-CHANGEME}"

if [ "$OPENAI_API_KEY" = "CHANGEME" ]; then
  echo "⚠️  OPENAI_API_KEY not set. Please set it first."
  exit 1
fi

echo "🧪 Quick Conductor Test (Single Agent)"
echo ""

# Test 1: Verify Conductor starts
echo "Test 1: Starting Conductor..."
timeout 30 node tools/conductor/run.mjs --topic "Quick Test Single Agent" --mode=demo 2>&1 | tee 99_SYSTEM/Logs/quick_test.log &

CONDUCTOR_PID=$!
echo "Conductor PID: $CONDUCTOR_PID"

# Wait a bit
sleep 5

# Check if still running
if ps -p $CONDUCTOR_PID > /dev/null; then
  echo "✅ Conductor running (PID: $CONDUCTOR_PID)"
else
  echo "⚠️  Conductor exited early"
fi

# Wait for completion
wait $CONDUCTOR_PID 2>/dev/null || echo "Process completed or timed out"

echo ""
echo "📊 Checking output..."
if [ -f "99_SYSTEM/Logs/quick_test.log" ]; then
  echo "Log file created"
  tail -20 99_SYSTEM/Logs/quick_test.log
fi

echo ""
echo "✅ Quick test complete"

