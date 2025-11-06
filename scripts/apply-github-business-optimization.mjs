#!/usr/bin/env node
/**
 * GitHub Business 最適化 自動適用スクリプト
 * 
 * 承認済みの5項目を自動適用：
 * 1. Organization Secrets移行（確認のみ、手動設定が必要）
 * 2. Environments作成
 * 3. Branch Protection設定
 * 4. ワークフロー環境設定
 * 5. README更新
 */

import { execSync } from 'child_process';
import fs from 'fs';

function sh(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
  } catch (e) {
    return null;
  }
}

function getRepoInfo() {
  try {
    const repo = JSON.parse(sh('gh repo view --json owner,name'));
    return {
      org: repo.owner.login,
      repo: repo.name,
      fullName: `${repo.owner.login}/${repo.name}`
    };
  } catch (e) {
    console.error('❌ Failed to get repo info. Make sure gh CLI is authenticated.');
    process.exit(1);
  }
}

function getAdminUser(org, repo) {
  try {
    const collaborators = JSON.parse(sh(`gh api repos/${org}/${repo}/collaborators --jq '.[] | select(.permissions.admin == true) | .login'`) || '[]');
    return collaborators[0] || org; // 最初のAdminまたはOrg名
  } catch (e) {
    console.warn('⚠️  Failed to get admin user, using org name');
    return org;
  }
}

async function createEnvironments(org, repo, adminUser) {
  console.log('\n📋 2. Environments作成');
  console.log('─'.repeat(50));
  
  // staging環境
  try {
    sh(`gh api repos/${org}/${repo}/environments -f name=staging`, { stdio: 'inherit' });
    console.log('  ✅ staging環境作成完了');
  } catch (e) {
    console.log('  ⚠️  staging環境は既に存在するか、作成に失敗しました');
  }
  
  // production環境
  try {
    sh(`gh api repos/${org}/${repo}/environments -f name=production`, { stdio: 'inherit' });
    console.log('  ✅ production環境作成完了');
    
    // production環境のレビュアー設定
    try {
      sh(`gh api -X PUT -H "Accept: application/vnd.github+json" repos/${org}/${repo}/environments/production/protection_rules -f "reviewers[][type]=User" -f "reviewers[][id]=${adminUser}" -f required_reviewers_count=1`, { stdio: 'inherit' });
      console.log(`  ✅ production環境レビュアー設定完了 (${adminUser})`);
    } catch (e) {
      console.log('  ⚠️  レビュアー設定に失敗しました（既に設定済みの可能性）');
    }
  } catch (e) {
    console.log('  ⚠️  production環境は既に存在するか、作成に失敗しました');
  }
}

async function setBranchProtection(org, repo) {
  console.log('\n📋 3. Branch Protection設定');
  console.log('─'.repeat(50));
  
  try {
    // ステータスチェックの必須設定
    // 注意: 実際のチェック名は動的に取得する必要がありますが、今回は基本的な設定のみ
    sh(`gh api -X PUT -H "Accept: application/vnd.github+json" repos/${org}/${repo}/branches/main/protection -f required_status_checks.strict=true -f enforce_admins=true -f required_pull_request_reviews.required_approving_review_count=1 -f restrictions=null`, { stdio: 'inherit' });
    console.log('  ✅ mainブランチ保護設定完了');
    console.log('     → 必須レビュー数: 1');
    console.log('     → ステータスチェック: strict');
    console.log('     → Enforce admins: true');
  } catch (e) {
    console.log('  ⚠️  ブランチ保護設定に失敗しました:', e.message);
  }
}

async function updateWorkflows() {
  console.log('\n📋 4. ワークフロー環境設定');
  console.log('─'.repeat(50));
  
  const workflows = [
    '.github/workflows/seventhsense.yml',
    '.github/workflows/mirror_gate.yml'
  ];
  
  for (const workflowPath of workflows) {
    if (!fs.existsSync(workflowPath)) {
      console.log(`  ⚠️  ${workflowPath} が存在しません`);
      continue;
    }
    
    let content = fs.readFileSync(workflowPath, 'utf8');
    const originalContent = content;
    
    // environment: production を追加（jobs直下のrunジョブに）
    if (!content.includes('environment: production')) {
      // jobs.run セクションを探して、その直下に environment を追加
      content = content.replace(
        /(jobs:\s*\n\s+\w+:\s*\n\s+runs-on:[^\n]+\n)/,
        '$1    environment: production\n'
      );
      
      // より具体的なパターン: jobs.run: の後に追加
      if (content === originalContent) {
        content = content.replace(
          /(jobs:\s*\n\s+run:\s*\n\s+runs-on:[^\n]+\n)/,
          '$1    environment: production\n'
        );
      }
      
      // まだ追加されていない場合、permissions の前に追加
      if (content === originalContent) {
        content = content.replace(
          /(jobs:\s*\n\s+run:\s*\n\s+runs-on:[^\n]+\n\s+)(permissions:)/,
          '$1environment: production\n    $2'
        );
      }
      
      // mirror ジョブの場合
      if (content === originalContent && workflowPath.includes('mirror_gate')) {
        content = content.replace(
          /(jobs:\s*\n\s+mirror:\s*\n\s+runs-on:[^\n]+\n\s+)(permissions:)/,
          '$1environment: production\n    $2'
        );
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(workflowPath, content, 'utf8');
        console.log(`  ✅ ${workflowPath} に environment: production を追加`);
      } else {
        console.log(`  ⚠️  ${workflowPath} の更新に失敗しました（パターンマッチしませんでした）`);
      }
    } else {
      console.log(`  ℹ️  ${workflowPath} は既に environment 設定済み`);
    }
    
    // concurrency を追加（まだない場合）
    if (!content.includes('concurrency:')) {
      // permissions の後に追加
      content = fs.readFileSync(workflowPath, 'utf8');
      content = content.replace(
        /(permissions:[^\n]+\n\s+[^\n]+\n)/,
        '$1\n    concurrency:\n      group: ${{ github.workflow }}-${{ github.ref }}\n      cancel-in-progress: true\n'
      );
      fs.writeFileSync(workflowPath, content, 'utf8');
      console.log(`  ✅ ${workflowPath} に concurrency を追加`);
    }
  }
}

async function updateReadme(org, pubRepo) {
  console.log('\n📋 5. README更新');
  console.log('─'.repeat(50));
  
  if (!fs.existsSync('README.md')) {
    console.log('  ⚠️  README.md が存在しません');
    return;
  }
  
  let content = fs.readFileSync('README.md', 'utf8');
  
  // 既にPublic Mirrorセクションがあるか確認
  if (content.includes('### 🔭 Public Mirror') || content.includes('Public Mirror（固定入口）')) {
    console.log('  ℹ️  Public Mirrorセクションが既に存在します');
    return;
  }
  
  // 見出しの直下に追加（最初の見出しの後）
  const insertPoint = content.indexOf('---');
  if (insertPoint > 0) {
    const before = content.substring(0, insertPoint);
    const after = content.substring(insertPoint);
    content = `${before}

---

### 🔭 Public Mirror（固定入口）

- **Main**: https://github.com/${org}/${pubRepo}
- **Raw Index**: https://raw.githubusercontent.com/${org}/${pubRepo}/main/index.md

> 新しいチャットが始まったら、上の Raw Index をGPTに貼るだけで文脈即時回復。

${after}`;
  } else {
    // 最後に追加
    content += `\n\n---\n\n### 🔭 Public Mirror（固定入口）\n\n- **Main**: https://github.com/${org}/${pubRepo}\n- **Raw Index**: https://raw.githubusercontent.com/${org}/${pubRepo}/main/index.md\n\n> 新しいチャットが始まったら、上の Raw Index をGPTに貼るだけで文脈即時回復。\n`;
  }
  
  fs.writeFileSync('README.md', content, 'utf8');
  console.log('  ✅ README更新完了');
}

async function main() {
  console.log('🚀 GitHub Business 最適化 自動適用');
  console.log('='.repeat(50));
  
  const { org, repo } = getRepoInfo();
  const adminUser = getAdminUser(org, repo);
  const pubRepo = 'TriHexPhi-public'; // 固定値
  
  console.log(`\n📦 リポジトリ: ${org}/${repo}`);
  console.log(`👤 Admin User: ${adminUser}`);
  console.log(`📦 Public Mirror: ${org}/${pubRepo}`);
  
  // 1. Organization Secrets移行（確認のみ、手動設定が必要）
  console.log('\n📋 1. Organization Secrets移行');
  console.log('─'.repeat(50));
  console.log('  ℹ️  Organization Secretsは手動で設定してください。');
  console.log('  ℹ️  以下のSecretsをOrgレベルに移行:');
  console.log('     - OPENAI_API_KEY');
  console.log('     - GEMINI_API_KEY');
  console.log('     - ANTHROPIC_API_KEY');
  console.log('     - DEEPSEEK_API_KEY');
  console.log('     - GROK_API_KEY');
  console.log('     - MIRROR_TOKEN');
  console.log('     - MIRROR_REPO');
  console.log('  ℹ️  PPLX_API_KEY は任意（Wave-2衛星）');
  console.log('  ℹ️  リポ側Secretsは7日間保持してから削除');
  
  // 2. Environments作成
  await createEnvironments(org, repo, adminUser);
  
  // 3. Branch Protection設定
  await setBranchProtection(org, repo);
  
  // 4. ワークフロー環境設定
  await updateWorkflows();
  
  // 5. README更新
  await updateReadme(org, pubRepo);
  
  console.log('\n✅ 自動適用完了');
  console.log('\n📝 次のステップ:');
  console.log('  1. Organization Secretsを手動で移行');
  console.log('  2. 変更をコミット & プッシュ');
  console.log('  3. Mirror Gateを実行して動作確認');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});

