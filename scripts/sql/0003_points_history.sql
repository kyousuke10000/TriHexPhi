-- Points History Table
-- Generated: 2025-11-02
-- Purpose: Track points/returns for visualization

CREATE TABLE IF NOT EXISTS points_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  source TEXT NOT NULL,
  balance NUMERIC(10,2) NOT NULL,
  ts TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_points_history_user ON points_history(user_id);
CREATE INDEX idx_points_history_date ON points_history(date);
CREATE INDEX idx_points_history_source ON points_history(source);

ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY points_history_read ON points_history FOR SELECT TO authenticated USING (true);
CREATE POLICY points_history_write ON points_history FOR ALL TO service_role USING (true);

COMMENT ON TABLE points_history IS 'Points and returns history for Tsukutsuku visualization';
COMMENT ON COLUMN points_history.user_id IS 'User identifier';
COMMENT ON COLUMN points_history.amount IS 'Points change amount';
COMMENT ON COLUMN points_history.source IS 'Source of points (purchase/referral/bonus/etc)';
COMMENT ON COLUMN points_history.balance IS 'Balance after this transaction';


