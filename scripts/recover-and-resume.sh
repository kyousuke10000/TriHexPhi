#!/usr/bin/env bash

# TriHex Recovery and Resume Script
# Restarts system after emergency downgrade

set -e

echo "🔄 Recovery Sequence Initiated"
echo ""

# Check API keys
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  OPENAI_API_KEY not set"
  echo "   Please set: export OPENAI_API_KEY='sk-...'"
  exit 1
fi

echo "✅ API key verified"

# Ensure log directory
mkdir -p 99_SYSTEM/Logs

# Restart watchdog
echo "Restarting Watchdog..."
node tools/trihex/watchdog.mjs > 99_SYSTEM/Logs/watchdog_restart.log 2>&1 &
WATCHDOG_PID=$!
echo "✅ Watchdog restarted (PID: $WATCHDOG_PID)"

# Wait for stabilization
echo "Waiting for system stabilization..."
sleep 5

# Verify heartbeat
if [ -f "99_SYSTEM/Logs/ai_heartbeat.log" ]; then
  HB_LINES=$(wc -l < 99_SYSTEM/Logs/ai_heartbeat.log || echo "0")
  echo "✅ Heartbeat log active (lines: $HB_LINES)"
else
  echo "⚠️  No heartbeat log yet (may need more time)"
fi

echo ""
echo "✅ Recovery complete"
echo "   System ready for manual operations"
echo ""
echo "Next step: Test with ./scripts/demo-sixAI.sh"
