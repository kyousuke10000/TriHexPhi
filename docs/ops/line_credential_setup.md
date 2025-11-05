# LINE Credentials Setup in n8n

**Date:** 2025-11-02  
**Status:** ⏳ Manual setup needed

---

## ❌ NOT LINE Notify OAuth2

**Use:** HTTP Header Authentication  
**Token:** Already obtained channel access token

---

## ✅ Setup Steps

### Option 1: HTTP Header Auth (Recommended)

**For each workflow with LINE HTTP nodes:**

1. Open workflow in n8n UI
2. Find HTTP Request nodes (Reply Flex, Reply Snack, Send DM)
3. Edit node
4. Authentication: **Generic Credential Type → HTTP Header Auth**
5. Set:
   - Header Name: `Authorization`
   - Header Value: `Bearer jffJiSAr5f/YtAthi/rcB3zwP0rew1y8OXPiJH3BSNd31oxheNvg1wT1VaTM7KorLFINWDWwelf1Hx7ptKEd8a9U5clDDerK8shFJtKp1bwCt8BNQhuB5m8LSGKsUhfIX+DX+gXY0kiBhMAXWdW70AdB04t89/1O/w1cDnyilFU=`
6. Save node
7. Repeat for all LINE HTTP nodes

---

### Option 2: Create Reusable Credential

**One-time setup:**

1. Go to Settings → Credentials
2. Add: **HTTP Header Auth**
3. Name: "LINE Bot Token"
4. Header Name: `Authorization`
5. Header Value: `Bearer jffJiSAr5f/YtAthi/rcB3zwP0rew1y8OXPiJH3BSNd31oxheNvg1wT1VaTM7KorLFINWDWwelf1Hx7ptKEd8a9U5clDDerK8shFJtKp1bwCt8BNQhuB5m8LSGKsUhfIX+DX+gXY0kiBhMAXWdW70AdB04t89/1O/w1cDnyilFU=`
6. Save

**Then use in all workflows:**
- Edit HTTP Request nodes
- Authentication: **Generic Credential Type → HTTP Header Auth**
- Select: "LINE Bot Token"

---

## 🔍 Which Nodes Need It

**event-detect:**
- Reply Flex (HTTP Request to LINE API)

**rsvp:**
- Reply Snack (HTTP Request to LINE API)

**reminders:**
- Send DM (HTTP Request to LINE API)

**cards:**
- Reply Cards (HTTP Request to LINE API)

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Not Notify. Messaging API with bearer token."*


