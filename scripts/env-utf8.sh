#!/usr/bin/env bash
# UTF-8 Environment Setup for TriHex
# Usage: source scripts/env-utf8.sh

set -Eeuo pipefail

export LANG=C.UTF-8
export LC_ALL=C.UTF-8
export NODE_OPTIONS="${NODE_OPTIONS:-} --max_old_space_size=4096"

echo "[env-utf8] LANG=$LANG LC_ALL=$LC_ALL"
