-- Zero Friction Ops Tables
-- Generated: 2025-11-02
-- Purpose: Event detection, RSVP, reminders, card shelf

-- Events table (avoid conflict with existing events table)
CREATE TABLE IF NOT EXISTS tokunoshima_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  zoom_url TEXT,
  ics_url TEXT,
  created_by TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tokunoshima_events_start ON tokunoshima_events(start_at);
CREATE INDEX idx_tokunoshima_events_created ON tokunoshima_events(created_at);

ALTER TABLE tokunoshima_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY tokunoshima_events_read ON tokunoshima_events FOR SELECT TO authenticated USING (true);
CREATE POLICY tokunoshima_events_write ON tokunoshima_events FOR ALL TO service_role USING (true);

-- RSVP table
CREATE TABLE IF NOT EXISTS tokunoshima_rsvp (
  event_id UUID REFERENCES tokunoshima_events(id),
  user_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('going','maybe','mute')) NOT NULL,
  ts TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(event_id, user_id)
);

CREATE INDEX idx_tokunoshima_rsvp_event ON tokunoshima_rsvp(event_id);
CREATE INDEX idx_tokunoshima_rsvp_user ON tokunoshima_rsvp(user_id);

ALTER TABLE tokunoshima_rsvp ENABLE ROW LEVEL SECURITY;
CREATE POLICY tokunoshima_rsvp_read ON tokunoshima_rsvp FOR SELECT TO authenticated USING (true);
CREATE POLICY tokunoshima_rsvp_write ON tokunoshima_rsvp FOR ALL TO service_role USING (true);

-- Line cards table
CREATE TABLE IF NOT EXISTS line_cards (
  key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT,
  meta JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_line_cards_updated ON line_cards(updated_at);

ALTER TABLE line_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY line_cards_read ON line_cards FOR SELECT TO authenticated USING (true);
CREATE POLICY line_cards_write ON line_cards FOR ALL TO service_role USING (true);

COMMENT ON TABLE tokunoshima_events IS 'Zero Friction event detection';
COMMENT ON TABLE tokunoshima_rsvp IS 'RSVP responses (going/maybe/mute)';
COMMENT ON TABLE line_cards IS 'Card shelf for announcements';

