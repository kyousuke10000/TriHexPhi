-- TriHex MIZUKAGAMI Memory System
-- Generated: 2025-11-02
-- Purpose: AI observer logs → KOKUYOU crystals → SHINSEN permanence

-- 観測ログ（AI生記録）
CREATE TABLE IF NOT EXISTS public.memory_events (
  id bigserial PRIMARY KEY,
  ai_source text NOT NULL CHECK (ai_source IN ('GPT5','Claude','Gemini','Cursor','Grok','DeepSeek')),
  session_id text,
  user_name text DEFAULT 'shiryu',
  title text,
  content text NOT NULL,
  topics text[],
  created_at timestamptz DEFAULT now()
);

-- 黒曜で構造化済みのノート
CREATE TABLE IF NOT EXISTS public.memory_crystals (
  id bigserial PRIMARY KEY,
  source_ai text[] DEFAULT '{}',
  kokuyou_path text NOT NULL,
  title text,
  summary text,
  related_shinsen_id text,
  created_at timestamptz DEFAULT now()
);

-- By AI view
CREATE OR REPLACE VIEW public.v_memory_by_ai AS
SELECT ai_source, count(*) AS cnt, max(created_at) AS last_seen
FROM public.memory_events
GROUP BY ai_source;

-- Unified memory stream
CREATE OR REPLACE VIEW public.v_memory_unified AS
SELECT 'event' AS kind, id, created_at, ai_source, title, content
FROM public.memory_events
UNION ALL
SELECT 'crystal' AS kind, id, created_at, coalesce((source_ai::text), '{}') AS ai_source, title, summary
FROM public.memory_crystals
ORDER BY created_at DESC;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memory_events_ai ON public.memory_events(ai_source);
CREATE INDEX IF NOT EXISTS idx_memory_events_created ON public.memory_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_crystals_path ON public.memory_crystals(kokuyou_path);

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Purpose:** MIZUKAGAMI → KOKUYOU → SHINSEN pipeline  
**RLS:** To be added in next patch with user_id

<<<<<<< HEAD

=======
>>>>>>> origin/main
