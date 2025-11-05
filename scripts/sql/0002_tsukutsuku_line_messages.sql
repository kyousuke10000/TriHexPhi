-- Tsukutsuku Pack: LINE Messages Table
-- Generated: 2025-11-02
-- Purpose: LINE message storage for lead generation

-- Create line_messages table
CREATE TABLE IF NOT EXISTS line_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id TEXT NOT NULL,
  "user" TEXT NOT NULL,
  text TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL,
  hash TEXT UNIQUE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_line_messages_group ON line_messages(group_id);
CREATE INDEX idx_line_messages_user ON line_messages(user);
CREATE INDEX idx_line_messages_created ON line_messages(created_at);
CREATE INDEX idx_line_messages_ts ON line_messages(ts);

-- Enable RLS
ALTER TABLE line_messages ENABLE ROW LEVEL SECURITY;

-- Policies
-- Pack (n8n) can read/write their own messages
CREATE POLICY pack_read ON line_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY pack_write ON line_messages FOR ALL TO service_role USING (true);

-- Link to leads table
ALTER TABLE line_messages ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id);

CREATE INDEX idx_line_messages_lead ON line_messages(lead_id);

-- Audit
COMMENT ON TABLE line_messages IS 'LINE messages for Tsukutsuku Pack lead generation';
COMMENT ON POLICY pack_read ON line_messages IS 'Pack can read all messages for lead processing';
COMMENT ON POLICY pack_write ON line_messages IS 'Service role (n8n) can write messages';

