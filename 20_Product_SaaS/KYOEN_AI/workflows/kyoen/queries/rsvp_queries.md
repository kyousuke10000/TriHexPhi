# RSVP Collector - Supabase クエリ

## 1. イベント一覧取得（参加者集計付き）

### SQL（直接実行用）

```sql
SELECT 
  e.id,
  e.title,
  e.start_at,
  e.location,
  e.description,
  COUNT(CASE WHEN r.status = 'yes' THEN 1 END) AS yes_count,
  COUNT(CASE WHEN r.status = 'no' THEN 1 END) AS no_count,
  COUNT(CASE WHEN r.status = 'maybe' THEN 1 END) AS maybe_count,
  COUNT(r.id) AS total_responses
FROM kyoen_events e
LEFT JOIN kyoen_rsvp r ON r.event_id = e.id
WHERE e.start_at >= NOW() - INTERVAL '14 days'
GROUP BY e.id, e.title, e.start_at, e.location, e.description
ORDER BY e.start_at ASC
LIMIT 10;
```

### PostgREST（n8n HTTP Request用）

**URL**: `{{$env.N8N_SB_URL}}/rest/v1/rpc/get_event_rsvp_summary`

**Method**: POST

**Headers**:
```json
{
  "apikey": "{{$env.N8N_SB_KEY}}",
  "Authorization": "Bearer {{$env.N8N_SB_KEY}}",
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "days_back": 14,
  "limit_count": 10
}
```

### Supabase Function（事前作成必要）

```sql
CREATE OR REPLACE FUNCTION get_event_rsvp_summary(
  days_back INT DEFAULT 14,
  limit_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  start_at TIMESTAMPTZ,
  location TEXT,
  description TEXT,
  yes_count BIGINT,
  no_count BIGINT,
  maybe_count BIGINT,
  total_responses BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.start_at,
    e.location,
    e.description,
    COUNT(CASE WHEN r.status = 'yes' THEN 1 END) AS yes_count,
    COUNT(CASE WHEN r.status = 'no' THEN 1 END) AS no_count,
    COUNT(CASE WHEN r.status = 'maybe' THEN 1 END) AS maybe_count,
    COUNT(r.id) AS total_responses
  FROM kyoen_events e
  LEFT JOIN kyoen_rsvp r ON r.event_id = e.id
  WHERE e.start_at >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY e.id, e.title, e.start_at, e.location, e.description
  ORDER BY e.start_at ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

## 2. 特定イベントの参加者詳細取得

### SQL（直接実行用）

```sql
SELECT 
  r.id,
  r.line_user_id,
  r.status,
  r.note,
  r.created_at
FROM kyoen_rsvp r
WHERE r.event_id = 'EVENT_ID_HERE'
ORDER BY 
  CASE r.status
    WHEN 'yes' THEN 1
    WHEN 'maybe' THEN 2
    WHEN 'no' THEN 3
  END,
  r.created_at ASC;
```

### PostgREST（n8n HTTP Request用）

**URL**: `{{$env.N8N_SB_URL}}/rest/v1/kyoen_rsvp`

**Method**: GET

**Headers**:
```json
{
  "apikey": "{{$env.N8N_SB_KEY}}",
  "Authorization": "Bearer {{$env.N8N_SB_KEY}}",
  "Content-Type": "application/json"
}
```

**Query Parameters**:
```
?event_id=eq.{{$json.event_id}}&select=id,line_user_id,status,note,created_at&order=created_at.asc
```

## 3. イベントの基本情報取得

### PostgREST（n8n HTTP Request用）

**URL**: `{{$env.N8N_SB_URL}}/rest/v1/kyoen_events`

**Method**: GET

**Headers**:
```json
{
  "apikey": "{{$env.N8N_SB_KEY}}",
  "Authorization": "Bearer {{$env.N8N_SB_KEY}}",
  "Content-Type": "application/json"
}
```

**Query Parameters**:
```
?id=eq.{{$json.event_id}}&select=id,title,start_at,location,description
```

## 4. n8n Codeノード用クエリビルダー

```javascript
// イベント一覧取得用のURL構築
function buildEventListURL(supabaseUrl, daysBack = 14, limit = 10) {
  return `${supabaseUrl}/rest/v1/rpc/get_event_rsvp_summary`;
}

// 参加者詳細取得用のURL構築
function buildRSVPDetailURL(supabaseUrl, eventId) {
  const params = new URLSearchParams({
    'event_id': `eq.${eventId}`,
    'select': 'id,line_user_id,status,note,created_at',
    'order': 'created_at.asc'
  });
  
  return `${supabaseUrl}/rest/v1/kyoen_rsvp?${params.toString()}`;
}

// イベント基本情報取得用のURL構築
function buildEventInfoURL(supabaseUrl, eventId) {
  const params = new URLSearchParams({
    'id': `eq.${eventId}`,
    'select': 'id,title,start_at,location,description'
  });
  
  return `${supabaseUrl}/rest/v1/kyoen_events?${params.toString()}`;
}

// ヘッダー構築
function buildHeaders(supabaseKey) {
  return {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  };
}

module.exports = {
  buildEventListURL,
  buildRSVPDetailURL,
  buildEventInfoURL,
  buildHeaders
};
```

## 5. エラーハンドリング

### n8n Codeノード用

```javascript
// Supabaseレスポンスのエラーチェック
function checkSupabaseError(response) {
  if (response.error) {
    throw new Error(`Supabase Error: ${response.error.message}`);
  }
  
  if (!response.data && !Array.isArray(response)) {
    throw new Error('Unexpected Supabase response format');
  }
  
  return Array.isArray(response) ? response : response.data;
}

// 空結果の処理
function handleEmptyResult(data, messageType) {
  if (!data || data.length === 0) {
    switch (messageType) {
      case 'event_list':
        return {
          isEmpty: true,
          message: '今後2週間のイベントはありません。'
        };
      case 'rsvp_detail':
        return {
          isEmpty: true,
          message: 'このイベントへの参加表明はまだありません。'
        };
      default:
        return {
          isEmpty: true,
          message: 'データが見つかりませんでした。'
        };
    }
  }
  
  return { isEmpty: false, data };
}
```

## 6. テスト用ペイロード

### イベント一覧取得テスト

```json
{
  "method": "POST",
  "url": "https://xxx.supabase.co/rest/v1/rpc/get_event_rsvp_summary",
  "headers": {
    "apikey": "your-anon-key",
    "Authorization": "Bearer your-anon-key",
    "Content-Type": "application/json"
  },
  "body": {
    "days_back": 14,
    "limit_count": 10
  }
}
```

### 参加者詳細取得テスト

```json
{
  "method": "GET",
  "url": "https://xxx.supabase.co/rest/v1/kyoen_rsvp?event_id=eq.550e8400-e29b-41d4-a716-446655440000&select=id,line_user_id,status,note,created_at&order=created_at.asc",
  "headers": {
    "apikey": "your-anon-key",
    "Authorization": "Bearer your-anon-key",
    "Content-Type": "application/json"
  }
}
```

## 7. 使用例（n8n ワークフロー内）

### イベント一覧取得フロー

```
Webhook → Code(コマンド検出) → HTTP Request(Supabase) → Code(データ整形) → HTTP Request(LINE Push)
```

### 参加者詳細取得フロー（postback）

```
Webhook(postback) → Code(event_id抽出) → HTTP Request(Supabase) → Code(Flex生成) → HTTP Request(LINE Push)
```
