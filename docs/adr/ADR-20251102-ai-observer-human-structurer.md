# ADR-20251102: AIは観測者／人は構造化者

**Status:** Accepted  
**Date:** 2025-11-02  
**Deciders:** Shiryu, Cursor (☿)

---

## Context

仕様ドリフトで設計図が歪む課題。AIが構造化を試みて設計意図が混濁。

## Decision

**AIはログ取り専門。構造化は黒曜でのみ実施。真泉Φに統合保存。**

### Pipeline

1. **MIZUKAGAMI:** AI raw logs
2. **KOKUYOU:** Human structuring
3. **SHINSEN:** Supabase persistence

## Consequences

### Positive

- ✅ 設計意図の明確化
- ✅ AI横断のメモリ統合
- ✅ 人の意味付けが保全される

### Negative

- ⚠️ 手動レビューが必要
- ⚠️ 自動構造化は不可

### Risks

- ⚠️ **AI逸脱リスク:** Mitigated by canonical paths & workflows
- ⚠️ **Sync delay:** Mitigated by `[deploy]` trigger

---

## Alternatives Considered

### Alternative 1: AI auto-structuring
**Pros:** Fast, automated  
**Cons:** Design drift, loss of human intent  
**Reason for rejection:** Defeats purpose of maintaining canonical design

### Alternative 2: Hybrid AI-assisted
**Pros:** Human oversight, AI efficiency  
**Cons:** Ambiguity in authority  
**Reason for rejection:** Clean separation required

---

## Evidence

- TRIHEXPHI Constitution Article 0 (Transparency)
- Memory Contract v1
- Genesis Protocol v3.1

---

## Notes

- RLS (Row Level Security) to be added in next patch
- `user_id` field will enforce private access
- Auto-Mode v1 compatibility maintained

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Status:** Canonical

