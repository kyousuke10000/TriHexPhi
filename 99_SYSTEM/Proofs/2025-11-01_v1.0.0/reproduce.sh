#!/usr/bin/env bash
set -euo pipefail

echo "=== TriHex Memory Stack v1.0.0 Reproduction ==="
echo ""
echo "Commit:" $(git rev-parse HEAD)
echo "Date: 2025-11-01"
echo ""
echo "=== Tree Structure (first 50 files) ==="
git ls-tree --name-only -r HEAD | sed -n '1,50p'
