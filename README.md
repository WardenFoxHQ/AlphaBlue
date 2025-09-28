# AlphaBlue

**A lightweight development server for HTML pages and custom APIs**

Fast, secure, and easy to extend - perfect for rapid prototyping and development.

*Tested: Hello World API (57,893 req/sec) + index.html (54,087 req/sec) on an Intel Ultra 9 275HX (single core). Performance on standard hardware may vary.*

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

##  Quick Start

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

Performance benchmarks vary based on hardware. The following table shows results from both a high-performance machine and a standard development server.

| CPU                                     | Core Type     | Endpoint      | Requests/sec |
|-----------------------------------------|---------------|---------------|--------------|
| **Intel(R) Core(TM) Ultra 9 275HX**     | P-core        | `/helloworld` | 57,893       |
| **Intel(R) Core(TM) Ultra 9 275HX**     | P-core        | `/index`      | 54,087       |
| **Intel(R) Core(TM) Ultra 9 275HX**     | E-core        | `/helloworld` | 39,000       |
| **Intel(R) Core(TM) Ultra 9 275HX**     | E-core        | `/index`      | 38,700       |
| **Intel(R) Xeon(R) Processor @ 2.30GHz**| Standard      | `/helloworld` | ~23,000      |
| **Intel(R) Xeon(R) Processor @ 2.30GHz**| Standard      | `/index`      | ~21,000      |

**Note**: CPU affinity to select specific core types works on Windows (PowerShell) and Linux (taskset - tested). Production performance will differ based on hardware and workload.

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