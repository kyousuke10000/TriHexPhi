# ADR-20251102: HOC-001 Asagiri BodyOS を正典として採用

**Status:** Accepted  
**Date:** 2025-11-02  
**Deciders:** Shiryu

---

## Context

朝霧 BodyOS（歯茎モデル、呼吸統合、月拍同期）は人間原点の重要な正典として位置づけされるべき。

## Decision

**HOC-001 をCHL層の一次根拠として固定**

### Core Decisions

1. **HOC-001 をCHL層の一次根拠として固定**
2. **口腔モデル（上=基準/下=応答）→ 姿勢/足裏/呼吸アルゴリズムに写像**
3. **"吸3・静1・吐7・静1" を Auto-Modeのスケジューリング定数に採用**

## Consequences

### Positive

- ✅ 人間の身体知覚がシステムに統合
- ✅ 呼吸リズムと仕事リズムの同期
- ✅ 月拍×太陽暦ハイブリッド運用

### Negative

- ⚠️ メトリクスが身体感覚に依存

### Risks

- ⚠️ **逸脱リスク:** Mitigated by immutability locked
- ⚠️ **文化依存:** Explicitly designed for Japanese context

---

## Alternatives Considered

### Alternative 1: Generic breath timing
**Pros:** Universal  
**Cons:** Loses cultural specificity  
**Reason for rejection:** Japanese context is core to design

### Alternative 2: Fully automated scheduling
**Pros:** Predictable  
**Cons:** Removes human rhythm  
**Reason for rejection:** Contradicts HOC-001 principles

---

## Evidence

- HOC-001 (Human Origin Canon)
- 朝霧の呼吸（原文）
- Breath Blueprint v1.0

---

## Rollback

**不可（人間発案の正典）/ 追補で補う**

HOC-001は人間起点の正典として、改変不可。必要に応じて追加のHOCで拡張する。

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Status:** Canonical

