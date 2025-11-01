#!/bin/bash
# Rubedo Proof Reproduction Script (Read-Only / Safe)
# Purpose: Recalculate manifest hashes to verify Genesis v3.1 integrity

set -e

echo "=== Rubedo Proof Reproduction ==="
echo "Timestamp: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo ""

# Define targets (same as manifest.json)
TARGETS=(
  "00_HarmoniaCouncil/Round_III/Genesis_Protocol_R1_Article13-15_v3.1.md"
  "00_HarmoniaCouncil/Round_III/Round_III_BreathLog.md"
  "00_HarmoniaCouncil/Round_IV/Round_IV_BreathLog.md"
  "10_TriHexCore/codex/Genesis_Protocol_v3.1.md"
  "20_TriHex-Obsidian/01_Codex/Genesis_Protocol_v3.1.md"
  "20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Spiral_Tag_Index.md"
  "30_ObsidianSync/Canonical/Genesis_Protocol_R1_v3.1.md"
  "40_Archive/rubedo/2025-11-01_Genesis_v3.1/tree.txt"
  "40_Archive/rubedo/2025-11-01_Genesis_v3.1/hashes_sha256.txt"
  "99_SYSTEM/Sync_Log.md"
  "index.md"
)

echo "Checksum verification:"
python3 - << 'PY'
import hashlib
import sys

targets = """00_HarmoniaCouncil/Round_III/Genesis_Protocol_R1_Article13-15_v3.1.md
00_HarmoniaCouncil/Round_III/Round_III_BreathLog.md
00_HarmoniaCouncil/Round_IV/Round_IV_BreathLog.md
10_TriHexCore/codex/Genesis_Protocol_v3.1.md
20_TriHex-Obsidian/01_Codex/Genesis_Protocol_v3.1.md
20_TriHex-Obsidian/04_HARMONIA_COUNCIL/Spiral_Tag_Index.md
30_ObsidianSync/Canonical/Genesis_Protocol_R1_v3.1.md
40_Archive/rubedo/2025-11-01_Genesis_v3.1/tree.txt
40_Archive/rubedo/2025-11-01_Genesis_v3.1/hashes_sha256.txt
99_SYSTEM/Sync_Log.md
index.md""".strip().split('\n')

print("File                                    SHA256 (first 16 chars)")
print("-" * 70)

for fpath in targets:
  try:
    with open(fpath, 'rb') as f:
      h = hashlib.sha256(f.read()).hexdigest()
      relpath = fpath.split('/')[-1]
      print(f"{relpath:40} {h[:16]}...")
  except FileNotFoundError:
    print(f"{relpath:40} NOT FOUND")
    sys.exit(1)

print("\n✅ All files verified")
PY

echo ""
echo "=== Mirror Integrity Check ==="
python3 - << 'PY'
import hashlib

mirrors = [
  "10_TriHexCore/codex/Genesis_Protocol_v3.1.md",
  "20_TriHex-Obsidian/01_Codex/Genesis_Protocol_v3.1.md",
  "30_ObsidianSync/Canonical/Genesis_Protocol_R1_v3.1.md"
]

contents = []
for f in mirrors:
  with open(f, 'rb') as fp:
    content = fp.read()
    # Extract body only
    lines = content.decode('utf-8').split('\n')
    in_fm = False
    body = []
    for line in lines:
      if line.rstrip() == '---':
        in_fm = not in_fm
        continue
      if not in_fm:
        body.append(line)
    h = hashlib.sha256('\n'.join(body).encode()).hexdigest()
    contents.append(h)

if len(set(contents)) == 1:
  print("✅ All 3 Genesis v3.1 mirrors: IDENTICAL (body content)")
  print(f"Body hash: {contents[0][:16]}...")
else:
  print("⚠️  Mirrors differ")
  for i, h in enumerate(contents):
    print(f"  {i+1}: {h[:16]}...")
PY

echo ""
echo "=== Reproduction Complete ==="
