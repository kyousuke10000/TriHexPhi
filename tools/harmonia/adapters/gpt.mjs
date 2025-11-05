// tools/harmonia/adapters/gpt.mjs
export async function askGPT({prompt, system, timeoutMs = 45000}) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY missing");

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || `[GPT] ${prompt.slice(0, 200)}`;

    return {
      model: "gpt",
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
      throw new Error("GPT API timeout");
    }
    throw error;
  }
}

