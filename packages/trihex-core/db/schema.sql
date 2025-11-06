-- TriHex AI App - Supabase Schema v1.0
-- Database: trihex_core schema
-- Generated: 2025-11-01

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- ============================================================================
-- SCHEMA: trihex_core
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS trihex_core;

SET search_path TO trihex_core, public;

-- ============================================================================
-- TABLE: events
-- Purpose: Audit log for all system events
-- ============================================================================

CREATE TABLE IF NOT EXISTS trihex_core.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actor TEXT NOT NULL,  -- user_id or service name
  kind TEXT NOT NULL CHECK (kind IN (
    'auth', 'billing', 'publish', 'webhook', 'admin', 'system'
  )),
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_ts ON trihex_core.events(ts DESC);
CREATE INDEX idx_events_kind ON trihex_core.events(kind);
CREATE INDEX idx_events_actor ON trihex_core.events(actor);

-- RLS: Read/write only via Service Role
ALTER TABLE trihex_core.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_service_only"
  ON trihex_core.events
  FOR ALL
  USING (false);

-- ============================================================================
-- TABLE: content
-- Purpose: Knowledge base content (markdown documents)
-- ============================================================================

CREATE TABLE IF NOT EXISTS trihex_core.content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  kind TEXT NOT NULL CHECK (kind IN (
    'constitution', 'codex', 'protocol', 'decision', 'rfc', 'guide'
  )),
  title TEXT NOT NULL,
  body_md TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  slug TEXT UNIQUE,
  author TEXT DEFAULT 'system',
  version TEXT DEFAULT '1.0.0'
);

CREATE INDEX idx_content_kind ON trihex_core.content(kind);
CREATE INDEX idx_content_slug ON trihex_core.content(slug);
CREATE INDEX idx_content_tags ON trihex_core.content USING GIN(tags);

-- RLS: Read for authenticated users, write for editors
ALTER TABLE trihex_core.content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_read_auth"
  ON trihex_core.content
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "content_write_editor"
  ON trihex_core.content
  FOR ALL
  USING (auth.role() = 'authenticated'
    AND (payload->>'role' = 'editor' OR payload->>'role' = 'admin'));

-- ============================================================================
-- TABLE: publish_queue
-- Purpose: Over Drive publishing queue
-- ============================================================================

CREATE TABLE IF NOT EXISTS trihex_core.publish_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  channel TEXT NOT NULL CHECK (channel IN (
    'line', 'x', 'instagram', 'youtube', 'tiktok', 'note', 'mail'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'published', 'failed', 'retrying'
  )),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT,
  retry_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_publish_queue_status ON trihex_core.publish_queue(status);
CREATE INDEX idx_publish_queue_channel ON trihex_core.publish_queue(channel);
CREATE INDEX idx_publish_queue_created ON trihex_core.publish_queue(created_at DESC);

-- RLS: Service Role only
ALTER TABLE trihex_core.publish_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "publish_queue_service_only"
  ON trihex_core.publish_queue
  FOR ALL
  USING (false);

-- ============================================================================
-- FUNCTION: update_updated_at
-- Purpose: Auto-update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION trihex_core.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_updated_at
  BEFORE UPDATE ON trihex_core.content
  FOR EACH ROW
  EXECUTE FUNCTION trihex_core.update_updated_at();

CREATE TRIGGER publish_queue_updated_at
  BEFORE UPDATE ON trihex_core.publish_queue
  FOR EACH ROW
  EXECUTE FUNCTION trihex_core.update_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON SCHEMA trihex_core IS 'TriHex AI App core database schema';
COMMENT ON TABLE trihex_core.events IS 'System audit event log';
COMMENT ON TABLE trihex_core.content IS 'Knowledge base markdown content';
COMMENT ON TABLE trihex_core.publish_queue IS 'Over Drive publishing queue';

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Authenticated users can read content
GRANT USAGE ON SCHEMA trihex_core TO authenticated;
GRANT SELECT ON trihex_core.content TO authenticated;

-- Anon can read public content (if needed)
-- GRANT USAGE ON SCHEMA trihex_core TO anon;
-- GRANT SELECT ON trihex_core.content TO anon;

-- Service role has full access
GRANT ALL ON SCHEMA trihex_core TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA trihex_core TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA trihex_core TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA trihex_core TO service_role;



