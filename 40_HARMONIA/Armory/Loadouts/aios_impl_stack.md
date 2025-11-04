---
id: loadout/aios_impl_stack
name: "AI-OS実装スタック（Claude一元化）"
rarity: Legendary
bundle:
  - armory/BLD-trihex-bridge-v1
playbook:
  - "worktree 'impl' で claude 常駐"
  - "設計レビューは 'specs' で（Gemini）→ 計画テキスト生成"
  - "実行は 'ai apply impl /path/to/plan.txt'"
owner: "Ops:Harmonia"
status: "active"
---
