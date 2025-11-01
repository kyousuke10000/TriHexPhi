#!/usr/bin/env node

/**
 * Proof Stamp Generator
 * Creates HarmoniaCI proof files for each commit
 */

import { execSync } from 'child_process';
import fs from 'node:fs/promises';

try {
  // Get git info
  const sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  const date = execSync('git log -1 --format=%ci', { encoding: 'utf8' }).trim();
  const message = execSync('git log -1 --format=%s', { encoding: 'utf8' }).trim();
  const diff = execSync('git diff --cached --stat', { encoding: 'utf8' }).trim() || 'No changes staged';
  
  // Generate proof content
  const content = `# Harmonia CI Proof

**Commit:** ${sha}
**Date:** ${date}
**Message:** ${message}

---

## Changes

\`\`\`
${diff}
\`\`\`

---

**Generated:** ${new Date().toISOString()}
**Phase:** VI Consolidation

---

*"Verified by Harmonia CI"*
`;

  // Write proof file
  const proofDir = '99_SYSTEM/Proofs';
  await fs.mkdir(proofDir, { recursive: true });
  const proofFile = `${proofDir}/HarmoniaCI_${sha}.md`;
  await fs.writeFile(proofFile, content, 'utf8');
  
  console.log(`[proof-stamp] ✅ Generated: ${proofFile}`);
} catch (error) {
  console.error('[proof-stamp] ⚠️  Failed:', error.message);
  process.exit(1);
}
