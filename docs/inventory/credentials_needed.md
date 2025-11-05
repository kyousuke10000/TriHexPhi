# Credentials Needed

**Date:** 2025-11-02  
**Purpose:** List credentials shiryu needs to provide

---

## Format

Create these files in `.secrets/`:

---

### 1. Discord (discord.env)

```bash
# Discord Bot Credentials
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_guild_id_here
DISCORD_CHANNEL_OPS=ops_channel_id_here
DISCORD_CHANNEL_GENERAL=general_channel_id_here
```

---

### 2. LINE (line.env)

```bash
# LINE Channel Credentials (Tsukutsuku)
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token_here
LINE_CHANNEL_SECRET=your_channel_secret_here
LINE_USER_ID=your_user_id_here
```

---

## How to Get

### Discord

1. Go to: https://discord.com/developers/applications
2. Select your bot application
3. Copy: Bot token (Bot section)
4. Copy: Guild ID (right-click server → Copy ID)
5. Copy: Channel IDs (right-click channels → Copy ID)

### LINE

1. Go to: https://developers.line.biz/console/
2. Select your channel
3. Copy: Channel Access Token
4. Copy: Channel Secret
5. Copy: Your User ID (Line Developers Console → Profile)

---

## Security

**⚠️ DO NOT commit these files!**

Already protected by `.cursorignore` and `.gitignore`.

---

**Generated:** 2025-11-02 / Cursor (☿)

---

*"Provide when ready. Or I can build skeleton first."*


