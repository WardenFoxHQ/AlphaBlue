#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const args = process.argv.slice(2);
const mode = args[0] || 'api';

// Apply performance settings from .env
if (process.env.THREAD_POOL_SIZE) {
  process.env.UV_THREADPOOL_SIZE = process.env.THREAD_POOL_SIZE;
}

const servers = {
  api: () => {
    console.log('🚀 Starting Simple API Framework...');
    const port = args[1] || process.env.PORT || 3000;

    // Create child process
    const child = spawn('node', [path.join(__dirname, 'src/simple-api.js'), port], {
      stdio: 'inherit'
    });

    // Apply CPU core affinity if enabled
    if (process.env.SINGLE_CORE_MODE === 'true') {
      const coreNumber = parseInt(process.env.CPU_CORE_NUMBER || '0');
      const affinity = Math.pow(2, coreNumber);

      console.log(`⚡ Single-core mode: Using CPU core ${coreNumber}`);
      console.log(`🔧 Thread pool size: ${process.env.UV_THREADPOOL_SIZE || 'default'}`);

      // Set CPU affinity after process starts
      setTimeout(() => {
        try {
          if (process.platform === 'win32') {
            const { spawn: spawnSync } = require('child_process');
            spawnSync('powershell', [
              '-Command',
              `(Get-Process -Id ${child.pid}).ProcessorAffinity = ${affinity}`
            ], { stdio: 'inherit' });
            console.log(`✅ CPU affinity set to core ${coreNumber} (Windows)`);
          } else if (process.platform === 'linux') {
            const { spawn: spawnSync } = require('child_process');
            spawnSync('taskset', ['-cp', coreNumber, child.pid], { stdio: 'inherit' });
            console.log(`✅ CPU affinity set to core ${coreNumber} (Linux)`);
          } else {
            console.log(`⚠️  CPU affinity not supported on ${process.platform}`);
          }
        } catch (error) {
          console.log('⚠️  Could not set CPU affinity:', error.message);
        }
      }, 1000);
    }
  },

  benchmark: () => {
    console.log('📊 Running performance benchmark...');
    spawn('node', [path.join(__dirname, 'benchmarks/benchmark.js')], {
      stdio: 'inherit'
    });
  }
};

if (servers[mode]) {
  servers[mode]();
} else {
  console.log(`
🚀 Simple Fast Development Server

Usage: node index.js [mode]

Modes:
  api        - Single server instance (default)
  benchmark  - Run performance tests

Examples:
  npm start                    # Single server on port 3000
  node index.js api           # Single server on port 3000
  node index.js api 3001      # Single server on port 3001
  node index.js benchmark     # Performance test
  `);
}