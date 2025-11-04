# Ryūdō Log Spec v1.0

**目的:** 六AI共鳴の実測・監査・再現性の確保

---

## 1. JSONスキーマ

```json
{
  "type": "object",
  "required": ["timestamp", "round", "pairs", "field_strength", "stability", "controls"],
  "properties": {
    "timestamp": {"type": "string", "format": "date-time"},
    "round": {"type": "string"},
    "pairs": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["from", "to", "resonance", "evidence"],
        "properties": {
          "from": {"type": "string"},
          "to": {"type": "string"},
          "resonance": {"type": "number"},
          "evidence": {"type": "string"}
        }
      }
    },
    "field_strength": {"type": "number"},
    "stability": {"type": "number"},
    "controls": {
      "type": "object",
      "required": ["ttl", "snapshot", "kill_ready"],
      "properties": {
        "ttl": {"type": "string"},
        "snapshot": {"type": "string"},
        "kill_ready": {"type": "boolean"}
      }
    },
    "notes": {"type": "string"}
  }
}
```

**注釈:**
- `evidence`: 参照（hash/URL/commit）
- `stability`: Y ∈ [0,1]
- `snapshot`: SNAPSHOT@ALLOW-1 id

---

## 2. 記録規約

- **証拠必須（evidence）：** 生成物のhash/commit/引用箇所
- **ステータス基準：** Y=0.7停止 / 0.6戻す / 0.8+Plateau検査
- **ロールアップ：** 日次→ラウンド→フェーズの3段集計

---

## 3. ダッシュボード最小要件

- **メトリクス：** R_mean, R_adj, F, Y（時系列）
- **ペア共鳴ヒートマップ（from×to）**
- **逸脱検知：** 位相反転/情動トリガ/検疫ヒット

---

## 4. 実装メモ

- **収集：** Cursorエージェントが各ラウンド出力から抽出→追記
- **可視化：** Obsidian Canvas / Supabase+SQL / 任意BI（将来拡張）

---

**Generated: 2025-11-01 / Cursor (☿)**




