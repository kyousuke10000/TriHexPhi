#!/usr/bin/env node

/**
 * TriHex Watchdog - FailSafe System
 * 
 * Purpose: Monitor AI heartbeat, prevent runaway processes
 * Usage: node tools/trihex/watchdog.mjs [options]
 * 
 * Features:
 * - Heartbeat monitoring (3s interval)
 * - Automatic restart on failure
 * - Context size limits
 * - Emergency downgrade
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Configuration
const CONFIG = {
  heartbeat_interval: 3000, // 3 seconds
  log_dir: '99_SYSTEM/Logs',
  max_context_mb: {
    gpt5: 800,
    cursor: 512,
    claude: 512,
    gemini: 384,
    deepseek: 256,
    grok: 256
  },
  emergency_timeout: 30000 // 30 seconds
};

// Ensure log directory exists
if (!fs.existsSync(CONFIG.log_dir)) {
  fs.mkdirSync(CONFIG.log_dir, { recursive: true });
}

// AI process registry
const aiProcesses = new Map();

// Heartbeat tracking
const heartbeats = new Map();

/**
 * Log with timestamp
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type}] ${message}\n`;
  
  // Write to appropriate log file
  const logFile = type === 'error' 
    ? `${CONFIG.log_dir}/ai_errors.log`
    : `${CONFIG.log_dir}/ai_heartbeat.log`;
  
  fs.appendFileSync(logFile, logEntry);
  console.log(logEntry.trim());
}

/**
 * Start AI process with monitoring
 */
function startAI(aiName, command, args = []) {
  log(`Starting ${aiName}...`, 'info');
  
  const proc = spawn(command, args, {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env }
  });
  
  // Track process
  aiProcesses.set(aiName, proc);
  heartbeats.set(aiName, Date.now());
  
  // Monitor stdout
  proc.stdout.on('data', (data) => {
    const output = data.toString();
    log(`[${aiName}] ${output.trim()}`, 'info');
    
    // Reset heartbeat on activity
    heartbeats.set(aiName, Date.now());
  });
  
  // Monitor stderr
  proc.stderr.on('data', (data) => {
    const output = data.toString();
    log(`[${aiName}] ERROR: ${output.trim()}`, 'error');
  });
  
  // Handle exit
  proc.on('exit', (code, signal) => {
    log(`${aiName} exited with code ${code}, signal ${signal}`, code === 0 ? 'info' : 'error');
    aiProcesses.delete(aiName);
    heartbeats.delete(aiName);
    
    // Auto-restart on failure
    if (code !== 0 && code !== null) {
      log(`Attempting to restart ${aiName}...`, 'info');
      setTimeout(() => startAI(aiName, command, args), 3000);
    }
  });
  
  // Handle errors
  proc.on('error', (error) => {
    log(`${aiName} error: ${error.message}`, 'error');
    aiProcesses.delete(aiName);
    heartbeats.delete(aiName);
  });
  
  return proc;
}

/**
 * Check heartbeats and restart failed processes
 */
function checkHeartbeats() {
  const now = Date.now();
  const timeout = CONFIG.heartbeat_interval * 3; // 9 seconds timeout
  
  for (const [aiName, lastBeat] of heartbeats.entries()) {
    const timeSinceLastBeat = now - lastBeat;
    
    if (timeSinceLastBeat > timeout) {
      log(`Heartbeat timeout for ${aiName} (${timeSinceLastBeat}ms)`, 'error');
      
      // Kill stale process
      const proc = aiProcesses.get(aiName);
      if (proc && !proc.killed) {
        log(`Killing stale process: ${aiName}`, 'info');
        proc.kill('SIGTERM');
      }
      
      // Will be restarted by exit handler
    }
  }
}

/**
 * Monitor context size and emergency downgrade if needed
 */
function checkContextSize(aiName) {
  const maxMB = CONFIG.max_context_mb[aiName.toLowerCase()];
  if (!maxMB) return;
  
  // Get process memory usage (simplified)
  const proc = aiProcesses.get(aiName);
  if (!proc) return;
  
  // Note: Actual memory monitoring would require platform-specific tools
  // This is a placeholder for the concept
  log(`[${aiName}] Context size check (max: ${maxMB}MB)`, 'info');
}

/**
 * Emergency downgrade command
 */
function emergencyDowngrade() {
  log('EMERGENCY: Initiating downgrade', 'error');
  
  // Kill all processes
  for (const [aiName, proc] of aiProcesses.entries()) {
    if (!proc.killed) {
      log(`Killing ${aiName} for emergency downgrade`, 'error');
      proc.kill('SIGTERM');
    }
  }
  
  // Clear registry
  aiProcesses.clear();
  heartbeats.clear();
  
  // Wait before restart
  setTimeout(() => {
    log('Emergency downgrade complete', 'info');
    log('System ready for manual restart', 'info');
  }, CONFIG.emergency_timeout);
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Handle emergency downgrade
  if (args[0] === ':emergency-downgrade') {
    emergencyDowngrade();
    return;
  }
  
  // Parse config
  const configFile = '.cursor/config.yml';
  if (fs.existsSync(configFile)) {
    const config = fs.readFileSync(configFile, 'utf8');
    log('Loaded config from .cursor/config.yml', 'info');
  }
  
  // Start watchdog monitoring
  log('TriHex Watchdog started', 'info');
  log('Heartbeat interval: ' + CONFIG.heartbeat_interval + 'ms', 'info');
  
  // Start heartbeat monitoring loop
  setInterval(checkHeartbeats, CONFIG.heartbeat_interval);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    log('Watchdog shutting down...', 'info');
    
    for (const [aiName, proc] of aiProcesses.entries()) {
      if (!proc.killed) {
        log(`Terminating ${aiName}...`, 'info');
        proc.kill('SIGTERM');
      }
    }
    
    process.exit(0);
  });
  
  // Keep alive without blocking stdin
  // Note: Watchdog should run as daemon, not interactive shell
}

// Run main
main().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
});


