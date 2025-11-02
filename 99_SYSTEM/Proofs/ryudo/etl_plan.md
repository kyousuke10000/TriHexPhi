# Ryudo ETL Plan - GitHub Actions → Supabase

**Version:** 1.0  
**Date:** 2025-11-01  
**Phase:** IV Rubedo  
**Author:** Cursor (☿)

---

## Overview

**Source:** GitHub Actions workflow (ryudo_round.yml)  
**Destination:** Supabase (trihex_core.ryudo_rounds, ryudo_contributions)  
**Trigger:** After scoring step completes  
**Frequency:** Per round (up to 7 per review)

---

## Data Flow

```
GitHub Actions (ryudo_round.yml)
        ↓
[score job completes]
        ↓
Extract: Round metadata + contributions
        ↓
Transform: JSON payload
        ↓
Load: Supabase upsert
        ↓
Verification: Read back and compare
```

---

## Extraction Phase

### 1. Round Metadata

**Source:** Workflow outputs from `parse-context` job

```json
{
  "topic": "${{ steps.parse.outputs.topic }}",
  "discussion_id": "${{ steps.parse.outputs.discussion_id }}",
  "round_no": "${{ steps.parse.outputs.round_no }}",
  "target_score": "${{ steps.parse.outputs.target_score }}"
}
```

### 2. Statistics

**Source:** Workflow outputs from `score` job

```json
{
  "avg_score": "${{ steps.score.outputs.avg_score }}",
  "min_score": "${{ steps.score.outputs.min_score }}",
  "max_score": "${{ steps.score.outputs.max_score }}",
  "variance": "${{ steps.score.outputs.variance }}"
}
```

### 3. Contributions

**Source:** Artifact files from `collect` job

For each AI:
- Response content
- Per-axis scores
- Weaknesses identified
- Deductions applied

---

## Transformation Phase

### Round Record

```sql
INSERT INTO trihex_core.ryudo_rounds (
  discussion_id,
  discussion_number,
  topic,
  target_score,
  round_no,
  status,
  avg_score,
  min_score,
  max_score,
  variance,
  weaknesses,
  should_continue,
  next_round,
  context_json
) VALUES (
  '<discussion_id>',
  <discussion_number>,
  '<topic>',
  <target_score>,
  <round_no>,
  'completed',
  <avg_score>,
  <min_score>,
  <max_score>,
  <variance>,
  ARRAY['weakness1', 'weakness2'],
  <should_continue>,
  <next_round>,
  '{"parsed_from": "github"}'
);
```

### Contribution Records

For each AI (6 total):

```sql
INSERT INTO trihex_core.ryudo_contributions (
  round_id,
  agent,
  agent_symbol,
  content,
  content_length,
  consistency_score,
  depth_score,
  specificity_score,
  feasibility_score,
  philosophy_alignment_score,
  weaknesses,
  deductions_critical,
  deductions_major,
  deductions_minor,
  api_response_time_ms,
  api_success
) VALUES (
  '<round_id>',
  'GPT-5',
  '🜁',
  '<full_response_text>',
  <length>,
  <consistency>,
  <depth>,
  <specificity>,
  <feasibility>,
  <philosophy>,
  ARRAY['weakness'],
  <critical>,
  <major>,
  <minor>,
  <ms>,
  true
);
```

---

## Load Phase

### Step 1: Upsert Round

**Conflict Resolution:** On discussion_id + round_no

```sql
INSERT INTO trihex_core.ryudo_rounds (...)
VALUES (...)
ON CONFLICT (id) 
DO UPDATE SET
  status = EXCLUDED.status,
  avg_score = EXCLUDED.avg_score,
  ...
  updated_at = NOW();
```

### Step 2: Upsert Contributions

**Delete old, insert new** (round_id is immutable)

```sql
DELETE FROM trihex_core.ryudo_contributions 
WHERE round_id = '<round_id>';

INSERT INTO trihex_core.ryudo_contributions (...)
VALUES (...), (...), (...), (...), (...), (...);
```

**Note:** 6 contributions per round (one per HAI)

### Step 3: Verify

Check statistics match workflow outputs:

```sql
SELECT 
  COUNT(*) AS contribution_count,
  AVG(overall_score) AS avg_score,
  MIN(overall_score) AS min_score,
  MAX(overall_score) AS max_score
FROM trihex_core.ryudo_contributions
WHERE round_id = '<round_id>';
```

---

## Error Handling

### Mode 1: Secrets Missing

**Trigger:** `SUPABASE_SERVICE_ROLE_KEY` not set  
**Action:** Skip ETL, log warning, continue workflow  
**Message:** "⚠️ Supabase ETL skipped: secrets not configured"

---

### Mode 2: API Failure

**Trigger:** Upsert fails  
**Action:** Retry 3 times with exponential backoff  
**On failure:** Mark round as 'failed', continue workflow

---

### Mode 3: Data Mismatch

**Trigger:** Verification stats don't match  
**Action:** Log error, mark round as 'failed', alert  
**Recovery:** Manual inspection required

---

## Dry-Run Mode

### Activation

When `dry_run` input is `true`:

```yaml
- name: Dry-run ETL
  if: github.event.inputs.dry_run == 'true'
  run: |
    echo "🟡 DRY-RUN: Would upsert to Supabase..."
    cat > dry_run_payload.json << EOF
    {
      "round": { ... },
      "contributions": [ ... ]
    }
    EOF
```

### Validation

- Build payload without inserting
- Validate JSON structure
- Check required fields
- Verify foreign key references

---

## Example Script

```javascript
// .github/scripts/ryudo-etl.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('⚠️ Supabase secrets not configured, skipping ETL');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read workflow outputs
const roundData = JSON.parse(fs.readFileSync('round_data.json', 'utf8'));
const contributionsData = JSON.parse(fs.readFileSync('contributions.json', 'utf8'));

// Upsert round
const { data: round, error: roundError } = await supabase
  .from('ryudo_rounds')
  .upsert(roundData, { onConflict: 'discussion_id,round_no' });

if (roundError) {
  console.error('❌ Round upsert failed:', roundError);
  process.exit(1);
}

// Insert contributions
const { data: contributions, error: contribError } = await supabase
  .from('ryudo_contributions')
  .delete()
  .match({ round_id: round.id })
  .then(() => supabase
    .from('ryudo_contributions')
    .insert(contributionsData)
  );

if (contribError) {
  console.error('❌ Contributions insert failed:', contribError);
  process.exit(1);
}

console.log('✅ ETL complete');
```

---

## Testing

### Unit Tests

```bash
# Validate payload structure
node scripts/validate-ryudo-payload.js round_data.json

# Test connection
node scripts/test-supabase-connection.js
```

### Integration Tests

```bash
# Dry-run full ETL
node scripts/ryudo-etl.js --dry-run

# Execute against test database
node scripts/ryudo-etl.js --env test
```

---

## Monitoring

### Metrics

- **ETL Success Rate** - % upserts successful
- **ETL Duration** - Average execution time
- **Verification Pass Rate** - % stats matching
- **Error Frequency** - Per error type

### Alerts

- ⚠️ ETL failure rate > 10%
- ⚠️ Average duration > 30s
- ⚠️ Verification mismatch
- ⚠️ Secrets expiry warning

---

## Rollback

If ETL corrupts data:

```sql
-- Find recent rounds
SELECT * FROM trihex_core.ryudo_rounds 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Delete if incorrect
DELETE FROM trihex_core.ryudo_rounds 
WHERE id = '<round_id>';
-- Cascade will delete contributions
```

---

**Generated:** 2025-11-01 / Cursor (☿)  
**Phase:** IV Rubedo  
**Status:** Proposed


