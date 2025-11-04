#!/usr/bin/env node

/**
 * Claude API Vendor
 * Features: retry with exponential backoff, rate limit handling, UTF-8/NFC
 */

const toUtf8NFC = (s) => String(s).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").normalize("NFC");

class ClaudeError extends Error {
  constructor(message, statusCode, response) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
  }
}

async function callClaude(prompt, options = {}) {
  const apiKey = process.env.CLAUDE_API_KEY;
  
  if (!apiKey) {
    throw new ClaudeError('CLAUDE_API_KEY not set', 0);
  }
  
  const maxRetries = options.maxRetries || 5;
  const baseDelay = options.baseDelay || 1000;
  const timeout = options.timeout || 60000;
  
  const url = 'https://api.anthropic.com/v1/messages';
  const payload = {
    model: options.model || 'claude-3-5-sonnet-20241022',
    max_tokens: options.maxTokens || 1024,
    messages: [
      { role: 'user', content: toUtf8NFC(prompt) }
    ]
  };
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const rateLimitRemaining = response.headers.get('ratelimit-remaining');
      const retryAfter = response.headers.get('retry-after');
      
      if (response.status === 429) {
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt);
        await log(`Rate limited, retrying in ${delay}ms...`, 'claude_requests');
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (response.status >= 500) {
        const delay = baseDelay * Math.pow(2, attempt);
        await log(`Server error ${response.status}, retrying in ${delay}ms...`, 'claude_requests');
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (response.status >= 400 && response.status < 500) {
        const errorText = await response.text().catch(() => '');
        throw new ClaudeError(`Client error ${response.status}: ${errorText}`, response.status, errorText);
      }
      
      const data = await response.json();
      const content = data.content?.[0]?.text || '';
      
      await log(`✅ Claude success: ${content.length} chars`, 'claude_requests');
      
      return toUtf8NFC(content);
      
    } catch (error) {
      if (error instanceof ClaudeError) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw new ClaudeError('Request timeout', 0);
      }
      
      if (attempt === maxRetries - 1) {
        throw new ClaudeError(`Network error after ${maxRetries} attempts: ${error.message}`, 0, error.message);
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await log(`Network error, retrying in ${delay}ms: ${error.message}`, 'claude_requests');
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new ClaudeError('Max retries exceeded', 0);
}

// Simple logging
async function log(message, logFile = 'claude_requests') {
  const fs = await import('node:fs/promises');
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  try {
    await fs.appendFile(`99_SYSTEM/Logs/${logFile}.log`, toUtf8NFC(logLine), 'utf8');
  } catch {
    // Log failed, continue
  }
  console.log(message);
}

// Export
export { callClaude, ClaudeError };

