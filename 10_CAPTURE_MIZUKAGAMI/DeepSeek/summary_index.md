---
trihex_layer: mizukagami
category: index
ai: DeepSeek
date: 2025-11-02
---

# DeepSeek Summary Index

```dataview
TABLE file.day as 日付, session_id as セッション, topics as トピック, sync as 真泉Push
FROM "10_CAPTURE_MIZUKAGAMI/DeepSeek"
WHERE file.name != "summary_index"
SORT file.day desc
```

---

**Generated:** 2025-11-02  
**Purpose:** DeepSeek session index

