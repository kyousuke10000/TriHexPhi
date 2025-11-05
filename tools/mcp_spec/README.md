# MCP Specifications for TriHex n8n Workflows

**Purpose:** Share n8n node specifications between Claude Desktop and Cursor  
**Location:** `tools/mcp_spec/` (this repo) and `~/Claude/MCP/` (external)

---

## Structure

```
tools/mcp_spec/
├── README.md (this file)
├── n8n/
│   ├── nodes.json          # Node type specifications
│   ├── credentials.json    # Credential schemas
│   └── workflows/          # Workflow templates
│       ├── event-detect.json
│       ├── rsvp.json
│       ├── reminders.json
│       └── cards.json
└── shared/                 # Shared schema definitions
    ├── line.yml
    ├── supabase.yml
    └── flex_messages.yml
```

---

## Usage

**Claude Desktop:** Reads from `~/Claude/MCP/`  
**Cursor:** Reads from `tools/mcp_spec/`  
**Sync:** Manual or symlink to keep in sync

---

**Generated:** 2025-11-02 / Cursor (☿)
