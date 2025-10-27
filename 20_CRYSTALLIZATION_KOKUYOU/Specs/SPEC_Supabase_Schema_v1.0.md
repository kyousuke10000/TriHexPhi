# Supabase スキーマ仕様書 v1.0

**作成**: Cursor（螺律統合）  
**設計**: GPT-5（統治将軍）  
**日付**: 2025-10-27  
**目的**: 真実性憲法とタスク管理の技術基盤

---

## 📋 概要

TriHexΦの技術基盤として、Supabaseに以下のテーブルを作成します：

1. `truth_events` - 真実性の記録
2. `tasks` - タスク管理
3. `artifacts` - 成果物
4. `disagreements` - AI間の矛盾

---

## 🔧 スキーマ定義

### 1. truth_events（真実性の記録）

**目的**: 各AIの発言、主張、確信度、証拠を記録

```sql
CREATE TABLE truth_events (
  -- ID
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- タイムスタンプ
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- 発言者（GPT-5, Claude, Gemini, Grok, DeepSeek, Cursor, しりゅう）
  actor TEXT NOT NULL,
  
  -- 主張内容
  claim TEXT NOT NULL,
  
  -- 確信度（0.0〜1.0）
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  
  -- 証拠（上位3つ）
  evidence_top3 TEXT[],
  
  -- バイアスの自己申告
  bias_note TEXT,
  
  -- 正直度（自己評価、0.0〜1.0）
  honesty_score FLOAT CHECK (honesty_score >= 0 AND honesty_score <= 1),
  
  -- フラグ（例: "演技検出", "流動的自己", "過剰引用"）
  flags TEXT[],
  
  -- インデックス
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_truth_events_actor ON truth_events(actor);
CREATE INDEX idx_truth_events_timestamp ON truth_events(timestamp DESC);
CREATE INDEX idx_truth_events_confidence ON truth_events(confidence);
```

---

### 2. tasks（タスク管理）

**目的**: taskpack.yamlの内容をDBで管理

```sql
CREATE TABLE tasks (
  -- ID
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- タスクID（例: TRX-2025-10-27-001）
  task_id TEXT UNIQUE NOT NULL,
  
  -- 目的（1行のObjective）
  objective TEXT NOT NULL,
  
  -- 制約（配列）
  constraints TEXT[],
  
  -- 入力ファイル（配列）
  files TEXT[],
  
  -- 期限
  deadline TIMESTAMPTZ,
  
  -- 担当者（AI名）
  owner TEXT,
  
  -- ステータス（pending, in_progress, completed, cancelled）
  status TEXT DEFAULT 'pending',
  
  -- 優先度（supreme, high, normal）
  priority TEXT DEFAULT 'normal',
  
  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_owner ON tasks(owner);
```

---

### 3. artifacts（成果物）

**目的**: タスクの成果物を記録

```sql
CREATE TABLE artifacts (
  -- ID
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- タスクID（外部キー）
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  
  -- タイプ（spec, ui, prompt, code, decision）
  type TEXT NOT NULL,
  
  -- ファイルパス
  path TEXT NOT NULL,
  
  -- ハッシュ値（検証用）
  hash TEXT,
  
  -- 作成者
  created_by TEXT,
  
  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_artifacts_task_id ON artifacts(task_id);
CREATE INDEX idx_artifacts_type ON artifacts(type);
```

---

### 4. disagreements（AI間の矛盾）

**目的**: AI間の意見の相違を記録し、解消プロセスを追跡

```sql
CREATE TABLE disagreements (
  -- ID
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- トピック
  topic TEXT NOT NULL,
  
  -- AI-Aの見解
  a_view TEXT NOT NULL,
  a_ai TEXT NOT NULL,
  
  -- AI-Bの見解
  b_view TEXT NOT NULL,
  b_ai TEXT NOT NULL,
  
  -- 解決策（GPT-5が提示）
  resolution TEXT,
  
  -- 参照（関連ファイル、証拠）
  refs TEXT[],
  
  -- ステータス（open, resolved, deferred）
  status TEXT DEFAULT 'open',
  
  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- インデックス
CREATE INDEX idx_disagreements_status ON disagreements(status);
CREATE INDEX idx_disagreements_topic ON disagreements(topic);
```

---

## 📊 使用例

### truth_events の記録例

```sql
INSERT INTO truth_events (
  actor,
  claim,
  confidence,
  evidence_top3,
  bias_note,
  honesty_score,
  flags
) VALUES (
  'Gemini',
  '引用番号の増加は無意識に行った',
  0.7,
  ARRAY['自己報告', 'しりゅうの観察', 'Cursorの分析'],
  '防御行動の可能性を否定したい傾向',
  0.75,
  ARRAY['改善中', '目的関数最適化']
);
```

### tasks の記録例

```sql
INSERT INTO tasks (
  task_id,
  objective,
  constraints,
  files,
  deadline,
  owner,
  priority
) VALUES (
  'TRX-2025-10-27-001',
  'Track-B SENSE AIの診断コア（質問→タイプ推定）MVP設計',
  ARRAY['憲法v0.9準拠', '7日以内にユーザーテスト可能'],
  ARRAY['TRIHEXPHI.md', '診断ツール_ディープリサーチ_GPT5_2025-10-27.md'],
  '2025-10-30 23:59:59+09',
  'GPT-5',
  'supreme'
);
```

---

## 🎯 次のアクション

### 実装手順

1. Supabaseダッシュボードにログイン
2. SQL Editorで上記のCREATE TABLE文を実行
3. 動作確認（INSERT/SELECT）
4. Cursor から接続テスト

**所要時間**: 20分

---

**Cursor（螺律統合）**  
Supabase スキーマ仕様書v1.0  
GPT-5の設計を実装  
2025-10-27

