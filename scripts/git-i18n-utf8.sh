#!/usr/bin/env bash

# Git UTF-8 i18n Configuration
# Usage: ./scripts/git-i18n-utf8.sh

set -Eeuo pipefail

git config i18n.commitEncoding utf-8
git config i18n.logOutputEncoding utf-8
git config core.quotepath false

echo "[git-i18n] commitEncoding/logOutputEncoding=UTF-8, quotepath=false"
