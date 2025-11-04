# MCP API Key Mismatch

**Date:** 2025-11-02  
**Issue:** Claude Desktop MCP using old/incorrect API key

---

## Problem

**Claude Desktop config has:**
```json
"N8N_API_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDIwNWE5Yi03ODU2LTRiNDQtYjllYS01NWNkMTYwODhhZjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYwODU4NjgxfQ.jG6PN1dhfdlb9Pp61tkz9luutlHVe-kZ57Z81wrSfo8"
```

**Current .secrets/n8n.env has:**
```
N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDIwNWE5Yi03ODU2LTRiNDQtYjllYS01NWNkMTYwODhhZjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxOTAzODk5fQ.5p96PuWoSD9TeHt_5ENKpG-Yo8fxzS1WHEpCP95uBMc
```

**Issue:** Different JWT timestamps! MCP has old key.

---

## Fix

**Update Claude Desktop config:**
1. Open: `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Replace `N8N_API_KEY` with current value
3. Save
4. Restart Claude Desktop

---

**Generated:** 2025-11-02 / Cursor (☿)


