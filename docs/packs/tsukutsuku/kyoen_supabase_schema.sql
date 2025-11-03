-- KYOEN AI - Supabaseテーブル作成スクリプト
-- 実行方法: SupabaseのSQL Editorで実行

-- ========================================
-- 1. メッセージ保存テーブル
-- ========================================

create table if not exists kyoen_messages (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz default now(),
  line_group_id text,
  line_user_id text,
  text text,
  intent text check (intent in ('event', 'rsvp', 'task', 'question', 'link', 'misc', 'meeting', 'card')),
  meta jsonb,
  
  -- インデックス
  created_at timestamptz default now()
);

-- インデックス作成
create index if not exists idx_kyoen_messages_intent on kyoen_messages(intent);
create index if not exists idx_kyoen_messages_ts on kyoen_messages(ts desc);
create index if not exists idx_kyoen_messages_user on kyoen_messages(line_user_id);
create index if not exists idx_kyoen_messages_group on kyoen_messages(line_group_id);

comment on table kyoen_messages is 'LINEから受信した全メッセージを保存';
comment on column kyoen_messages.intent is 'メッセージの意図分類 (event/rsvp/task/question/link/misc/meeting/card)';

-- ========================================
-- 2. イベント管理テーブル
-- ========================================

-- 既存のtokunoshima_eventsを使う場合はスキップ
-- 新規に作る場合は以下を使用

create table if not exists kyoen_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text not null,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  location text,
  zoom_url text,
  line_thread_ts text,
  created_by text,
  meta jsonb,
  
  -- 状態管理
  status text check (status in ('draft', 'confirmed', 'cancelled')) default 'confirmed',
  updated_at timestamptz default now()
);

-- インデックス
create index if not exists idx_kyoen_events_start on kyoen_events(start_at desc);
create index if not exists idx_kyoen_events_status on kyoen_events(status);

comment on table kyoen_events is 'イベント情報を管理';

-- ========================================
-- 3. RSVP（参加管理）テーブル
-- ========================================

create table if not exists kyoen_rsvp (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references kyoen_events(id) on delete cascade,
  line_user_id text not null,
  status text check (status in ('yes', 'no', 'maybe')) not null,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- 同じユーザーが同じイベントに複数回回答できないように
  unique(event_id, line_user_id)
);

-- インデックス
create index if not exists idx_kyoen_rsvp_event on kyoen_rsvp(event_id);
create index if not exists idx_kyoen_rsvp_user on kyoen_rsvp(line_user_id);
create index if not exists idx_kyoen_rsvp_status on kyoen_rsvp(status);

comment on table kyoen_rsvp is 'イベントへの参加状況を管理';

-- ========================================
-- 4. 会議ログテーブル
-- ========================================

create table if not exists kyoen_meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  zoom_url text,
  notes text,
  summary text,
  meta jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- インデックス
create index if not exists idx_kyoen_meetings_start on kyoen_meetings(start_at desc);

comment on table kyoen_meetings is '会議情報と議事録を管理';

-- ========================================
-- 5. 告知カード生成履歴テーブル
-- ========================================

create table if not exists kyoen_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  when_text text,
  where_text text,
  image_url text,
  posted_to text[],
  created_at timestamptz default now(),
  meta jsonb
);

-- インデックス
create index if not exists idx_kyoen_cards_created on kyoen_cards(created_at desc);

comment on table kyoen_cards is '生成された告知カードの履歴';

-- ========================================
-- 6. リンク保存テーブル（オプション）
-- ========================================

create table if not exists kyoen_links (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  title text,
  description text,
  line_user_id text,
  line_group_id text,
  created_at timestamptz default now(),
  meta jsonb
);

-- インデックス
create index if not exists idx_kyoen_links_created on kyoen_links(created_at desc);
create index if not exists idx_kyoen_links_group on kyoen_links(line_group_id);

comment on table kyoen_links is 'LINEで共有されたリンクを保存';

-- ========================================
-- 7. タスク管理テーブル（オプション）
-- ========================================

create table if not exists kyoen_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to text,
  due_date timestamptz,
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  line_user_id text,
  line_group_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  meta jsonb
);

-- インデックス
create index if not exists idx_kyoen_tasks_status on kyoen_tasks(status);
create index if not exists idx_kyoen_tasks_assigned on kyoen_tasks(assigned_to);
create index if not exists idx_kyoen_tasks_due on kyoen_tasks(due_date);

comment on table kyoen_tasks is 'タスク管理';

-- ========================================
-- 8. RLS (Row Level Security) 設定
-- ========================================

-- 一旦全てのテーブルでRLSを無効化（開発中）
-- 本番環境では適切なポリシーを設定すること

alter table kyoen_messages disable row level security;
alter table kyoen_events disable row level security;
alter table kyoen_rsvp disable row level security;
alter table kyoen_meetings disable row level security;
alter table kyoen_cards disable row level security;
alter table kyoen_links disable row level security;
alter table kyoen_tasks disable row level security;

-- ========================================
-- 9. 便利なビュー
-- ========================================

-- イベント参加状況サマリ
create or replace view kyoen_event_summary as
select 
  e.id,
  e.title,
  e.start_at,
  e.location,
  count(case when r.status = 'yes' then 1 end) as going_count,
  count(case when r.status = 'no' then 1 end) as not_going_count,
  count(case when r.status = 'maybe' then 1 end) as maybe_count,
  count(*) as total_responses
from kyoen_events e
left join kyoen_rsvp r on e.id = r.event_id
group by e.id, e.title, e.start_at, e.location
order by e.start_at desc;

comment on view kyoen_event_summary is 'イベントごとの参加状況サマリ';

-- 最近の会話履歴
create or replace view kyoen_recent_messages as
select 
  id,
  ts,
  line_user_id,
  text,
  intent,
  created_at
from kyoen_messages
order by ts desc
limit 100;

comment on view kyoen_recent_messages is '最近100件のメッセージ';

-- ========================================
-- 10. 初期データ（テスト用）
-- ========================================

-- テストイベント
insert into kyoen_events (title, start_at, location, created_by)
values 
  ('KYOEN勉強会', '2025-11-15 19:00:00+09', 'オンライン', 'system')
on conflict do nothing;

-- ========================================
-- 11. 関数: 古いデータの削除（オプション）
-- ========================================

create or replace function cleanup_old_messages()
returns void as $$
begin
  -- 3ヶ月以上前のメッセージを削除
  delete from kyoen_messages
  where ts < now() - interval '3 months';
end;
$$ language plpgsql;

comment on function cleanup_old_messages is '3ヶ月以上前のメッセージを削除（定期実行推奨）';

-- ========================================
-- 12. トリガー: updated_at自動更新
-- ========================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger kyoen_events_updated_at
  before update on kyoen_events
  for each row
  execute function update_updated_at();

create trigger kyoen_rsvp_updated_at
  before update on kyoen_rsvp
  for each row
  execute function update_updated_at();

create trigger kyoen_meetings_updated_at
  before update on kyoen_meetings
  for each row
  execute function update_updated_at();

create trigger kyoen_tasks_updated_at
  before update on kyoen_tasks
  for each row
  execute function update_updated_at();

-- ========================================
-- 完了！
-- ========================================

-- 確認: テーブル一覧
select table_name 
from information_schema.tables 
where table_schema = 'public' 
  and table_name like 'kyoen_%'
order by table_name;
