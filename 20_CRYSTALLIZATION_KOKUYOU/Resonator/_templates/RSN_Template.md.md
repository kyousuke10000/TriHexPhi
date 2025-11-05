<%*
const intent = await tp.system.prompt("意図（Intent）を一行で？");
if (!intent) { tR += "キャンセル"; return; }
const phase = await tp.system.suggester(["吸","吐","止"], ["吸","吐","止"]);
const mode  = await tp.system.suggester(["軽減","調整","休息"], ["軽減","調整","休息"]);
const anchor_id = tp.date.now("YYYYMMDD_HHmmss") + "_" + intent.replace(/\s+/g,'-').slice(0,32);
tR += `---
type: resonance_log
created: ${tp.date.now("YYYY-MM-DD HH:mm")}
phase: ${phase}
anchor_id: ${anchor_id}
intent: ${intent}
return_mode: ${mode}
---

# Time Resonator Log

- 意図: ${intent}
- 呼吸: ${phase}
- モード: ${mode}
- Anchor: ${anchor_id}

> 吸えば未来、吐けば過去、止めて今、わたしはここ。`
%>