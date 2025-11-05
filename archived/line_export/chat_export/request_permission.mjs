#!/usr/bin/env node

/**
 * Request macOS Accessibility Permission
 * Purpose: Automatically request accessibility permission
 */

import { execSync } from 'node:child_process';

console.log('🔐 Requesting Accessibility Permission...\n');

try {
  // Try to open System Settings to Accessibility
  execSync(`
    osascript -e '
      tell application "System Settings"
        activate
        delay 0.5
      end tell
      tell application "System Events"
        keystroke "accessibility" using {command down, option down, space down}
        delay 1
      end tell
    '
  `, { stdio: 'inherit' });
  
  console.log('✅ System Settings opened to Accessibility');
  console.log('\n📋 Please:');
  console.log('1. Find Terminal (or iTerm) in the list');
  console.log('2. Toggle it ON');
  console.log('3. Press Enter here to continue...\n');
  
  // Wait for Enter
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', () => {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    console.log('\n✅ Permission granted! Retrying automation...\n');
    execSync('node scripts/chat_export/main_run.mjs', { stdio: 'inherit' });
  });
  
} catch (error) {
  console.error('⚠️ Could not open System Settings automatically');
  console.error('\n📋 Manual steps:');
  console.error('1. Open System Settings');
  console.error('2. Go to Privacy & Security → Accessibility');
  console.error('3. Enable Terminal (or iTerm)');
  console.error('4. Run: node scripts/chat_export/main_run.mjs');
}

