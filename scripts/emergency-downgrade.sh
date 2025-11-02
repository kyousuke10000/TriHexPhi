#!/usr/bin/env bash

# TriHex Emergency Downgrade Script
# Kills all AI processes and enters safe mode

set -e

echo "🚨 Emergency Downgrade Initiated"
echo ""

# Kill all processes
echo "Stopping AI processes..."
killall -9 -f "trihex.mjs" 2>/dev/null || true
killall -9 -f "conductor/run.mjs" 2>/dev/null || true
killall -9 -f "watchdog.mjs" 2>/dev/null || true

# Clean temp files
echo "Cleaning temp files..."
rm -f /tmp/trihex_* 2>/dev/null || true

# Create emergency log
mkdir -p 99_SYSTEM/Logs
echo "$(date): Emergency downgrade executed" >> 99_SYSTEM/Logs/emergency.log

# Report state
echo ""
echo "✅ System in safe mode"
echo "   - All AI processes killed"
echo "   - Temp files cleaned"
echo "   - Logs preserved in 99_SYSTEM/Logs/"
echo ""
echo "Next step: ./scripts/recover-and-resume.sh"
