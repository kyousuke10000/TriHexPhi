# Bot Behavior Clarification

**Date:** 2025-11-02  
**Question:** Will bot respond to every message?

---

## Current Design

**Bot responds ONLY when:**
1. `/ping` detected → Reply: `pong`
2. Event message detected → Reply: Flex card with RSVP buttons

**Bot ignores:**
- Regular chat messages
- Random messages
- Other users' messages

---

## How It Works

### Message Detection Flow

```
User sends message
  ↓
Webhook → n8n workflow
  ↓
Extract Data: Get message text
  ↓
If /ping? → YES → Reply Pong → END
           ↓ NO
Parse Event: Check for date/time/Zoom URL
           ↓ HAS event → Upsert → Reply Flex → END
           ↓ NO event → END (no reply)
```

### Example Scenarios

**Scenario 1:** User sends `/ping`
- ✅ Bot responds: `pong`
- ✅ Fast response

**Scenario 2:** User posts event:
```
明日のミーティング
2025-11-03 14:00
https://zoom.us/j/xxx?pwd=yyy
```
- ✅ Bot extracts: title, date, Zoom URL
- ✅ Bot responds: Flex card with RSVP
- ✅ Database updated

**Scenario 3:** User says "おはよう"
- ❌ Bot ignores (no reply)
- ❌ Other users don't see bot activity

**Scenario 4:** User chats about weather
- ❌ Bot ignores (no reply)
- ❌ Conversation flows naturally

---

## Configuration

**Response Method:** "手動チャット+応答メッセージ"
- ✅ Webhook responses enabled for triggered messages
- ✅ Manual chat still works (fallback)
- ✅ Users can talk to operator if needed
- ✅ Bot only speaks when triggered

---

## Summary

**Bot is selective:**
- Only responds to specific patterns
- No spam or unnecessary replies
- Group chat stays natural
- Operator can still intervene

**Think of it as:**
- Triggered assistant (like reminder bot)
- Not a conversational chatbot
- Helpful only when needed

---

**Generated:** 2025-11-02 / Cursor (☿)


