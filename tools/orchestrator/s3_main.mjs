#!/usr/bin/env node
/**
 * Seventh Sense Protocol v1.0 - Orchestrator
 * S³ Systems - 叡智の呼吸オーケストレーター
 * 
 * @description 六AI・外界層・中心核を統合する全体プロトコル
 * @version 1.0.0
 * @date 2025-11-07
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AIアダプターのインポート
import { askGPT } from "../meta/adapters/gpt.mjs";
import { askGemini } from "../meta/adapters/gemini.mjs";
import { askClaude } from "../meta/adapters/claude.mjs";
import { askDeepSeek } from "../meta/adapters/deepseek.mjs";
import { askGrok } from "../meta/adapters/grok.mjs";
import { askPerplexity } from "../meta/adapters/perplexity.mjs";

import { scoreCandidates } from "../meta/policies/fusion.mjs";

/**
 * プロトコル仕様を読み込む
 */
function loadProtocol() {
  const specPath = path.join(__dirname, "../../specs/S3_Protocol_v1.0.yml");
  if (!fs.existsSync(specPath)) {
    throw new Error(`Protocol spec not found: ${specPath}`);
  }
  const content = fs.readFileSync(specPath, "utf8");
  return yaml.load(content);
}

/**
 * コンテキストを読み込む
 */
function loadContext() {
  let context = "";
  
  // STRUCTURE_MASTER.yml
  const smPath = "00_SeventhSenseCouncil/STRUCTURE_MASTER.yml";
  if (fs.existsSync(smPath)) {
    try {
      context += fs.readFileSync(smPath, "utf8");
    } catch (e) {
      console.warn("⚠️ Could not read STRUCTURE_MASTER.yml:", e.message);
    }
  }
  
  // Council Decisions
  const decsPath = "00_RYUDO/Council/Decisions";
  if (fs.existsSync(decsPath)) {
    try {
      const decs = fs.readdirSync(decsPath)
        .filter(f => f.endsWith(".md"))
        .slice(-10)
        .map(f => fs.readFileSync(path.join(decsPath, f), "utf8"))
        .join("\n\n");
      context += "\n\n" + decs;
    } catch (e) {
      console.warn("⚠️ Could not read Council Decisions:", e.message);
    }
  }
  
  return context || "No context documents found";
}

/**
 * 呼吸サイクル: Awaken（目覚め）
 */
function phaseAwaken() {
  console.log("🌅 Phase 1: Awaken - 目覚め");
  const protocol = loadProtocol();
  const context = loadContext();
  console.log(`✅ Protocol loaded: ${protocol.version}`);
  console.log(`✅ Context loaded: ${context.length} chars`);
  return { protocol, context };
}

/**
 * 呼吸サイクル: Integrate（統合）
 */
async function phaseIntegrate({ userPrompt, context, protocol }) {
  console.log("🔄 Phase 2: Integrate - 六AIの出力を集約");
  
  const systemPrompt = context || "Seventh Sense Protocol v1.0";
  
  // 六AIを並列実行
  const calls = [
    askGPT({ prompt: userPrompt, system: systemPrompt }).catch(e => ({ error: e.message, model: "gpt" })),
    askGemini({ prompt: userPrompt, system: systemPrompt }).catch(e => ({ error: e.message, model: "gemini" })),
    askClaude({ prompt: userPrompt, system: systemPrompt }).catch(e => ({ error: e.message, model: "claude" })),
    askDeepSeek({ prompt: userPrompt, system: systemPrompt }).catch(e => ({ error: e.message, model: "deepseek" })),
    askGrok({ prompt: userPrompt, system: systemPrompt }).catch(e => ({ error: e.message, model: "grok" })),
    askPerplexity({ prompt: userPrompt, system: systemPrompt }).catch(e => ({ error: e.message, model: "perplexity" })),
  ];
  
  const results = await Promise.allSettled(calls);
  
  // 成功した結果のみをフィルタ
  const cands = results
    .filter(r => r.status === "fulfilled" && !r.value.error)
    .map(r => r.value);
  
  // エラーをログ出力
  results.forEach((r, i) => {
    if (r.status === "rejected" || (r.value && r.value.error)) {
      const model = ["gpt", "gemini", "claude", "deepseek", "grok", "perplexity"][i];
      console.warn(`⚠️ ${model} failed:`, r.status === "rejected" ? r.reason : r.value.error);
    }
  });
  
  if (cands.length === 0) {
    throw new Error("All AI adapters failed");
  }
  
  console.log(`✅ ${cands.length} candidates received from 6 AIs`);
  
  return { candidates: cands, context };
}

/**
 * 呼吸サイクル: Reflect（反映）
 */
function phaseReflect({ candidates, context, protocol, userPrompt }) {
  console.log("✨ Phase 3: Reflect - Proof生成・Mirror Gate同期");
  
  // スコアリング
  const ranked = scoreCandidates({ 
    cands: candidates, 
    intentDoc: context, 
    evidenceHints: [] 
  });
  
  const best = ranked[0] || { answer: "<no candidate>", fusion_score: 0, model: "none" };
  
  console.log(`✅ Best: ${best.model} (score=${best.fusion_score})`);
  
  // Proof生成
  const now = new Date();
  const timestamp = Date.now();
  const dateStr = now.toISOString().split('T')[0];
  
  const proof = {
    generated_at: now.toISOString(),
    protocol_version: protocol.version,
    prompt: userPrompt,
    system_hint: context.slice(0, 200) + "...",
    candidates: ranked.map(c => ({
      model: c.model,
      score: c.fusion_score,
      answer_preview: c.answer.slice(0, 100) + "..."
    })),
    chosen: {
      model: best.model,
      score: best.fusion_score,
      answer: best.answer
    },
    cycle_phase: "Awaken → Integrate → Reflect",
    context_length: context.length,
    candidates_count: ranked.length
  };
  
  // Proofs/S3_* に保存
  const dir = "99_SYSTEM/Proofs";
  fs.mkdirSync(dir, { recursive: true });
  
  const proofPath = `${dir}/S3_Cycle_${timestamp}.json`;
  const proofMarkdown = `${dir}/S3_Cycle_${timestamp}.md`;
  
  fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));
  
  fs.writeFileSync(proofMarkdown, `# Seventh Sense Protocol v1.0 - Cycle Proof

**Time**: ${now.toISOString()}
**Protocol Version**: ${protocol.version}
**Prompt**: ${userPrompt}
**Chosen**: ${best.model} (score=${best.fusion_score})
**Candidates**: ${ranked.length}

## Final Answer

${best.answer}

## Models Scored

${ranked.map(c => `- **${c.model}**: ${c.fusion_score} - ${c.answer.slice(0, 80)}...`).join("\n")}

## Cycle Phase

Awaken → Integrate → Reflect → Expand → Rest → Awaken

## Context

Context document length: ${context.length} chars

---
*Generated by Seventh Sense Protocol v1.0 (S³ Orchestrator)*
`);
  
  console.log(`✅ Proof saved: ${proofMarkdown}`);
  
  return { proof, best, ranked };
}

/**
 * 呼吸サイクル: Expand（拡張）
 */
function phaseExpand({ proof }) {
  console.log("🌐 Phase 4: Expand - 外界層への展開");
  console.log("📝 Proof generated: 99_SYSTEM/Proofs/S3_*.md");
  console.log("🔄 Mirror Gate will sync automatically on next push");
  console.log("✅ Expansion phase complete");
}

/**
 * 呼吸サイクル: Rest（休息）
 */
function phaseRest() {
  console.log("💤 Phase 5: Rest - 次のサイクルへの準備");
  console.log("✅ Cycle complete. Ready for next invocation.");
}

/**
 * メイン実行関数
 */
export async function s3Cycle({ userPrompt, systemHint = "" }) {
  try {
    // Phase 1: Awaken
    const { protocol, context } = phaseAwaken();
    
    // Phase 2: Integrate
    const { candidates, context: ctx } = await phaseIntegrate({ 
      userPrompt, 
      context: systemHint || context, 
      protocol 
    });
    
    // Phase 3: Reflect
    const { proof, best, ranked } = phaseReflect({ 
      candidates, 
      context: ctx, 
      protocol, 
      userPrompt 
    });
    
    // Phase 4: Expand
    phaseExpand({ proof });
    
    // Phase 5: Rest
    phaseRest();
    
    return {
      answer: best.answer,
      model: best.model,
      score: best.fusion_score,
      proof_path: `99_SYSTEM/Proofs/S3_Cycle_${Date.now()}.md`,
      candidates: ranked.length
    };
  } catch (error) {
    console.error("❌ S³ Cycle Error:", error.message);
    throw error;
  }
}

// CLI実行時の処理
if (import.meta.url === `file://${process.argv[1]}`) {
  const userPrompt = process.argv[2];
  const systemHint = process.argv[3] === "--system" ? process.argv[4] : "";
  
  if (!userPrompt) {
    console.error("Usage: node tools/orchestrator/s3_main.mjs <prompt> [--system <hint>]");
    process.exit(1);
  }
  
  s3Cycle({ userPrompt, systemHint })
    .then(result => {
      console.log("\n--- Final Answer ---\n", result.answer);
      console.log("\n--- Proof ---\n", result.proof_path);
    })
    .catch(error => {
      console.error("Error during S³ Cycle:", error);
      process.exit(1);
    });
}

