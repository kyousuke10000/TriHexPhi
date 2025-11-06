#!/usr/bin/env node
/**
 * GitHub Business 最適化 事前検証スクリプト
 * 
 * 指令書実行前に、以下を確認:
 * 1. 既に設定済みの項目がないか
 * 2. 実行しても安全か
 * 3. GPTに確認すべき項目は何か
 */

import { execSync } from 'child_process';

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

async function checkSecrets(org, repo) {
  console.log('\n📋 1. Organization Secrets 確認');
  console.log('─'.repeat(50));
  
  const requiredSecrets = [
    'OPENAI_API_KEY',
    'GEMINI_API_KEY',
    'ANTHROPIC_API_KEY',
    'DEEPSEEK_API_KEY',
    'GROK_API_KEY',
    'PPLX_API_KEY',
    'MIRROR_TOKEN',
    'MIRROR_REPO'
  ];
  
  const existingSecrets = [];
  const missingSecrets = [];
  
  for (const secret of requiredSecrets) {
    try {
      // Try org-level first
      const orgSecrets = sh(`gh secret list -o ${org} 2>/dev/null`) || '';
      const repoSecrets = sh(`gh secret list -R ${org}/${repo} 2>/dev/null`) || '';
      
      if (orgSecrets.includes(secret) || repoSecrets.includes(secret)) {
        existingSecrets.push(secret);
        console.log(`  ✅ ${secret} (設定済み)`);
      } else {
        missingSecrets.push(secret);
        console.log(`  ⚠️  ${secret} (未設定)`);
      }
    } catch (e) {
      missingSecrets.push(secret);
      console.log(`  ❓ ${secret} (確認不可)`);
    }
  }
  
  return { existingSecrets, missingSecrets };
}

async function checkEnvironments(org, repo) {
  console.log('\n📋 2. Environments 確認');
  console.log('─'.repeat(50));
  
  try {
    const envs = JSON.parse(sh(`gh api repos/${org}/${repo}/environments 2>/dev/null`) || '{}');
    const envNames = envs.environments?.map(e => e.name) || [];
    
    const requiredEnvs = ['staging', 'production'];
    const existing = [];
    const missing = [];
    
    for (const env of requiredEnvs) {
      if (envNames.includes(env)) {
        existing.push(env);
        console.log(`  ✅ ${env} (存在)`);
        
        // Check protection rules
        try {
          const protection = JSON.parse(sh(`gh api repos/${org}/${repo}/environments/${env}/protection_rules 2>/dev/null`) || '{}');
          if (protection.reviewers && protection.reviewers.length > 0) {
            console.log(`     → レビュアー設定: ${protection.reviewers.length}人`);
          }
        } catch (e) {
          // No protection rules
        }
      } else {
        missing.push(env);
        console.log(`  ⚠️  ${env} (未作成)`);
      }
    }
    
    return { existing, missing };
  } catch (e) {
    console.log('  ❓ 確認不可（API権限が必要かもしれません）');
    return { existing: [], missing: ['staging', 'production'] };
  }
}

async function checkBranchProtection(org, repo) {
  console.log('\n📋 3. Branch Protection 確認');
  console.log('─'.repeat(50));
  
  try {
    const protection = JSON.parse(sh(`gh api repos/${org}/${repo}/branches/main/protection 2>/dev/null`) || 'null');
    
    if (!protection) {
      console.log('  ⚠️  mainブランチ保護が未設定');
      return { protected: false, reviewCount: 0 };
    }
    
    const reviewCount = protection.required_pull_request_reviews?.required_approving_review_count || 0;
    const strictChecks = protection.required_status_checks?.strict || false;
    
    console.log(`  ✅ ブランチ保護: 有効`);
    console.log(`     → 必須レビュー数: ${reviewCount}`);
    console.log(`     → ステータスチェック: ${strictChecks ? 'strict' : 'lenient'}`);
    
    return { protected: true, reviewCount, strictChecks };
  } catch (e) {
    console.log('  ❓ 確認不可（API権限が必要かもしれません）');
    return { protected: false, reviewCount: 0 };
  }
}

async function checkWorkflowEnvironments() {
  console.log('\n📋 4. ワークフローのEnvironment設定 確認');
  console.log('─'.repeat(50));
  
  const workflowsToCheck = [
    '.github/workflows/seventhsense.yml',
    '.github/workflows/mirror_gate.yml',
    '.github/workflows/mirror_gate_dispatch.yml'
  ];
  
  const fs = await import('fs');
  const results = [];
  
  for (const workflowPath of workflowsToCheck) {
    try {
      if (!fs.existsSync(workflowPath)) {
        console.log(`  ⚠️  ${workflowPath} (ファイル不存在)`);
        results.push({ file: workflowPath, hasEnv: false, exists: false });
        continue;
      }
      
      const content = fs.readFileSync(workflowPath, 'utf8');
      const hasEnv = content.includes('environment:') || content.includes('environment: production');
      const hasPermissions = content.includes('permissions:');
      
      if (hasEnv) {
        console.log(`  ✅ ${workflowPath} (environment設定済み)`);
      } else {
        console.log(`  ⚠️  ${workflowPath} (environment未設定)`);
      }
      
      results.push({ file: workflowPath, hasEnv, hasPermissions, exists: true });
    } catch (e) {
      console.log(`  ❓ ${workflowPath} (読み込みエラー)`);
      results.push({ file: workflowPath, hasEnv: false, exists: false });
    }
  }
  
  return results;
}

async function checkReadme() {
  console.log('\n📋 5. README 確認');
  console.log('─'.repeat(50));
  
  const fs = await import('fs');
  
  if (!fs.existsSync('README.md')) {
    console.log('  ⚠️  README.md が存在しません');
    return { hasPublicMirror: false };
  }
  
  const content = fs.readFileSync('README.md', 'utf8');
  const hasPublicMirror = content.includes('Public Mirror') || content.includes('raw.githubusercontent.com');
  
  if (hasPublicMirror) {
    console.log('  ✅ Public Mirrorリンクあり');
  } else {
    console.log('  ⚠️  Public Mirrorリンクなし');
  }
  
  return { hasPublicMirror };
}

async function main() {
  console.log('🔍 GitHub Business 最適化 事前検証');
  console.log('='.repeat(50));
  
  const { org, repo, fullName } = getRepoInfo();
  console.log(`\n📦 リポジトリ: ${fullName}`);
  
  // 1. Secrets確認
  const secrets = await checkSecrets(org, repo);
  
  // 2. Environments確認
  const envs = await checkEnvironments(org, repo);
  
  // 3. Branch Protection確認
  const protection = await checkBranchProtection(org, repo);
  
  // 4. ワークフロー確認
  const workflows = await checkWorkflowEnvironments();
  
  // 5. README確認
  const readme = await checkReadme();
  
  // まとめ
  console.log('\n📊 検証結果サマリー');
  console.log('='.repeat(50));
  
  const issues = [];
  const warnings = [];
  const gptQuestions = [];
  
  // Secrets
  if (secrets.missingSecrets.length > 0) {
    warnings.push(`未設定のSecrets: ${secrets.missingSecrets.join(', ')}`);
    gptQuestions.push(`これらのSecretsは既に別の場所（個人アカウント等）で設定済みですか？`);
  }
  
  // Environments
  if (envs.missing.length > 0) {
    issues.push(`未作成のEnvironments: ${envs.missing.join(', ')}`);
  }
  
  // Branch Protection
  if (!protection.protected) {
    warnings.push('mainブランチ保護が未設定です。設定しますか？');
    gptQuestions.push('ブランチ保護を有効にすると、直接pushができなくなります。問題ありませんか？');
  }
  
  // Workflows
  const workflowsWithoutEnv = workflows.filter(w => w.exists && !w.hasEnv);
  if (workflowsWithoutEnv.length > 0) {
    warnings.push(`Environment未設定のワークフロー: ${workflowsWithoutEnv.map(w => w.file).join(', ')}`);
    gptQuestions.push('これらのワークフローに`environment: production`を追加しますか？');
  }
  
  // README
  if (!readme.hasPublicMirror) {
    warnings.push('READMEにPublic Mirrorリンクがありません');
  }
  
  // 出力
  if (issues.length > 0) {
    console.log('\n❌ 問題:');
    issues.forEach(i => console.log(`  - ${i}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  警告:');
    warnings.forEach(w => console.log(`  - ${w}`));
  }
  
  if (gptQuestions.length > 0) {
    console.log('\n❓ GPTに確認すべき項目:');
    gptQuestions.forEach((q, i) => console.log(`  ${i + 1}. ${q}`));
  }
  
  if (issues.length === 0 && warnings.length === 0 && gptQuestions.length === 0) {
    console.log('\n✅ すべての項目が設定済みです。追加の設定は不要の可能性があります。');
  }
  
  console.log('\n💡 次のステップ:');
  console.log('  1. 上記の確認事項をGPTに質問して承認を得る');
  console.log('  2. 承認後、指令書を実行');
  console.log('  3. 重複設定を避けるため、既存設定を確認してから実行');
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});

