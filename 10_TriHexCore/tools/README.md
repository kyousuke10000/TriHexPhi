# 🔧 TriHexΦ Tools

**Bブロック最小MVP**: 六螺旋スキャン＆真因プロファイル

---

## 📋 ツール一覧

### 1. spiral_scan.py

**役割**: テキストから六螺旋スコアを計算

**使用法**:
```bash
# 標準出力
python tools/spiral_scan.py capture/2025-10-28_example.md

# ファイル出力
python tools/spiral_scan.py capture/2025-10-28_example.md --output structure/2025-10-28_example_scan.json
```

**出力例**:
```json
{
  "spiral_scores": {
    "autonomy": 0.75,
    "connection": 0.60,
    "growth": 0.85,
    "purpose": 0.90,
    "identity": 0.50,
    "liberation": 0.40
  },
  "cause_profile": {
    "primary": "purpose",
    "phase": "search",
    "intensity": 0.90,
    "secondary": "growth"
  },
  "insights": [
    "Purposeを探索中です。",
    "六螺旋のバランスに偏りがあります。"
  ]
}
```

---

### 2. cause_profile.py

**役割**: 六螺旋スコアから真因プロファイルを生成

**使用法**:
```bash
python tools/cause_profile.py structure/2025-10-28_example_scan.json
```

**出力例**:
```json
{
  "profile": {
    "primary_spiral": "purpose",
    "phase": "search",
    "intensity": 0.90,
    "cause_type": {
      "id": "purpose_deficiency",
      "name": "目的の不明確さ",
      "description": "意味の喪失、方向性の欠如",
      "recommendations": [
        "価値観の明確化",
        "使命の探索"
      ]
    },
    "balance": {
      "max": 0.90,
      "min": 0.40,
      "range": 0.50,
      "balanced": false
    },
    "recommended_reviewers": [
      "Grok"
    ]
  }
}
```

---

## 🔄 Knowledge Relayでの使用

### Step 1: Capture → Structure

```bash
# 1. Cursorが capture/ にログを保存

# 2. spiral_scan.py でスキャン
python tools/spiral_scan.py capture/2025-10-28_log.md \
  --output structure/2025-10-28_log_scan.json

# 3. cause_profile.py でプロファイル生成
python tools/cause_profile.py structure/2025-10-28_log_scan.json \
  > structure/2025-10-28_log_profile.json
```

### Step 2: Structure → Insight

```bash
# プロファイルの recommended_reviewers に基づいて、
# 各AI専門家に振り分け
```

---

## 🚀 自動化（計画）

**ai_sync.yml** ワークフローで毎日09:00 JSTに自動実行:

```yaml
1. capture/ の新規ファイルを検知
2. spiral_scan.py で自動スキャン
3. cause_profile.py でプロファイル生成
4. GPT-5レビュー依頼Issue自動生成
```

---

## 📊 アルゴリズム（MVP版）

### キーワードベース

現在のMVP版は**キーワードマッチング**で実装：

```python
SPIRAL_KEYWORDS = {
    'autonomy': ['自律', '独立', '選択', ...],
    'connection': ['つながり', '関係', '共感', ...],
    'growth': ['成長', '学習', '進化', ...],
    'purpose': ['目的', '意味', '価値', ...],
    'identity': ['アイデンティティ', '自己', ...],
    'liberation': ['解放', '自由', '開放', ...]
}
```

### 将来の改善

- **TF-IDF**: キーワードの重要度を考慮
- **BERT/Transformer**: 文脈理解
- **感情分析**: ポジティブ/ネガティブの判定
- **位相判定の高度化**: 文脈から欠乏/探索/充足を判定

---

## 🧪 テスト

```bash
# サンプルテキストでテスト
echo "私は成長したい。新しいスキルを学びたい。目的を見つけたい。" \
  > test_input.txt

python tools/spiral_scan.py test_input.txt
python tools/cause_profile.py <spiral_scan_output.json>
```

---

## 📚 関連ドキュメント

- [configs/trihex.routes.yml](../configs/trihex.routes.yml) - ルーティング規則
- [capture/README.md](../capture/README.md) - 入力ログ
- [structure/README.md](../structure/README.md) - 構造化出力

---

**作成**: 2025-10-28  
**バージョン**: 0.1.0-mvp  
**ステータス**: Bブロック最小MVP

