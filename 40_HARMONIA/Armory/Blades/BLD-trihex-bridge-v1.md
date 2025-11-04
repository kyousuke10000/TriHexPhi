---
id: armory/BLD-trihex-bridge-v1
class: Blade
name: "trihex-bridge（計画→実行）"
rarity: Epic
role: "Web版GPTの実行計画（MKDIR/WRITE/RUN/MOVE）をローカルで安全実行"
mirror_of: "/tools/trihex-bridge.mjs"
trigger: manual
safety: ["no-overwrite","path-escape-block","proof-log"]
owner: "Ops:Harmonia"
version: "1.0.0"
status: "active"
---

# 使い方

```bash
tools/bin/ai plan > /tmp/plan.txt
tools/bin/ai apply impl /tmp/plan.txt
```
