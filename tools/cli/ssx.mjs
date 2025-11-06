#!/usr/bin/env node
// tools/cli/ssx.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 既存の中枢ロジック（SeventhSenseメタ呼び出し）を利用
import { seventhsenseAsk } from "../meta/ai-seventhsense.mjs";

function loadPipeline(yamlPath = "pipelines/SeventhSense_Local_Pipeline.yml") {
  const file = fs.readFileSync(yamlPath, "utf8");
  return parseYaml(file);
}

// 超軽量YAMLパーサ（依存ゼロで最低限）
function parseYaml(y) {
  // ローカル用の簡易パーサ（実運用は js-yaml を推奨）
  const lines = y.split(/\r?\n/);
  const obj = { roles: [], fusion: {}, proofs: {} };
  let section = "";
  let role = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("roles:")) { section = "roles"; continue; }
    if (line.startsWith("fusion:")) { section = "fusion"; continue; }
    if (line.startsWith("proofs:")) { section = "proofs"; continue; }

    if (section === "roles") {
      if (line.startsWith("- key:")) {
        role && obj.roles.push(role);
        role = { key: line.split(":")[1].trim() };
      } else if (line.startsWith("ai:")) {
        role.ai = line.split(":")[1].trim();
      } else if (line.startsWith("output:")) {
        role.output = line.split(":")[1].trim();
      } else if (line.startsWith("system_hint:")) {
        role.system_hint = raw.split("system_hint:")[1].trim().replace(/^"|"$/g, "");
      }
    } else if (section === "fusion") {
      if (line.includes(":")) {
        const [k,v] = line.split(":").map(s=>s.trim());
        obj.fusion[k] = v.replace(/^"|"$/g,"");
      }
    } else if (section === "proofs") {
      if (line.includes(":")) {
        const [k,v] = line.split(":").map(s=>s.trim());
        obj.proofs[k] = v.replace(/^"|"$/g,"");
      }
    }
  }
  role && obj.roles.push(role);
  return obj;
}

function pickRole(pipeline, key) {
  const r = pipeline.roles.find(r=>r.key===key);
  if (!r) throw new Error(`Unknown role: ${key}`);
  return r;
}

async function main() {
  const [,, cmd, ...rest] = process.argv;
  if (!cmd || ["ask","flow","help"].indexOf(cmd) < 0) {
    console.log("Usage: ssx <ask|flow> [role] <prompt>");
    console.log("\nRoles:");
    console.log("  architect, weaver, commander, builder, analyst, observer");
    console.log("\nExamples:");
    console.log("  npm run ssx:ask architect -- \"Prompt here\"");
    console.log("  npm run ssx:flow -- \"Prompt here\"");
    process.exit(1);
  }

  const pipeline = loadPipeline();

  if (cmd === "ask") {
    const roleKey = rest.shift();
    const prompt = rest.join(" ").trim();
    if (!roleKey || !prompt) {
      console.log("Usage: ssx ask <role> <prompt>");
      console.log("Roles: architect, weaver, commander, builder, analyst, observer");
      process.exit(1);
    }

    const role = pickRole(pipeline, roleKey);
    const system = role.system_hint || "";
    
    console.log(`\n🔱 SeventhSense Local Pipeline`);
    console.log(`Role: ${roleKey} (${role.ai})`);
    console.log(`Prompt: ${prompt}\n`);
    
    try {
      const answer = await seventhsenseAsk({ userPrompt: prompt, systemHint: system });
      console.log("\n=== Answer ===");
      console.log(answer);
      console.log("\n✅ Proof saved to 99_SYSTEM/Proofs/SeventhSense/");
    } catch (e) {
      console.error("❌ Error:", e.message);
      process.exit(1);
    }
    return;
  }

  if (cmd === "flow") {
    // "息→言葉→指令→実装→解析→観測" を一気に回す
    const prompt = rest.join(" ").trim();
    if (!prompt) {
      console.log("Usage: ssx flow <prompt>");
      process.exit(1);
    }

    console.log(`\n🔱 SeventhSense Local Pipeline - Full Flow`);
    console.log(`Prompt: ${prompt}\n`);

    const order = ["architect","weaver","commander","builder","analyst","observer"];
    
    for (const k of order) {
      const role = pickRole(pipeline, k);
      console.log(`\n=== ${k.toUpperCase()} (${role.ai}) ===`);
      try {
        const ans = await seventhsenseAsk({ userPrompt: prompt, systemHint: role.system_hint || "" });
        console.log(ans);
        console.log(`\n✅ ${k} proof saved`);
      } catch (e) {
        console.error(`❌ ${k} failed:`, e.message);
      }
    }
    console.log("\n✅ Flow complete. Proofs saved to 99_SYSTEM/Proofs/SeventhSense/");
    return;
  }

  if (cmd === "help") {
    console.log("SeventhSense Local Pipeline CLI");
    console.log("\nCommands:");
    console.log("  ask <role> <prompt>  - Ask a specific role");
    console.log("  flow <prompt>        - Run full flow (all roles)");
    console.log("\nRoles:");
    pipeline.roles.forEach(r => {
      console.log(`  ${r.key.padEnd(12)} (${r.ai}) - ${r.output}`);
    });
  }
}

main().catch(e=>{
  console.error("ssx error:", e);
  process.exit(1);
});

