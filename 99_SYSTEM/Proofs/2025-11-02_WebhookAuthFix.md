# Webhook Auth Fix

**Date:** 2025-11-02  
**Issue:** 403 Error on Webhook

---

## Problem

設定でLINEの認証を有効にしたWebhookで403エラー。

原因: **Webhook 受信は認証不要、Reply 送信のみトークンが必要。**

---

## Fix

**Webhookノードから認証を削除**

- `event-detect` ✅
- `rsvp` ✅
- `cards` ✅

**Remaining nodes with LINE token:**
- Reply Flex (HTTP Request)
- Reply Snack (HTTP Request)
- Send DM (HTTP Request)

これらは **HTTP Header Auth** でトークンを付与。

---

## Verify

LINEで `/ping` を送信 → `pong` が返るか確認

---

**Generated:** 2025-11-02 / Cursor (☿)


