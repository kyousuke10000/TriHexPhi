#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const runId = process.env.RUN_ID;
if (!runId) {
  console.error('RUN_ID missing');
  process.exit(1);
}

const logsDir = path.join(process.cwd(), '.logs');
fs.mkdirSync(logsDir, { recursive: true });

try {
  const out = execSync(`gh run view ${runId} --log`, { encoding: 'utf8' });
  fs.writeFileSync(path.join(logsDir, 'last.log'), out, 'utf8');
  console.log('Saved .logs/last.log');
} catch (e) {
  console.error('gh run view failed', e?.message || e);
  process.exit(1);
}

