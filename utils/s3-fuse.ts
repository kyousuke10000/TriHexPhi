// SeventhSense統一ラッパー（CLIでもAPIでも使える最小コア）

export async function askClaude({user, system=""}:{user:string; system?:string}) {

  const { default: Anthropic } = await import("@anthropic-ai/sdk");

  const c = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const m = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20241022";

  const r = await c.messages.create({ model:m, max_tokens:1800, system, messages:[{role:"user", content:user}] });

  return r.content?.map(x=>x.text).join("\n") || "";

}

export async function askGemini({user, system=""}:{user:string; system?:string}) {

  const { GoogleGenerativeAI } = await import("@google/generative-ai");

  const g = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

  const m = g.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-pro" });

  const prompt = `System:\n${system}\n\nUser:\n${user}`;

  const res:any = await m.generateContent(prompt);

  return res.response?.text() || "";

}

