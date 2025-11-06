#!/usr/bin/env node
/**
 * Cursor Adapter for SeventhSense
 * 
 * Cursor is an implementation-first code AI. This adapter provides
 * a bridge to Cursor's capabilities, either via a custom bridge URL
 * or by using OpenAI API with Cursor's personality.
 * 
 * @module adapters/cursor
 */

// Use global fetch (Node.js 18+) or node-fetch fallback
// import fetch from "node-fetch"; // Uncomment if needed for older Node versions

/**
 * Ask Cursor (Core Six AI)
 * 
 * @param {Object} params
 * @param {string} params.prompt - User prompt
 * @param {string} params.system - System hint
 * @param {number} params.timeoutMs - Timeout in milliseconds (default: 45000)
 * @returns {Promise<Object>} Response with model, answer, and meta
 */
export async function askCursor({ prompt, system, timeoutMs = 45000 }) {
  // 方針：Cursorの"実装者AI"としての人格を付与してOpenAIを叩く or
  //       ローカルMCP/ブリッジ(CURSOR_BRIDGE_URL)があればそちらを優先
  const bridge = process.env.CURSOR_BRIDGE_URL; // 任意

  if (bridge) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const r = await fetch(`${bridge}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, system }),
        signal: ctrl.signal,
      });

      clearTimeout(t);

      if (!r.ok) {
        throw new Error(`Cursor bridge error: ${r.status} ${r.statusText}`);
      }

      const data = await r.json();
      return {
        model: "cursor",
        answer: data.answer,
        meta: {
          timestamp: new Date().toISOString(),
          latency_ms: Date.now() - (data.timestamp || Date.now()),
          sources: data.sources || [],
        },
      };
    } catch (e) {
      if (e.name === "AbortError") {
        throw new Error("Cursor bridge timeout");
      }
      throw new Error(`Cursor bridge error: ${e.message}`);
    }
  }

  // フォールバック：Cursor人格のsystemヒントでOpenAIを叩く
  const { askGPT } = await import("./gpt.mjs");
  const sys = `You are Cursor, an implementation-first code AI. Prefer diffs, runnable steps, and repo-aware answers. Focus on practical, executable solutions.\n${system || ""}`;

  try {
    const res = await askGPT({ prompt, system: sys, timeoutMs });
    return {
      ...res,
      model: "cursor",
      meta: {
        ...res.meta,
        method: "fallback_openai",
      },
    };
  } catch (e) {
    throw new Error(`Cursor adapter error: ${e.message}`);
  }
}

