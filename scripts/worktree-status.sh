#!/usr/bin/env bash

# TriHex Worktree Status Monitor
# Usage: ./scripts/worktree-status.sh

set -e

echo "🌳 TriHex Worktree Status"
echo ""

echo "=== Worktrees ==="
git worktree list

echo ""
echo "=== Branches ==="
git branch -vv

echo ""
echo "✅ Status complete"
