#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "Philosophia_Prima Setup - Reproduction Script"
echo "=========================================="

echo ""
echo "📊 Commit Information:"
git rev-parse HEAD

echo ""
echo "📁 Repository Structure:"
git ls-tree --name-only -r HEAD | grep -E "(Philosophia_Prima|system/INDEX|system/Open)" | head -20

echo ""
echo "🔐 SHA256 Checksums:"
echo "appendix_gum_model.md:"
shasum -a 256 20_TriHex-Obsidian/Philosophia_Prima/appendix_gum_model.md

echo ""
echo "appendix_alchemy_18_19.md:"
shasum -a 256 20_TriHex-Obsidian/Philosophia_Prima/appendix_alchemy_18_19.md

echo ""
echo "index.md:"
shasum -a 256 20_TriHex-Obsidian/Philosophia_Prima/index.md

echo ""
echo "system/INDEX.md:"
shasum -a 256 10_TriHexCore/system/INDEX.md

echo ""
echo "system/Open_Topics.md:"
shasum -a 256 10_TriHexCore/system/Open_Topics.md

echo ""
echo "manifest.json:"
shasum -a 256 99_SYSTEM/Proofs/Philosophia_Prima_Setup/manifest.json

echo ""
echo "=========================================="
echo "✅ Reproduction Complete"
echo "=========================================="



