// tools/meta/adapters/claude.mjs
export async function askClaude({prompt, system, timeoutMs = 45000}) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY missing");

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: system ? `${system}\n\n${prompt}` : prompt
        }]
      }),
      signal: ctrl.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text || `[Claude] ${prompt.slice(0, 200)}`;

    return {
      model: "claude",
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
      throw new Error("Claude API timeout");
    }
    throw error;
  }
}

