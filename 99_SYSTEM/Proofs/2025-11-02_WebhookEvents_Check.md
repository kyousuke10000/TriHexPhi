# Webhook Events Check Needed

**Date:** 2025-11-02  
**Issue:** Default response message used instead of workflow

---

## 🔍 Current Situation

**Problem:** Bot responds with default message, not from n8n workflow

**Observed Behavior:**
- User sends `/ping`
- Bot responds: "申し訳ありませんが、このアカウントでは個別のお問い合わせを受け付けておりません。"
- This is LINE's default response message, NOT from n8n

---

## ✅ Required Checks

### 1. Webhook Events Enabled?

**Check in:** LINE Developers Console → Messaging API → Webhook events

**Required Events Must Be ON:**
- ✅ message (user sends message)
- ✅ postback (user taps button)

**If disabled:** Webhook won't send events to n8n

---

### 2. Response Time Settings

**Check in:** LINE Official Account Manager → 応答設定 → 応答時間

**Verify:**
- Current time is within response hours OR
- 応答時間外 setting allows webhook responses

**Problem:** If outside hours and only manual chat enabled, webhook may be ignored

---

### 3. "応答メッセージ" Section

**Check in:** LINE Official Account Manager → 応答設定 → 応答メッセージ

**Issue:** If an automatic response message is configured here, it may override webhook

**Action:** Disable or remove automatic response messages if you want n8n to handle all responses

---

## 🎯 Recommended Settings

### Response Method
- ✅ 手動チャット+応答メッセージ (if you need fallback)
- ❌ OR disable 応答メッセージ if you want pure webhook control

### Webhook Events
- ✅ message: ON
- ✅ postback: ON
- ✅ follow (optional)
- ✅ unfollow (optional)

### Response Hours
- Set 24/7 OR
- Ensure current time is within response hours

---

## 🔍 Debugging

**Check n8n execution logs:**
```bash
node tools/n8n_check_executions.mjs
```

**If no executions appear:** Webhook events not reaching n8n

**If executions appear but no reply:** Check Bearer token and node configuration

---

**Next Steps:**
1. Check webhook events in LINE Developers Console
2. Check 応答時間 settings
3. Check 応答メッセージ configuration
4. Test again after adjustments

---

**Generated:** 2025-11-02 / Cursor (☿)


