# Mojibake Zero Hotfix Report

**Date:** 2025-11-01  
**Phase:** V Aurum  
**Observer:** Cursor (☿)  
**Status:** ✅ HOTFIX APPLIED (Partially Complete)

---

## Executive Summary

**Issue:** Japanese character corruption in Conductor outputs  
**Root Cause:** UTF-8 encoding inconsistencies across I/O layers  
**Solution:** UTF-8 + NFC normalization enforced  
**Status:** Core framework applied, remaining tasks identified

---

## Changes Applied

### ✅ Completed

1. **Environment Script** (`scripts/env-utf8.sh`)
   - LANG/LC_ALL set to C.UTF-8
   - NODE_OPTIONS configured
   - Executable permissions set

2. **Script Integration**
   - `scripts/demo-sixAI.sh` → sources env-utf8.sh
   - `scripts/trihex-test.sh` → sources env-utf8.sh
   - `scripts/stress-test-sixAI.sh` → sources env-utf8.sh

3. **Conductor UTF-8 Utils**
   - `toUtf8NFC()` function added
   - `readUtf8NFC()` function added
   - `writeUtf8NFC()` function added
   - Config loading normalized

---

## Changes Pending

### ⏳ Remaining Tasks

1. **Subprocess Encoding** (`tools/conductor/run.mjs`)
   - Need `pspawn()` wrapper
   - Set LANG/LC_ALL in spawn env
   - Set stdout/stderr encoding

2. **File I/O Normalization** (`tools/conductor/run.mjs`)
   - Convert all `readFileSync` → async
   - Convert all `writeFileSync` → async
   - Apply NFC normalization everywhere

3. **Git Configuration** (`scripts/git-i18n-utf8.sh`)
   - Git i18n settings
   - Quotepath configuration
   - Executable permissions

4. **GitHub Workflows** (`.github/workflows/harmonia-ci.yml`)
   - Add LANG/LC_ALL env vars
   - Add normalize-md step
   - Add encoding test step

5. **Normalize Script** (`scripts/normalize-md.mjs`)
   - Walk directories
   - Apply NFC to .md files
   - Report changes

6. **Golden Test** (`scripts/test-encoding.mjs`)
   - Read golden.txt
   - Verify NFC normalization
   - Test crlf/lf handling

7. **Package.json** (`package.json`)
   - Add `test:encoding` script
   - Configure npm scripts

8. **Documentation** (`docs/ParallelVault/50_EncodingPolicy.md`)
   - UTF-8 policy
   - NFC enforcement
   - BOM exclusion
   - LF standardization

---

## Next Steps

### Immediate

```bash
# Continue remaining tasks
# See task list above
```

### Testing

```bash
# Run encoding test (once created)
npm run test:encoding

# Run conductor with UTF-8
./scripts/demo-sixAI.sh

# Verify no mojibake
grep -r "ハロー" 99_SYSTEM/Proofs/
```

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Status:** ⏳ Partial Implementation

---

*"From chaos to order. From error to wisdom."*

