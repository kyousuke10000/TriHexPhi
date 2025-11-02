# Over Drive Series – Concept Book v1

**Version:** 1.0  
**Date:** 2025-11-01  
**Status:** Draft / 検討中  
**AI Generated:** Harmonia Council

---

## Executive Summary

**Over Drive Series** is a LINE-mothership SNS automation engine unifying 7 platforms under AI-driven Breath-based workflow management.

### Core Value Proposition

**"One Breath, Seven Voices"**

Generate once in LINE, automatically optimize and distribute across X, Instagram, YouTube, TikTok, Note, and Email with platform-specific intelligence.

---

## Architecture Overview

### Mothership Model

```
┌─────────────────────────────────────────┐
│     LINE Over Drive (Mothership)        │
│  • Central content creation             │
│  • Master workflow orchestration        │
│  • Unified analytics dashboard          │
│  • AI-powered content generation        │
└─────────────────┬───────────────────────┘
                  │
         ┌────────┴─────────┐
         │  Distribution Hub│
         │  (n8n Workflow)  │
         └────────┬─────────┘
                  │
    ┌─────────────┼──────────────┬─────────┬──────────┐
    ↓             ↓              ↓         ↓          ↓
┌────────┐  ┌──────────┐  ┌──────────┐ ┌──────┐ ┌──────┐
│   X    │  │Instagram │  │ YouTube  │ │TikTok│ │ Note │
│ Over   │  │   Over   │  │   Over   │ │ Over │ │ Over │
│Drive   │  │  Drive   │  │  Drive   │ │Drive │ │Drive │
└────────┘  └──────────┘  └──────────┘ └──────┘ └──────┘
                                   │
                                   ↓
                            ┌──────────┐
                            │  Mail    │
                            │  Over    │
                            │  Drive   │
                            └──────────┘
```

### Content Workflow (Breath-based)

```
Inhale (Input)
  ↓
│ • Topic / Brief
│ • Target KPI
│ • Platform selection
│
↓
Structure (Process)
  ↓
│ • AI content generation
│ • Harmonia Council review
│ • Platform-specific optimization
│ • Compliance check (7 Guardrails)
│
↓
Exhale (Output)
  ↓
│ • Auto-distribute to selected platforms
│ • Schedule posting
│ • Engagement tracking
│ • Performance analytics
│
↓
Stillness (Analysis)
  ↓
│ • KPI measurement
│ • Learn & optimize
│ • Report generation
```

---

## Platform-Specific Strategies

### LINE Over Drive (Mothership)

**Role:** Central command center  
**Features:**
- Content creation interface
- Workflow orchestration
- Analytics aggregation
- AI assistant integration

**Content Type:**
- Mixed format (text + images + links)
- Rich messaging
- Deep linking to TriHex Academy

---

### X Over Drive (X連動)

**Role:** Viral amplification  
**Content Optimization:**
- 140-character hook
- Strategic hashtags (#TriHex #Harmonia)
- Thread support (long-form via replies)
- Engagement bait (questions, polls)

**Posting Strategy:**
- Peak hours: 7-9am, 12-1pm, 7-9pm JST
- Frequency: 3-5 posts/day
- Content mix: 40% original, 40% curation, 20% engagement

---

### Instagram Over Drive (ビジュアル)

**Role:** Aesthetic storytelling  
**Content Optimization:**
- Carousel posts (swipe storytelling)
- Reels (15-30s hooks)
- Stories (behind-the-scenes)
- IGTV (longer tutorials)

**Posting Strategy:**
- Visual first, text second
- Consistent aesthetic (brand colors)
- UGC amplification
- Hashtag strategy (mix of popular + niche)

---

### YouTube Over Drive (映像)

**Role:** Deep education  
**Content Optimization:**
- SEO-optimized titles
- Thumbnail A/B testing
- Chapter markers
- Call-to-action cards

**Posting Strategy:**
- Weekly main video (10-15 min)
- Short-form supplements (60-90s)
- Live streaming (monthly Q&A)
- Playlist organization

---

### TikTok Over Drive (ショート)

**Role:** Trend jumping  
**Content Optimization:**
- Hook-first structure (first 3 seconds)
- Trending sounds
- Quick value delivery (15-60s)
- Caption punchlines

**Posting Strategy:**
- Daily posting
- Trend participation
- Authentic behind-the-scenes
- Educational moments

---

### Note Over Drive (長文)

**Role:** Thought leadership  
**Content Optimization:**
- In-depth articles (1500-3000 words)
- Personal narratives
- Data-driven insights
- Link to TriHex Academy

**Posting Strategy:**
- Weekly long-form
- Series approach
- SEO-friendly
- Repurpose to blog/medium

---

### Mail Over Drive (リレーション)

**Role:** Relationship building  
**Content Optimization:**
- Newsletter digest
- Personal touch
- Exclusive content
- Direct CTA

**Posting Strategy:**
- Weekly newsletter
- Segmented lists
- Behavior-triggered emails
- Automated nurture sequences

---

## Pricing Models

### Tier 1: Starter (個人)
- **Price:** ¥9,800/month
- **Features:**
  - 3 platforms (LINE + X + Instagram)
  - 50 posts/month
  - Basic AI generation
  - Analytics dashboard

### Tier 2: Business (中小企業)
- **Price:** ¥29,800/month
- **Features:**
  - All 7 platforms
  - 200 posts/month
  - Advanced AI + Harmonia Council
  - Custom workflows
  - Priority support

### Tier 3: Enterprise (大企業)
- **Price:** Custom quote
- **Features:**
  - Unlimited posts
  - API integration
  - White-label option
  - Dedicated account manager
  - SLA guarantee

---

## Implementation Roadmap

### Phase 1: MVP (Q1 2026)
- **Scope:** LINE + X + Instagram
- **Timeline:** 3 months
- **Deliverables:**
  - Basic workflow automation
  - Simple AI generation
  - Analytics v1

### Phase 2: Expanded (Q2 2026)
- **Scope:** + YouTube + TikTok + Note
- **Timeline:** 2 months
- **Deliverables:**
  - Advanced AI features
  - Harmonia Council integration
  - Enhanced analytics

### Phase 3: Enterprise (Q3 2026)
- **Scope:** + Mail + Custom features
- **Timeline:** 2 months
- **Deliverables:**
  - Full platform support
  - Enterprise features
  - White-label option

---

## Technical Stack

**Backend:**
- Supabase (Database + Auth)
- n8n (Workflow automation)
- Node.js/TypeScript (API layer)
- Python (AI processing)

**Frontend:**
- Next.js (LP + Dashboard)
- React (Admin panel)
- Tailwind CSS (Styling)

**AI Integration:**
- Harmonia Council (Content generation)
- Claude / GPT-5 (Quality check)
- Gemini (Visual optimization)

**Third-party APIs:**
- LINE Messaging API
- X API v2
- Instagram Basic Display API
- YouTube Data API
- TikTok Business API
- Note API
- Email service (SendGrid/AWS SES)

---

## Success Metrics (KPI)

### Engagement Metrics
- Reach (unique users)
- Impressions (total views)
- Engagement rate
- Click-through rate (CTR)
- Conversion rate

### Content Quality
- AI generation accuracy
- Platform optimization score
- Compliance pass rate (7 Guardrails)
- User satisfaction

### Business Metrics
- Monthly active users (MAU)
- Revenue per user (ARPU)
- Churn rate
- Net promoter score (NPS)

---

## Risk Assessment

### Technical Risks
- **API rate limits:** Mitigation: Intelligent throttling
- **Platform policy changes:** Mitigation: Regular compliance updates
- **AI content quality:** Mitigation: Human review layer

### Business Risks
- **Market saturation:** Mitigation: Unique value prop (Breath-based)
- **Competition:** Mitigation: First-mover + AI advantage
- **User adoption:** Mitigation: Freemium tier

---

## Next Steps

1. **LP制作方針決定** (本会議議題)
2. **Pitch Deck作成** (投資家向け)
3. **MVP プロトタイプ** (3ヶ月)
4. **ベータテスト** (限定ユーザー)
5. **正式リリース** (Q1 2026)

---

**Generated by: Harmonia Council**  
**Date:** 2025-11-01  
**Version:** 1.0 Draft

---

*"One Breath, Seven Voices"*  
— Over Drive Series
