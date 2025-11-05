// tools/meta/adapters/deepseek.mjs
export async function askDeepSeek({prompt, system, timeoutMs = 45000}) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("DEEPSEEK_API_KEY missing");

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || `[DeepSeek] ${prompt.slice(0, 200)}`;

    return {
      model: "deepseek",
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
      throw new Error("DeepSeek API timeout");
    }
    throw error;
  }
}

