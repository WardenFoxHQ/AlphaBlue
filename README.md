# Fast Static Server

**A lightweight development server for HTML pages and custom APIs**

Fast, secure, and easy to extend - perfect for rapid prototyping and development.

*Tested: Hello World API (57,893 req/sec) + index.html (54,087 req/sec) on Intel Ultra 9 275HX (single core)*

##  What This Is

A simple Node.js server that:
- **Serves HTML pages** from a `public/` folder (loaded into memory for speed)
- **Builds custom APIs** quickly with Fastify
- **Fast development** with configuration via `.env`

##  Project Structure

```
AlphaBlue/
├── public/                     # HTML files (auto-loaded into memory)
│   ├── index.html             # → http://localhost:3000/index
│   ├── about.html             # → http://localhost:3000/about
│   └── helloworld.html        # → http://localhost:3000/helloworld
├── src/
│   └── simple-api.js          # Main server file
├── .env                       # Configuration
├── index.js                   # Entry point
└── package.json
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Server runs on http://localhost:3000
```

### Add Your HTML Pages
1. Drop `.html` files in `public/` folder
2. Restart server - they're automatically loaded into memory
3. Access at `http://localhost:3000/filename` (without .html)

### Add Your APIs
Edit `src/simple-api.js` and add routes:

```javascript
// Add your custom API routes
fastify.get('/api/users', (request, reply) => {
  reply.send({ users: ['Alice', 'Bob'] });
});

fastify.post('/api/data', (request, reply) => {
  // Your API logic here
  reply.send({ success: true });
});
```

## Configuration (.env)

```env
# Server settings
PORT=3000
HOST=0.0.0.0
SERVER_NAME=My-Dev-Server

# Performance (good defaults)
BODY_LIMIT=1024
REQUEST_TIMEOUT=30000
PUBLIC_DIR=public

# Security
TRUST_PROXY=false
ENABLE_LOGGING=false
```

##  Features

- **HTML serving**: Files auto-loaded into memory for speed
- **API framework**: Fastify for building REST APIs
- **Security**: Path validation, prototype pollution protection
- **Error handling**: Clean text responses (not JSON dumps)
- **Environment config**: Easy setup via `.env`

## Performance

**Performance Results (Windows localhost):**
- **Hello World API (/helloworld)**: 57,893 req/sec
- **index.html serving**: 54,087 req/sec from memory
- **Ran om**: Dedicated 1 core

### Test Environment

**CPU:** Intel(R) Core(TM) Ultra 9 275HX
- **Base speed**: 2.70 GHz (boosted to 4.59 GHz during test)
- **Cores**: 24 cores, 24 logical processors
- **Cache**: L1: 2.4 MB, L2: 40.0 MB, L3: 36.0 MB
- **Test method**: Single CPU core
- **OS**: Windows 10 

**Results Summary**: Hello World API: 57,893 req/sec, index.html: 54,087 req/sec. Only 7% performance difference between API and HTML serving.

### CPU Core Performance Analysis

**Intel Ultra 9 275HX Core Types:**

**Performance Cores (P-cores):**
  - **CPU Core 0**: 57,893 req/sec (1.17ms latency) - `/helloworld` (latest test)
  - **CPU Core 0**: 54,087 req/sec (1.25ms latency) - `/index` (latest test)
  - **CPU Core 23**: 60,000 req/sec (1.09ms latency) - `/helloworld` (previous test)
  - **Optimized for**: Maximum single-thread performance

  **Efficiency Cores (E-cores):**
  - **CPU Core 18**: 39,000 req/sec (2.07ms latency) - `/helloworld`
  - **CPU Core 18**: 38,700 req/sec (2.10ms latency) - `/index` (7KB HTML)
  - **Optimized for**: Power efficiency, lower performance

  **Key Findings**:
  - Performance cores deliver ~55% higher throughput than efficiency cores
  - HTML files (7KB) perform nearly identical to text responses (12-byte) on same core type
  - P-cores: ~2% performance difference between `/helloworld` and `/index`
  - E-cores: ~1% performance difference between `/helloworld` and `/index`
  - Server automatically adapts to any core type via .env configuration

### Performance Comparison

- **AlphaBlue**: **57,893 req/sec** (Performance Core 0)
- **AlphaBlue**: **39,000 req/sec** (Efficiency Core 18)

**Note**: Results tested on Windows localhost using 1 CPU core per instance. CPU affinity works on Windows (PowerShell) and Linux (taskset - untested). Production performance may differ.

### Core Selection via .env

**Control which CPU core to use:**

```env
# Performance Settings
SINGLE_CORE_MODE=true       # Enable single-core mode
CPU_CORE_NUMBER=0           # Use Performance Core (0-15 recommended)
CPU_CORE_NUMBER=18          # Use Efficiency Core (16-23, lower performance)
THREAD_POOL_SIZE=1          # Single-threaded mode
```

### Test It Yourself

**Compare Core Types (Windows/Linux):**
```bash
# Test Performance Core (set CPU_CORE_NUMBER=0 in .env)
npm start
npx autocannon -c 100 -d 15 http://localhost:3000/helloworld

# Test Efficiency Core (set CPU_CORE_NUMBER=18 in .env)
npm start
npx autocannon -c 100 -d 15 http://localhost:3000/helloworld
```

**Note**: CPU core selection works on Windows (tested) and Linux (taskset support added, untested). On macOS, the server runs without CPU affinity controls.

## Use Cases

**Perfect for:**
- Rapid prototyping
- Static site development
- Simple API development
- Landing pages with APIs
- Development/staging servers
- Learning Node.js/Fastify

**Not for:**
- Production e-commerce sites
- Complex authentication systems
- Large file uploads
- Real-time applications



**Happy Coding**
🦊 *Squeak-squeak!*  