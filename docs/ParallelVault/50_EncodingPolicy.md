# TriHex Encoding Policy

**Version:** 1.0  
**Date:** 2025-11-01  
**Phase:** V Aurum  
**Status:** ✅ Enforced

---

## Executive Summary

**Standard:** UTF-8 encoding with NFC (Canonical Decomposition Normalization Form C)  
**Objective:** Zero character corruption across all I/O layers  
**Scope:** Node.js, Git, CI/CD, Documentation, AI interactions

---

## Policy

### 1. Encoding Standard

**All files MUST use:**
- **Encoding:** UTF-8
- **Normalization:** NFC
- **Line Endings:** LF (\n)
- **BOM:** Forbidden (Zero BOM)

### 2. Character Handling

#### 2.1 Normalization Rules

```javascript
const toUtf8NFC = (bufOrStr) => {
  const s = Buffer.isBuffer(bufOrStr) 
    ? bufOrStr.toString("utf8") 
    : String(bufOrStr);
  
  // BOM除去 → 改行正規化 → Unicode正規化(NFC)
  return s
    .replace(/^\uFEFF/, "")      // Remove BOM
    .replace(/\r\n?/g, "\n")     // CRLF/CR → LF
    .normalize("NFC");           // Unicode NFC
};
```

#### 2.2 Normalization Example

| Input | NFC Output |
|-------|------------|
| `café` (NFD) | `café` |
| `가` (Combined) | `가` |
| `あ` + `゙` (NFD) | `あ` |
| `\r\n` | `\n` |
| `\uFEFFtext` | `text` |

---

## Implementation

### 3. Node.js Environment

#### 3.1 Environment Variables

```bash
# scripts/env-utf8.sh
export LANG=C.UTF-8
export LC_ALL=C.UTF-8
export NODE_OPTIONS="--max_old_space_size=4096"
```

**Usage:**
```bash
source scripts/env-utf8.sh
```

#### 3.2 Subprocess Encoding

```javascript
// UTF-8 subprocess spawn wrapper
function pspawn(cmd, args, opts = {}) {
  const env = { 
    ...process.env, 
    LANG: "C.UTF-8", 
    LC_ALL: "C.UTF-8" 
  };
  const ps = spawn(cmd, args, { 
    stdio: ["pipe", "pipe", "pipe"], 
    env: { ...env, ...opts.env },
    ...opts 
  });
  ps.stdout.setEncoding("utf8");
  ps.stderr.setEncoding("utf8");
  return ps;
}
```

#### 3.3 File I/O Utilities

```javascript
const readUtf8NFC = async (filepath) => {
  const buf = await fs.readFile(filepath);
  return toUtf8NFC(buf);
};

const writeUtf8NFC = async (filepath, content) => {
  const data = toUtf8NFC(content);
  const dir = path.dirname(filepath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await fs.writeFile(filepath, data, { encoding: "utf8" });
};
```

---

### 4. Git Configuration

#### 4.1 Encoding Settings

```bash
# scripts/git-i18n-utf8.sh
git config i18n.commitEncoding utf-8
git config i18n.logOutputEncoding utf-8
git config core.quotepath false
```

**Usage:**
```bash
./scripts/git-i18n-utf8.sh
```

#### 4.2 Repository Setup

Add to `.gitattributes`:
```
* text=auto eol=lf encoding=utf-8
*.md text eol=lf encoding=utf-8
*.{js,mjs,ts,jsx,tsx} text eol=lf encoding=utf-8
*.json text eol=lf encoding=utf-8
*.yml text eol=lf encoding=utf-8
```

---

### 5. CI/CD (GitHub Actions)

#### 5.1 Workflow Environment

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    env:
      LANG: C.UTF-8
      LC_ALL: C.UTF-8
```

#### 5.2 Normalization Step

```yaml
- name: Normalize Markdown (NFC)
  run: node scripts/normalize-md.mjs 10_TriHexCore 20_TriHex-Obsidian 99_SYSTEM
```

#### 5.3 Encoding Test

```yaml
- name: Encoding Golden Test
  run: npm run -s test:encoding
```

---

### 6. Documentation Standards

#### 6.1 Markdown Files

**ALL** `.md` files MUST:
- Use UTF-8 encoding
- Be normalized to NFC
- Use LF line endings
- Have zero BOM

**Enforcement:**
```bash
# Normalize all markdown files
node scripts/normalize-md.mjs 10_TriHexCore 20_TriHex-Obsidian 99_SYSTEM
```

#### 6.2 Text Files

**Applies to:**
- `.md` - Markdown documents
- `.txt` - Plain text
- `.json` - JSON data
- `.yml` - YAML configs
- `.yaml` - YAML configs

---

## Testing

### 7. Golden Test

#### 7.1 Test File

**File:** `tests/encoding/golden.txt`  
**Content:**
```
私命／使命／呼吸／鏡／叡智／風・火・水・地・空・識
```

#### 7.2 Test Execution

```bash
npm run test:encoding
```

**Test Criteria:**
1. ✅ Japanese characters readable
2. ✅ No CRLF (`\r`)
3. ✅ NFC normalization working
4. ✅ UTF-8 encoding verified

---

## Compliance

### 8. Verification Checklist

**Before Commit:**
- [ ] All files UTF-8 encoded
- [ ] NFC normalization applied
- [ ] LF line endings only
- [ ] No BOM present
- [ ] Golden test passes

**In CI/CD:**
- [ ] Environment set to UTF-8
- [ ] Normalize step runs
- [ ] Encoding test passes
- [ ] No encoding warnings

---

## Violation Handling

### 9. Recovery Procedures

#### 9.1 Detect Violations

```bash
# Check file encoding
file -I path/to/file

# Check for BOM
hexdump -C path/to/file | grep "ef bb bf"

# Check line endings
cat -A path/to/file
```

#### 9.2 Repair Files

```bash
# Normalize single file
node -e "
import fs from 'fs/promises';
const data = await fs.readFile('path/to/file', 'utf8');
const fixed = data.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC');
await fs.writeFile('path/to/file', fixed, 'utf8');
"

# Or use normalize script
node scripts/normalize-md.mjs path/to/directory
```

#### 9.3 Prevent Recurrence

1. Add `.gitattributes` enforcement
2. Run pre-commit hooks
3. Enable CI/CD checks
4. Document violations

---

## Tools Reference

### 10. Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/env-utf8.sh` | Set UTF-8 environment | `source scripts/env-utf8.sh` |
| `scripts/git-i18n-utf8.sh` | Configure Git encoding | `./scripts/git-i18n-utf8.sh` |
| `scripts/normalize-md.mjs` | Normalize markdown files | `node scripts/normalize-md.mjs [dirs]` |
| `scripts/test-encoding.mjs` | Golden encoding test | `npm run test:encoding` |

---

## References

### Standards

- **Unicode:** [NFC Normalization](https://unicode.org/reports/tr15/#Norm_Forms)
- **UTF-8:** [RFC 3629](https://tools.ietf.org/html/rfc3629)
- **Git:** [git-config i18n](https://git-scm.com/docs/git-config#Documentation/git-config.txt-i18ncommitEncoding)

### Internal Documents

- [Recovery Playbook](../../99_SYSTEM/Proofs/2025-11-Recovery_Playbook.md)
- [Loop Fixes Report](../../99_SYSTEM/Proofs/2025-11-LoopFixes_FinalReport.md)

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** V Aurum  
**Status:** ✅ Policy Enforced

---

*"Zero corruption. Perfect encoding. Complete trust."*
