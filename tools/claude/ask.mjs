#!/usr/bin/env node

import Anthropic from "anthropic";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const model = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20240620";

const sys = process.env.CLAUDE_SYSTEM || "You are Claude Code: be precise and runnable.";

const user = process.argv.slice(2).join(" ") || "Say hello in 1 sentence.";

const res = await client.messages.create({

  model, max_tokens: 1800, system: sys,

  messages: [{ role: "user", content: user }]

});

console.log(res.content?.map(c=>c.text).join("\n")||"");

