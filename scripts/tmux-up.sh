#!/usr/bin/env bash

# TriHex Parallel Shell Launcher
# Usage: ./scripts/tmux-up.sh

set -e

echo "🎭 Starting TriHex Parallel Shell..."

# Start tmux server
tmux start-server

# Kill existing session if exists
tmux kill-session -t trihex 2>/dev/null || echo "No existing trihex session"

# Load configuration
tmux source-file tools/tmux/trihex.tmux

echo "✅ TriHex tmux session ready"
echo "🔗 Attach with: tmux a -t trihex"
