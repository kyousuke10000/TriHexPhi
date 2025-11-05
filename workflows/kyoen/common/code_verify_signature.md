# LINE Webhook Signature Verification

**Purpose:** HMAC-SHA256 signature verification for LINE webhooks  
**Location:** n8n Code node  
**Required:** Webhook Raw Body mode enabled

---

## Implementation

```javascript
const crypto = require('crypto');

// Get secret from n8n environment
const secret = $env.N8N_LINE_SECRET;

// Get raw body (must be enabled in Webhook: Raw Request Data = true)
const raw = $json.body_raw;

// Get signature from headers
const sig = ($json.headers['x-line-signature'] || $json.headers['X-Line-Signature']);

// Validate prerequisites
if (!secret || !raw || !sig) {
  throw new Error('signature prerequisites missing');
}

// Compute HMAC-SHA256
const hash = crypto.createHmac('sha256', secret)
  .update(raw, 'utf8')
  .digest('base64');

// Verify signature
if (hash !== sig) {
  $flow.set('forbid', true);
  throw new Error('invalid signature');
}

return $input.all();
```

---

## Setup

**n8n Webhook Node:**
- ✅ Enable "Raw Request Data"
- ✅ Headers: Capture `x-line-signature`

**Environment Variables:**
- `N8N_LINE_SECRET`: LINE Channel Secret from LINE Developers Console

---

## Acceptance Criteria

- ✅ Invalid signature → 403 error, workflow stops
- ✅ Missing secret → Error thrown
- ✅ Valid signature → Continue to next node

---

**Generated:** 2025-11-03 / Cursor (☿)

