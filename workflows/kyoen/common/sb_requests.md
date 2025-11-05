# Supabase Client Thin Wrapper (n8n HTTP Request)

**Purpose:** n8n HTTP Request node presets for Supabase operations  
**Environment Variables:** `N8N_SB_URL`, `N8N_SB_KEY`

---

## Setup

**1. Environment Variables (n8n Settings → Environment):**
```env
N8N_SB_URL=https://xxxxx.supabase.co
N8N_SB_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**2. HTTP Request Node:**
- Method: `POST` | `GET` | `PATCH`
- URL: `{{ $env.N8N_SB_URL }}/rest/v1/{table_name}`
- Headers:
  - `apikey`: `{{ $env.N8N_SB_KEY }}`
  - `Authorization`: `Bearer {{ $env.N8N_SB_KEY }}`
  - `Content-Type`: `application/json`
  - `Prefer`: `return=representation` (for INSERT/UPSERT)

---

## Presets

### 1. INSERT (Single Row)

**URL:** `{{ $env.N8N_SB_URL }}/rest/v1/kyoen_messages`

**Method:** `POST`

**Headers:**
```json
{
  "apikey": "{{ $env.N8N_SB_KEY }}",
  "Authorization": "Bearer {{ $env.N8N_SB_KEY }}",
  "Content-Type": "application/json",
  "Prefer": "return=representation"
}
```

**Body (JSON):**
```json
{
  "line_user_id": "{{ $json.userId }}",
  "text": "{{ $json.message_text }}",
  "intent": "{{ $json.intent }}",
  "meta": {}
}
```

**Expected Response:** Inserted row with `id`

---

### 2. UPSERT (On Conflict)

**URL:** `{{ $env.N8N_SB_URL }}/rest/v1/kyoen_rsvp`

**Method:** `POST`

**Headers:**
```json
{
  "apikey": "{{ $env.N8N_SB_KEY }}",
  "Authorization": "Bearer {{ $env.N8N_SB_KEY }}",
  "Content-Type": "application/json",
  "Prefer": "return=representation,resolution=merge-duplicates"
}
```

**Body (JSON):**
```json
{
  "event_id": "{{ $json.event_id }}",
  "user_id": "{{ $json.user_id }}",
  "status": "{{ $json.status }}",
  "ts": "{{ $now }}"
}
```

**Query Parameters:** `?on_conflict=event_id,user_id`

**Expected Response:** Upserted row

---

### 3. SELECT (Filtered Query)

**URL:** `{{ $env.N8N_SB_URL }}/rest/v1/kyoen_events`

**Method:** `GET`

**Headers:**
```json
{
  "apikey": "{{ $env.N8N_SB_KEY }}",
  "Authorization": "Bearer {{ $env.N8N_SB_KEY }}"
}
```

**Query Parameters:**
- `select`: `id,title,start_at`
- `start_at`: `gte.{{ $now }}`
- `order`: `start_at.asc`
- `limit`: `10`

**Example:**
```
/rest/v1/kyoen_events?select=id,title,start_at&start_at=gte.2025-11-03T00:00:00Z&order=start_at.asc&limit=10
```

**Expected Response:** Array of matching rows

---

## Error Handling

**Common Errors:**
- `401 Unauthorized`: Check `N8N_SB_KEY`
- `404 Not Found`: Table name incorrect
- `409 Conflict`: Unique constraint violation (UPSERT with wrong on_conflict)

**n8n Error Node:** Catch errors and log to `kyoen_errors` table

---

**Generated:** 2025-11-03 / Cursor (☿)
