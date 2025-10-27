#!/usr/bin/env node
/**
 * TriHexΦ MIZUKAGAMI Saver v1.0
 * 
 * GitHub Actions から実行され、
 * 最新の決定書・仕様書をMIZUKAGAMIに保存する
 */

const fs = require('fs');
const path = require('path');

const MIZUKAGAMI_DIR = '10_CAPTURE_MIZUKAGAMI/Logs';
const DECISIONS_DIR = '20_CRYSTALLIZATION_KOKUYOU/Decisions';
const SPECS_DIR = '20_CRYSTALLIZATION_KOKUYOU/Specs';

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

function saveToMizukagami() {
  const timestamp = getTimestamp();
  const logFile = path.join(MIZUKAGAMI_DIR, `${timestamp}_from_Actions.md`);
  
  let content = '# MIZUKAGAMI 自動保存ログ\n\n';
  content += `**日時**: ${new Date().toISOString()}\n`;
  content += `**実行**: GitHub Actions\n\n`;
  content += '---\n\n';
  
  // 最新の決定書を取得
  if (fs.existsSync(DECISIONS_DIR)) {
    const decisions = fs.readdirSync(DECISIONS_DIR)
      .filter(f => f.startsWith('DEC_'))
      .sort()
      .reverse()
      .slice(0, 5);
    
    content += '## 最新の決定書\n\n';
    decisions.forEach(file => {
      content += `- ${file}\n`;
    });
    content += '\n';
  }
  
  // 最新の仕様書を取得
  if (fs.existsSync(SPECS_DIR)) {
    const specs = fs.readdirSync(SPECS_DIR)
      .filter(f => f.startsWith('SPEC_'))
      .sort()
      .reverse()
      .slice(0, 5);
    
    content += '## 最新の仕様書\n\n';
    specs.forEach(file => {
      content += `- ${file}\n`;
    });
    content += '\n';
  }
  
  // 保存
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.writeFileSync(logFile, content, 'utf8');
  
  console.log(`✅ MIZUKAGAMIに保存しました: ${logFile}`);
}

// 実行
try {
  saveToMizukagami();
  process.exit(0);
} catch (error) {
  console.error('❌ エラー:', error.message);
  process.exit(1);
}

