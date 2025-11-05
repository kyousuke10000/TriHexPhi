// tools/meta/adapters/perplexity.mjs
export async function askPerplexity({prompt, system, timeoutMs = 45000}) {
  const key = process.env.PPLX_API_KEY;
  if (!key) throw new Error("PPLX_API_KEY missing");

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
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
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || `[Perplexity] ${prompt.slice(0, 200)}`;
    const citations = data.citations || [];

    return {
      model: "perplexity",
      answer,
      meta: {
        latency_ms: Date.now() - (Date.now() - 1000),
        sources: citations,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Perplexity API timeout");
    }
    throw error;
  }
}

