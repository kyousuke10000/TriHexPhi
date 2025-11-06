#!/usr/bin/env node

import { GoogleGenerativeAI } from "@google/generative-ai";

const key = process.env.GOOGLE_API_KEY;

if(!key) { console.error("GOOGLE_API_KEY missing"); process.exit(1); }

const genAI = new GoogleGenerativeAI(key);

const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-pro" });

const sys = process.env.GEMINI_SYSTEM || "Be a concise architect; output runnable, minimal artifacts.";

const user = process.argv.slice(2).join(" ") || "Say hello in 1 sentence.";

const prompt = `System:\n${sys}\n\nUser:\n${user}`;

const res = await model.generateContent(prompt);

const out = res.response.text();

console.log(out);

