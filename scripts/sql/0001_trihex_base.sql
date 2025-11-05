-- TriHex Base Schema (Minimal)
-- Generated: 2025-11-02
-- Purpose: Core tables for Discord + KYOEN AI

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discord messages table
CREATE TABLE IF NOT EXISTS discord_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_id TEXT UNIQUE NOT NULL,
  channel_id TEXT NOT NULL,
  author_id TEXT NOT NULL REFERENCES members(discord_id),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL,
  indexed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_discord_messages_channel ON discord_messages(channel_id);
CREATE INDEX idx_discord_messages_author ON discord_messages(author_id);
CREATE INDEX idx_discord_messages_created ON discord_messages(created_at);

-- Discord reactions table
CREATE TABLE IF NOT EXISTS discord_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id TEXT NOT NULL REFERENCES discord_messages(discord_id),
  emoji TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES members(discord_id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, emoji, user_id)
);

CREATE INDEX idx_discord_reactions_message ON discord_reactions(message_id);
CREATE INDEX idx_discord_reactions_emoji ON discord_reactions(emoji);

-- KYOEN AI generations table
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team TEXT NOT NULL DEFAULT 'Tokunoshima',
  preset TEXT NOT NULL,
  channel TEXT NOT NULL,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_generations_team ON generations(team);
CREATE INDEX idx_generations_preset ON generations(preset);
CREATE INDEX idx_generations_created ON generations(created_at);

-- Leads table (Tsukutsuku Pack)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  contact TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created ON leads(created_at);

-- Rank snapshots table (Tsukutsuku Pack)
CREATE TABLE IF NOT EXISTS rank_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id TEXT NOT NULL REFERENCES members(discord_id),
  rank_value INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rank_snapshots_member ON rank_snapshots(member_id);
CREATE INDEX idx_rank_snapshots_created ON rank_snapshots(created_at);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE rank_snapshots ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow read for all, write for service role)
CREATE POLICY members_read ON members FOR SELECT TO authenticated USING (true);
CREATE POLICY discord_messages_read ON discord_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY discord_reactions_read ON discord_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY generations_read ON generations FOR SELECT TO authenticated USING (true);
CREATE POLICY leads_read ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY rank_snapshots_read ON rank_snapshots FOR SELECT TO authenticated USING (true);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  record_id UUID NOT NULL,
  changes JSONB DEFAULT '{}',
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);


