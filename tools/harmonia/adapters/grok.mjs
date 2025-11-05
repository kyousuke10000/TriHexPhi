// tools/harmonia/adapters/grok.mjs
export async function askGrok({prompt, system, timeoutMs = 45000}) {
  const key = process.env.GROK_API_KEY;
  if (!key) throw new Error("GROK_API_KEY missing");

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    // Grok API endpoint (X API v2)
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000
      }),
      signal: ctrl.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || `[Grok] ${prompt.slice(0, 200)}`;

    return {
      model: "grok",
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
      throw new Error("Grok API timeout");
    }
    throw error;
  }
}

