// tools/harmonia/adapters/gemini.mjs
export async function askGemini({prompt, system, timeoutMs = 45000}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    // 実際のAPI呼び出し（簡易実装）
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: system ? `${system}\n\n${prompt}` : prompt }]
          }]
        }),
        signal: ctrl.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || `[Gemini] ${prompt.slice(0, 200)}`;

    return {
      model: "gemini",
      answer,
      meta: {
        latency_ms: Date.now() - (Date.now() - 1000),
        sources: [],
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Gemini API timeout");
    }
    throw error;
  }
}

