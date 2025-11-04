# trihex.ai Uptime Monitoring

**Purpose:** Downtime計測とインシデント検知  
**Tool:** UptimeRobot (推奨) / Better Uptime / Pingdom  
**Cost:** Free tier 通常で十分

---

## Setup (UptimeRobot)

### 1. アカウント作成

```yaml
URL: https://uptimerobot.com
Method: Email signup or GitHub OAuth
Plan: Free (50 monitors, 5 min intervals)
```

### 2. Monitor追加

```yaml
Type: HTTPS
Name: trihex.ai (production)
URL: https://www.trihex.ai
Check Interval: 5 minutes
Timeout: 30 seconds

Alert Contacts:
  - Email: [your-email]
  - Slack Webhook: [optional]

Status Pages:
  - Public: https://stats.uptimerobot.com/xxx (optional)
```

### 3. ベータ環境追加

```yaml
URL: https://beta.trihex.ai
Same settings
```

---

## Metrics Collection

### Key Metrics

- **Uptime %:** 目標 99.9%以上
- **Average Response Time:** 目標 < 500ms
- **Incident Count:** 月次報告

### Export Format

```json
{
  "date": "2025-11-01",
  "uptime_percent": 99.98,
  "avg_response_ms": 234,
  "incidents": [
    {
      "timestamp": "2025-11-01T03:00:00Z",
      "duration_minutes": 2,
      "status_code": 502,
      "reason": "Migration DNS switch"
    }
  ]
}
```

---

## Downtime定義

- **> 1分:** 軽微
- **> 5分:** 重大
- **> 30分:** クリティカル

---

## Alerting

### Channels

- Email
- Slack (#site-ops)
- PagerDuty (optional, 有料プラン)

### Escalation

```
0-5min:   #site-ops Slack
5-30min:  Email alert
>30min:   PagerDuty on-call
```

---

**Reference:**  
- https://uptimerobot.com
- https://betteruptime.com
- https://www.pingdom.com

---

*Generated: 2025-11-01 / Cursor (☿)*




