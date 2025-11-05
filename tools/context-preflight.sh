#!/usr/bin/env bash
set -e

CACHE="${HOME}/.trihex/context"
RAW_BASE="https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/context"

mkdir -p "$CACHE"

curl -fsSL "$RAW_BASE/VERSION" -o "$CACHE/VERSION"
curl -fsSL "$RAW_BASE/context_pack.md" -o "$CACHE/context_pack.md"
curl -fsSL "$RAW_BASE/bootstrap.md" -o "$CACHE/bootstrap.md"

export CONTEXT_HASH="$(cat "$CACHE/VERSION" | tr -d '\n')"
export CONTEXT_BOOTSTRAP="$CACHE/bootstrap.md"

echo "[preflight] CONTEXT_HASH=$CONTEXT_HASH"

