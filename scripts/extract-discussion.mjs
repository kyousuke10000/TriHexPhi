#!/usr/bin/env node

/**
 * Extract Discussion Topic
 * Cleans and extracts topic from GitHub Discussion
 */

const topic = process.argv[2] || '';

if (!topic) {
  console.error('Usage: node extract-discussion.mjs "Discussion Title"');
  process.exit(1);
}

// Clean topic: remove forbidden characters, normalize whitespace
const cleaned = topic
  .replace(/[<>"|*?\\/:]/g, '') // Remove forbidden file chars
  .replace(/\s+/g, ' ')          // Normalize whitespace
  .trim();

console.log(cleaned);
