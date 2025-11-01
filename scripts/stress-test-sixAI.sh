#!/usr/bin/env bash

# TriHex Sixfold Conductor Stress Test
# Usage: ./scripts/stress-test-sixAI.sh

set -e

source "$(dirname "$0")/env-utf8.sh"

export OPENAI_API_KEY="${OPENAI_API_KEY:-CHANGEME}"

if [ "$OPENAI_API_KEY" = "CHANGEME" ]; then
  echo "⚠️  OPENAI_API_KEY not set. Please set it first."
  exit 1
fi

echo "🧪 Starting 6AI Stress Test..."
echo ""

# Create log directory
mkdir -p "99_SYSTEM/Logs"

# Start watchdog in background
node tools/trihex/watchdog.mjs > "99_SYSTEM/Logs/watchdog_stress.log" 2>&1 &
WATCHDOG_PID=$!

echo "✅ Watchdog started (PID: $WATCHDOG_PID)"
echo ""

# Start 3 parallel Conductor instances
echo "🚀 Launching 3 parallel Conductor instances..."
echo ""

node tools/conductor/run.mjs --topic "Stress A: 私命の定義" --mode=demo > "99_SYSTEM/Logs/stress_a.log" 2>&1 &
PID_A=$!

node tools/conductor/run.mjs --topic "Stress B: 呼吸OSの安全規約" --mode=demo > "99_SYSTEM/Logs/stress_b.log" 2>&1 &
PID_B=$!

node tools/conductor/run.mjs --topic "Stress C: Ryūdō採点軸の再設計" --mode=demo > "99_SYSTEM/Logs/stress_c.log" 2>&1 &
PID_C=$!

echo "✅ All instances started:"
echo "  Process A (私命): $PID_A"
echo "  Process B (安全規約): $PID_B"
echo "  Process C (採点軸): $PID_C"
echo ""

# Record start time
START_TIME=$(date +%s)

# Monitor and wait
echo "⏳ Monitoring parallel execution..."
echo ""

# Wait for all processes
wait $PID_A $PID_B $PID_C

# Record end time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Kill watchdog
kill $WATCHDOG_PID 2>/dev/null || true

echo ""
echo "✅ All processes completed"
echo "⏱️  Total duration: ${DURATION}s"
echo ""

# Check logs
echo "📊 Checking logs..."
echo ""

if [ -f "99_SYSTEM/Logs/ai_heartbeat.log" ]; then
  HB_LINES=$(wc -l < "99_SYSTEM/Logs/ai_heartbeat.log")
  echo "✅ Heartbeat log: $HB_LINES lines"
  
  # Check for restart records
  RESTARTS=$(grep -c "Restart" "99_SYSTEM/Logs/ai_heartbeat.log" || echo "0")
  echo "  Restarts: $RESTARTS"
fi

if [ -f "99_SYSTEM/Logs/ai_errors.log" ]; then
  ERR_LINES=$(wc -l < "99_SYSTEM/Logs/ai_errors.log")
  echo "⚠️  Error log: $ERR_LINES lines"
fi

# Check for file conflicts
echo ""
echo "📁 Checking output files..."
ls -lh "20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Ryudo_Sessions/"*.md 2>/dev/null | tail -5

echo ""
echo "🎊 Stress test complete!"


