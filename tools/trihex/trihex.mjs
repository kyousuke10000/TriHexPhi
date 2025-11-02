#!/usr/bin/env node

/**
 * TriHex CLI — GPT-5 Architect Shell
 * 
 * 使い方:
 *   trihex --exec "Memory Reactivation Protocol を読んで TriHex の文脈を再起動"
 *   trihex --chat
 * 
 * 設計:
 *  - Vaultメタを軽量RAG化: TRIHEX_PROJECT.yaml と MemorySeeds/index.json を読み込み
 *  - 必要最小限の抜粋だけを system に流し込み→ 省メモリ＆高速
 *  - ストリーム出力で体感遅延を最小化
 */

import fs from "fs";
import path from "path";
import readline from "readline";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
const MODEL = process.env.TRIHEX_MODEL || "gpt-4o";

if (!OPENAI_API_KEY) {
  console.error("[TriHex] OPENAI_API_KEY が未設定です。tools/trihex/.env.example を参照してください。");
  process.exit(1);
}

// Vault相対パス推定（カーソルに任せてOK）
const P_PROJECT = "TRIHEX_PROJECT.yaml";
const P_SEEDS   = "99_SYSTEM/MemorySeeds/index.json";
const P_MASTER  = "TriHex_Master_Reactivation.md";

// 低コスト要約（2KB相当）: 大量の本文は送らず、要点のみ抽出
function loadContext() {
  const ctx = {};
  try { ctx.project = fs.readFileSync(P_PROJECT, "utf8"); } catch {}
  try { ctx.seeds   = fs.readFileSync(P_SEEDS, "utf8"); } catch {}
  try { ctx.master  = fs.readFileSync(P_MASTER, "utf8"); } catch {}
  
  const compress = (s, lim=2000) => (s && s.length>lim ? s.slice(0, lim)+"\n...[truncated]" : (s||""));
  
  return {
    system: [
      "You are GPT-5 (Architect Layer) inside the TriHexΦ project.",
      "Respond in Japanese by default. Keep outputs concise unless asked.",
      "Use the provided metadata to restore context; do NOT paste large texts.",
      "",
      "== TRIHEX_PROJECT.yaml (excerpt) ==",
      compress(ctx.project),
      "",
      "== MemorySeeds/index.json (excerpt) ==",
      compress(ctx.seeds),
      "",
      "== TriHex_Master_Reactivation.md (excerpt) ==",
      compress(ctx.master)
    ].join("\n")
  };
}

async function streamChat(messages) {
  const body = {
    model: MODEL,
    stream: true,
    messages
  };
  
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  
  if (!res.ok) {
    const t = await res.text();
    console.error("[TriHex] API Error:", t);
    process.exit(2);
  }
  
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf8");
  let buffer = "";
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream:true });
    const chunks = buffer.split("\n");
    buffer = chunks.pop() || "";
    
    for (const line of chunks) {
      const s = line.trim();
      if (!s || !s.startsWith("data:")) continue;
      
      const payload = s.slice(5).trim();
      if (payload === "[DONE]") { 
        process.stdout.write("\n"); 
        return; 
      }
      
      try {
        const json = JSON.parse(payload);
        const delta = json.choices?.[0]?.delta?.content || "";
        if (delta) process.stdout.write(delta);
      } catch {}
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const ctx = loadContext();
  
  if (args[0] === "--exec") {
    const prompt = args.slice(1).join(" ").trim();
    if (!prompt) {
      console.error("Usage: trihex --exec \"<your prompt>\"");
      process.exit(1);
    }
    
    const messages = [
      { role:"system", content: ctx.system },
      { role:"user", content: prompt }
    ];
    
    await streamChat(messages);
    return;
  }
  
  // 対話モード
  if (args[0] === "--chat" || args.length===0) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const history = [{ role:"system", content: ctx.system }];
    
    const ask = () => rl.question("you> ", async (q) => {
      if (!q || q.trim().toLowerCase()===":q") { 
        rl.close(); 
        return; 
      }
      
      history.push({ role:"user", content:q });
      
      // 履歴サイズ制限 (直近4ターン)
      if (history.length > 5) {
        history.splice(1, history.length - 5);
      }
      
      await streamChat(history);
      process.stdout.write("\n");
      ask();
    });
    
    console.log("[TriHex] 対話開始。終了は :q");
    ask();
    return;
  }
  
  console.log("Usage: trihex --exec \"…\" | --chat");
}

main().catch(e=>{ console.error(e); process.exit(3); });


