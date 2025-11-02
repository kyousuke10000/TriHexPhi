// TriHexΦ Janitor - Inbox Router
// 
// _inbox/ のファイルをfrontmatterに基づいて自動ルーティング
// 
// 作成: 2025-10-28
// モード: gentle（dry-run、提案のみ）

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const yaml = require('js-yaml');

// ルーティング規則を読み込み
function loadRoutes() {
  const routesPath = path.join(process.cwd(), 'configs/trihex.routes.yml');
  const routesContent = fs.readFileSync(routesPath, 'utf8');
  return yaml.load(routesContent);
}

// Slugを生成（タイトル → URL安全な文字列）
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // 英数字以外を'-'に
    .replace(/^-|-$/g, '')        // 前後の'-'を削除
    .substring(0, 100);            // 最大100文字
}

// ルールにマッチするか判定
function matchesRule(rule, trihex) {
  for (const [key, value] of Object.entries(rule)) {
    if (trihex[key] !== value) {
      return false;
    }
  }
  return true;
}

// 目標パスを見つける
function findTargetPath(routes, trihex) {
  const slug = generateSlug(trihex.title);
  
  for (const rule of routes.rules) {
    if (matchesRule(rule.when, trihex)) {
      let target = rule.target
        .replace('{date}', trihex.date)
        .replace('{slug}', slug);
      
      return {
        path: target,
        description: rule.description
      };
    }
  }
  
  return null;
}

// Frontmatterをバリデーション
function validateFrontmatter(trihex, routes) {
  const errors = [];
  
  // 必須フィールドチェック
  const required = routes.validation?.required_fields || [];
  for (const field of required) {
    if (!trihex[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // 値の妥当性チェック
  const allowed = routes.validation?.allowed_values || {};
  
  if (allowed.kind && !allowed.kind.includes(trihex.kind)) {
    errors.push(`Invalid kind: ${trihex.kind}. Allowed: ${allowed.kind.join(', ')}`);
  }
  
  if (allowed.lang && !allowed.lang.includes(trihex.lang)) {
    errors.push(`Invalid lang: ${trihex.lang}. Allowed: ${allowed.lang.join(', ')}`);
  }
  
  if (allowed.author && !allowed.author.includes(trihex.author)) {
    errors.push(`Invalid author: ${trihex.author}. Allowed: ${allowed.author.join(', ')}`);
  }
  
  if (allowed.status && !allowed.status.includes(trihex.status)) {
    errors.push(`Invalid status: ${trihex.status}. Allowed: ${allowed.status.join(', ')}`);
  }
  
  // 日付形式チェック
  const dateRegex = /^20\d{2}-\d{2}-\d{2}$/;
  if (!dateRegex.test(trihex.date)) {
    errors.push(`Invalid date format: ${trihex.date}. Expected: YYYY-MM-DD`);
  }
  
  return errors;
}

// メイン処理
async function main() {
  console.log('🤖 TriHexΦ Janitor (gentle mode)');
  console.log('==========================================\n');
  
  // ルーティング規則を読み込み
  const routes = loadRoutes();
  console.log(`✅ Loaded routing rules v${routes.version}\n`);
  
  // _inbox/ のファイルを走査
  const inboxDir = path.join(process.cwd(), '_inbox');
  const files = fs.readdirSync(inboxDir).filter(f => 
    f.endsWith('.md') && f !== 'README.md'
  );
  
  if (files.length === 0) {
    console.log('📭 _inbox/ is empty. Nothing to do.\n');
    return;
  }
  
  console.log(`📂 Found ${files.length} file(s) in _inbox/\n`);
  
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(inboxDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`📄 Processing: ${file}`);
    
    // Frontmatterを解析
    let parsed;
    try {
      parsed = matter(content);
    } catch (error) {
      console.log(`   ❌ Failed to parse frontmatter: ${error.message}`);
      results.push({
        file,
        status: 'error',
        error: 'Failed to parse frontmatter'
      });
      continue;
    }
    
    // trihexフィールドをチェック
    if (!parsed.data || !parsed.data.trihex) {
      console.log(`   ⚠️  No trihex frontmatter found`);
      results.push({
        file,
        status: 'missing_frontmatter',
        suggestion: 'Add trihex frontmatter block'
      });
      continue;
    }
    
    const trihex = parsed.data.trihex;
    
    // バリデーション
    const errors = validateFrontmatter(trihex, routes);
    if (errors.length > 0) {
      console.log(`   ⚠️  Validation errors:`);
      errors.forEach(err => console.log(`      - ${err}`));
      results.push({
        file,
        status: 'validation_error',
        errors
      });
      continue;
    }
    
    // 目標パスを見つける
    const target = findTargetPath(routes, trihex);
    
    if (!target) {
      console.log(`   ⚠️  No matching route found`);
      console.log(`      kind: ${trihex.kind}, lang: ${trihex.lang || 'N/A'}`);
      results.push({
        file,
        status: 'no_route',
        trihex
      });
      continue;
    }
    
    console.log(`   ✅ Route found: ${target.path}`);
    console.log(`      Description: ${target.description}`);
    
    results.push({
      file,
      status: 'ready',
      from: `_inbox/${file}`,
      to: target.path,
      description: target.description
    });
  }
  
  console.log('\n==========================================');
  console.log('📊 Summary\n');
  
  const ready = results.filter(r => r.status === 'ready');
  const errors = results.filter(r => r.status !== 'ready');
  
  console.log(`✅ Ready to route: ${ready.length}`);
  console.log(`⚠️  Needs attention: ${errors.length}\n`);
  
  if (ready.length > 0) {
    console.log('📋 Suggested moves:\n');
    ready.forEach(r => {
      console.log(`   ${r.from}`);
      console.log(`   → ${r.to}\n`);
    });
  }
  
  if (errors.length > 0) {
    console.log('⚠️  Files needing attention:\n');
    errors.forEach(r => {
      console.log(`   ${r.file}: ${r.status}`);
      if (r.errors) {
        r.errors.forEach(err => console.log(`      - ${err}`));
      }
      console.log('');
    });
  }
  
  // GitHub Actionsのために結果をJSONで出力
  if (process.env.GITHUB_ACTIONS) {
    const outputPath = path.join(process.cwd(), 'janitor-report.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`📊 Report saved to: janitor-report.json`);
  }
  
  // gentle modeなので実際の移動はしない
  console.log('\n🌟 gentle mode: No files were moved.');
  console.log('💡 To apply these changes, review and approve them.\n');
  
  // エラーがあれば終了コード1
  if (errors.length > 0) {
    process.exit(1);
  }
}

// 実行
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

