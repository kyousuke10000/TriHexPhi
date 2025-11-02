#!/usr/bin/env bash

# TriHex Watchdog Test Script
# Usage: ./scripts/watchdog-test.sh

echo "[TriHex] Testing Watchdog System..."
echo ""

# Check if watchdog exists
if [ ! -f "tools/trihex/watchdog.mjs" ]; then
  echo "❌ Watchdog not found"
  exit 1
fi

# Create log directory
mkdir -p "99_SYSTEM/Logs"

# Test 1: Basic heartbeat log
echo "Test 1: Basic heartbeat logging"
node tools/trihex/watchdog.mjs &
WATCHDOG_PID=$!
sleep 5
kill $WATCHDOG_PID 2>/dev/null

# Check log files
if [ -f "99_SYSTEM/Logs/ai_heartbeat.log" ]; then
  echo "✅ Heartbeat log created"
  echo "---"
  head -5 "99_SYSTEM/Logs/ai_heartbeat.log"
  echo "---"
else
  echo "❌ Heartbeat log not created"
fi

# Test 2: Emergency downgrade
echo ""
echo "Test 2: Emergency downgrade"
node tools/trihex/watchdog.mjs :emergency-downgrade &
sleep 2

# Check error log
if [ -f "99_SYSTEM/Logs/ai_errors.log" ]; then
  echo "✅ Error log created"
  echo "---"
  cat "99_SYSTEM/Logs/ai_errors.log"
  echo "---"
else
  echo "⚠️  Error log not created (may be normal)"
fi

echo ""
echo "[TriHex] Watchdog test complete"


