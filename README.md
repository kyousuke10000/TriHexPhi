# TriHex AI App

**Version:** 0.1.0  
**Status:** Development  
**Stack:** Next.js 16 + TypeScript + Tailwind + Supabase + Stripe

---

## Overview

TriHex AI App is the operational platform for the TriHexΦ system, integrating:
- **Knowledge Base**: Memory Stack (Constitution, Protocols, Codex)
- **Authentication**: Supabase Auth
- **Billing**: Stripe Checkout + Subscription
- **Publishing**: Over Drive multi-channel distribution (LINE/X/YouTube/etc)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Copy `.env.local` and fill in your credentials:

```bash
cp .env.local .env.local.example
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- Publishing API keys (LINE, X, YouTube, etc.)

### 3. Setup Database

Run the schema SQL in your Supabase project:

```bash
cat packages/trihex-core/db/schema.sql | psql $DATABASE_URL
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Architecture

```
trihex-ai-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Main dashboard
│   ├── knowledge/         # Memory Stack viewer
│   ├── studio/            # Publishing studio
│   └── settings/          # Profile/Billing
├── lib/                   # Shared utilities
│   ├── supabase/          # Supabase client
│   ├── stripe/            # Stripe client
│   └── publishers/        # Over Drive channels
├── components/            # React components
├── packages/
│   └── trihex-core/       # Memory Stack submodule
└── db/                    # Supabase schema
```

---

## Features

### Memory Stack Integration

The `packages/trihex-core` submodule contains the TriHexΦ Memory Stack:
- Constitution, Protocols, Decision logs
- Ryudo Field definitions
- Harmonia Council breath logs

Rendered at `/knowledge/*` routes.

### Over Drive Publishing

Multi-channel content distribution:
1. Create content in `/studio`
2. Queue to channels (LINE, X, YouTube, etc.)
3. Automatic retry with exponential backoff
4. Audit trail in `publish_queue`

### Billing & Subscriptions

- Stripe Checkout for subscription signup
- Customer Portal for management
- Webhook sync to Supabase `events` table
- RLS-based access control

---

## Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm test
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect Vercel project
3. Add environment variables
4. Deploy

### Manual

```bash
vercel --prod
```

---

## License

Copyright © 2025 TriHexΦ Project  
See `packages/trihex-core/LICENSE` for full details.

---

**Reference:**  
- [Memory Stack](packages/trihex-core/)  
- [TriHexΦ Constitution](packages/trihex-core/10_TriHexCore/system/Constitution.md)



