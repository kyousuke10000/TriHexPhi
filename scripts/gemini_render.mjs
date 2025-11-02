#!/usr/bin/env node

/**
 * Gemini Render Script
 * 
 * Purpose: Generate SVG/PNG images via Gemini API
 * Usage: node gemini_render.mjs --prompt "..." --format svg --width 1200 --height 800
 * 
 * Output: JSON to stdout
 *   {success: true, image_data: "base64...", image_type: "svg"}
 *   {success: false, error: "..."}
 */

import https from 'https';
import { createHash } from 'crypto';

// Parse command-line arguments
const args = {};
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i].startsWith('--')) {
    const key = process.argv[i].substring(2);
    const value = process.argv[i + 1];
    args[key] = value;
    i++;
  }
}

const {
  prompt,
  format = 'svg',
  width = '1200',
  height = '800'
} = args;

// Validate inputs
if (!prompt) {
  console.error(JSON.stringify({
    success: false,
    error: 'Missing --prompt argument'
  }));
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(JSON.stringify({
    success: false,
    error: 'GEMINI_API_KEY environment variable not set'
  }));
  process.exit(1);
}

// Build Gemini API request
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;

const requestBody = {
  contents: [{
    parts: [
      {
        text: `Generate a ${format.toUpperCase()} image with the following specifications:
        
${prompt}

Technical requirements:
- Format: ${format.toUpperCase()}
- Dimensions: ${width}x${height} pixels
- Style: Clean, minimalist, technical diagram
- Colors: Follow TriHex palette (breathing layers, six-spiral ontology)

Return only the ${format.toUpperCase()} code/data, no explanation.`
      }
    ]
  }],
  generationConfig: {
    temperature: 0.4,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  }
};

// Make request
const postData = JSON.stringify(requestBody);
const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.error(`📤 Calling Gemini API (model: gemini-pro-vision, format: ${format})...`);

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode !== 200) {
        throw new Error(`API error (${res.statusCode}): ${response.error?.message || 'Unknown error'}`);
      }
      
      // Extract generated content
      const candidate = response.candidates?.[0];
      if (!candidate) {
        throw new Error('No candidates in response');
      }
      
      const content = candidate.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('No content in candidate');
      }
      
      // Base64 encode the response
      const imageData = Buffer.from(content).toString('base64');
      
      console.error(`✅ Generation successful (${imageData.length} bytes)`);
      
      // Output JSON
      console.log(JSON.stringify({
        success: true,
        image_data: imageData,
        image_type: format,
        width: parseInt(width),
        height: parseInt(height),
        size: imageData.length
      }));
      
    } catch (error) {
      console.error(`❌ Parse error: ${error.message}`);
      
      console.log(JSON.stringify({
        success: false,
        error: `Parse error: ${error.message}`,
        raw_response: data.substring(0, 500)
      }));
    }
  });
});

req.on('error', (error) => {
  console.error(`❌ Request error: ${error.message}`);
  
  console.log(JSON.stringify({
    success: false,
    error: `Request error: ${error.message}`
  }));
});

req.write(postData);
req.end();

