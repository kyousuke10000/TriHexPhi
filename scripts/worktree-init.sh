#!/usr/bin/env bash

# TriHex Worktree Multi-Universe Setup
# Usage: ./scripts/worktree-init.sh

set -e

echo "🌳 Initializing TriHex Worktrees..."

# Check if main branch exists
if ! git rev-parse --verify main >/dev/null 2>&1; then
  echo "⚠️  main branch not found, creating..."
  git branch main
fi

# Create branch for core if not exists
git fetch --all 2>/dev/null || true

# Add worktrees (only if they don't exist)
if ! git worktree list | grep -q "TriHex.core"; then
  git worktree add ../TriHex.core main || echo "Core worktree already exists"
fi

if ! git worktree list | grep -q "TriHex.obsidian"; then
  git worktree add ../TriHex.obsidian main || echo "Obsidian worktree already exists"
fi

# List worktrees
echo ""
echo "📁 Worktrees:"
git worktree list

echo ""
echo "✅ Worktrees initialized"
