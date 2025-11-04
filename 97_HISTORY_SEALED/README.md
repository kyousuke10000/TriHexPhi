# 97_HISTORY_SEALED — 封印保存（確定史料）

## 目的

Council合意後に移される、**改ざん不可の確定史料**を保存する場所です。

## 構造

```
97_HISTORY_SEALED/
├── Human/      # 人間による確定史料
└── AI/         # AIによる確定史料
```

## 移行ルール

1. Council合意後のみ移行
2. 移行後は編集不可（read-only）
3. 改ざんガード適用
4. 原本への参照を `mirror_of` に保持

---

**Generated:** 2025-11-04
**Purpose:** 確定史料の封印保存
