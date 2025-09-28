# 📚 Fast Static Server - Complete Documentation

**Version:** 0.0.1
**Last Updated:** September 2025

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [API Endpoints](#api-endpoints)
5. [Security](#security)
6. [Performance](#performance)
7. [Development](#development)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)

---

## 🎯 Overview

Fast Static Server is a lightweight, high-performance development server built with Node.js and Fastify. It's designed for rapid prototyping, serving HTML pages, and building simple APIs with exceptional speed.

### Key Features
- **🚀 High Performance**: 26,606+ requests per second
- **📄 HTML File Serving**: Auto-loads files into memory for maximum speed
- **🔧 API Development**: Built-in Fastify framework for custom APIs
- **🔒 Security**: Path validation, API key protection, input sanitization
- **⚡ Fast Startup**: Instant server launch with hot configuration
- **📊 Health Monitoring**: Built-in health endpoint with system metrics

---

## 🛠️ Installation

### Prerequisites
- **Node.js**: Version 20.0.0 or higher
- **npm**: Latest version recommended

### Quick Install
```bash
# Clone the repository
git clone <repository-url>
cd fast-static-server

# Install dependencies
npm install

# Start the server
npm start
```

### Dependencies
The server uses these core dependencies:
- **fastify**: High-performance web framework
- **@fastify/static**: Static file serving
- **@fastify/cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **autocannon**: Performance benchmarking

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Server Configuration
PORT=3000                    # Default port for the server
HOST=0.0.0.0                # Bind to all network interfaces
SERVER_NAME=Simple-API      # Name displayed in logs and responses

# Performance Settings
BODY_LIMIT=1024             # Maximum request body size in bytes
REQUEST_TIMEOUT=30000       # Kill requests that take longer than 30 seconds

# Security Settings
TRUST_PROXY=false           # Don't trust proxy headers
ENABLE_LOGGING=false        # Disable request logging for better performance

# File System
PUBLIC_DIR=public           # Directory containing HTML files to serve

# API Security
HEALTH_CHECK_API_KEY=my-secret-key  # API key for /health endpoint
```

### Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port number |
| `HOST` | `0.0.0.0` | Server host binding |
| `SERVER_NAME` | `Simple-API` | Server identification |
| `BODY_LIMIT` | `1024` | Max request body size (bytes) |
| `REQUEST_TIMEOUT` | `30000` | Request timeout (milliseconds) |
| `TRUST_PROXY` | `false` | Trust proxy headers |
| `ENABLE_LOGGING` | `false` | Enable request logging |
| `PUBLIC_DIR` | `public` | HTML files directory |
| `HEALTH_CHECK_API_KEY` | `my-secret-key` | Health endpoint API key |

---

## 🌐 API Endpoints

### HTML Pages
All HTML files in the `public/` directory are automatically served:

```
GET /              → index.html (if exists)
GET /about         → about.html
GET /contact       → contact.html
GET /[filename]    → [filename].html
```

### API Endpoints

#### Hello World
```http
GET /helloworld
```
**Response:**
```
Hello World!
```

#### Health Check
```http
GET /health?key=YOUR_API_KEY
```
**Headers:**
```
x-api-key: YOUR_API_KEY
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": "1 hr 15 min",
  "memory": {
    "rss": "53.07 MB",
    "heapTotal": "13.24 MB",
    "heapUsed": "11.08 MB",
    "external": "2.39 MB"
  },
  "loadedHtmlFiles": 7
}
```

#### Root Directory
```http
GET /
```
Shows available HTML files and API endpoints in JSON format (if no index.html exists).

---

## 🔒 Security

### Built-in Security Features

#### Path Validation
- **Directory traversal protection**: Blocks `../` attacks
- **File type filtering**: Only allows `.html` files
- **Path sanitization**: Validates all file paths

#### API Security
- **API key protection**: Health endpoint requires authentication
- **Input validation**: All inputs are sanitized
- **Error handling**: No sensitive information leaked in errors

#### File Access Protection
The following files are automatically protected:
- `.env` files
- `package.json`
- Source code files (`src/`)
- Node.js modules (`node_modules/`)

### Security Best Practices

1. **Change default API key**:
   ```env
   HEALTH_CHECK_API_KEY=your-secure-random-key-here
   ```

2. **Use HTTPS in production**:
   ```env
   TRUST_PROXY=true
   ```

3. **Enable logging for monitoring**:
   ```env
   ENABLE_LOGGING=true
   ```

4. **Restrict host binding for local development**:
   ```env
   HOST=127.0.0.1
   ```

---

## ⚡ Performance

### Benchmark Results

**Test Environment:**
- **CPU**: Intel(R) Core(TM) Ultra 9 275HX
- **Base Speed**: 2.70 GHz (boosted to 4.59 GHz during test)
- **Cores**: 24 cores, 24 logical processors
- **OS**: Windows 10
- **Test Method**: Single core usage only

**Performance Results:**
- **Requests per second**: 49,803 req/sec
- **Average latency**: 1.35ms
- **Memory usage**: ~53 MB RAM


### Performance Testing
```bash
# Quick performance test
npx autocannon -c 50 -d 10 http://localhost:3000/helloworld

# Comprehensive benchmark
npm run benchmark
```

---

## 🛠️ Development

### Project Structure
```
fast-static-server/
├── benchmarks/           # Performance testing tools
│   └── benchmark.js     # Automated benchmarking
├── public/              # HTML files (auto-loaded into memory)
│   ├── index.html      # Default homepage
│   ├── about.html      # About page
│   └── *.html          # Additional pages
├── src/
│   └── simple-api.js   # Main server implementation
├── .env                # Environment configuration
├── .env.example        # Configuration template
├── .gitignore         # Git ignore rules
├── index.js           # Entry point and launcher
├── package.json       # Dependencies and scripts
└── README.md          # Quick start guide
```

### npm Scripts
```bash
npm start              # Start development server
npm run benchmark      # Run performance tests
npm run dev            # Start with file watching (if available)
```

### Adding HTML Pages
1. Create `.html` files in the `public/` directory
2. Restart the server
3. Access pages at `http://localhost:3000/[filename]`

**Example:**
```html
<!-- public/dashboard.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
</head>
<body>
    <h1>My Dashboard</h1>
    <p>Welcome to the dashboard!</p>
</body>
</html>
```
Access at: `http://localhost:3000/dashboard`

### Adding Custom APIs
Edit `src/simple-api.js` to add new endpoints:

```javascript
// Add GET endpoint
fastify.get('/api/users', async (request, reply) => {
  return { users: ['Alice', 'Bob', 'Charlie'] };
});

// Add POST endpoint
fastify.post('/api/users', async (request, reply) => {
  const newUser = request.body;
  // Process new user...
  return { success: true, user: newUser };
});

// Add middleware
fastify.register(require('@fastify/helmet')); // Security headers
fastify.register(require('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
});
```

---

## 🚀 Deployment

### Production Checklist

1. **Update configuration**:
   ```env
   HEALTH_CHECK_API_KEY=secure-production-key
   ENABLE_LOGGING=true
   TRUST_PROXY=true
   HOST=0.0.0.0
   ```

2. **Install production dependencies**:
   ```bash
   npm ci --only=production
   ```

3. **Use process manager**:
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start index.js --name "fast-static-server"

   # Using systemd (Linux)
   sudo systemctl enable fast-static-server
   sudo systemctl start fast-static-server
   ```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment-Specific Configuration
Create environment-specific files:
- `.env.production` - Production settings
- `.env.staging` - Staging settings
- `.env.local` - Local overrides (not committed)

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
**Error**: `EADDRINUSE: address already in use`
**Solution**: The server automatically finds the next available port

#### HTML Files Not Loading
**Check**:
1. Files are in the `public/` directory
2. Files have `.html` extension
3. Server was restarted after adding files

#### Health Endpoint Returns 401
**Check**:
1. API key is correct: `?key=my-secret-key`
2. API key matches `.env` file
3. Using correct endpoint: `/health`

#### Poor Performance
**Check**:
1. Enable logging to identify bottlenecks
2. Check memory usage with `/health` endpoint
3. Monitor CPU usage during load tests

### Debug Mode
Enable detailed logging:
```env
ENABLE_LOGGING=true
```

View logs in console for request debugging.

### Performance Monitoring
Use the health endpoint to monitor:
```bash
# Check server health
curl "http://localhost:3000/health?key=my-secret-key"

# Monitor memory usage over time
watch -n 5 'curl -s "http://localhost:3000/health?key=my-secret-key" | jq .memory'
```

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create feature branch: `git checkout -b feature-name`
5. Make changes and test
6. Submit pull request

### Code Standards
- Use ES6+ JavaScript features
- Follow existing code style
- Add comments for complex logic
- Test all changes with benchmark suite

### Testing
```bash
# Run performance tests
npm run benchmark

# Test specific endpoints
curl http://localhost:3000/helloworld
curl "http://localhost:3000/health?key=my-secret-key"

# Load test
npx autocannon -c 50 -d 10 http://localhost:3000/helloworld
```

---

## 📞 Support

### Getting Help
- **Issues**: Report bugs on GitHub Issues
- **Performance**: Use built-in benchmark tools
- **Security**: Report security issues privately

### Useful Commands
```bash
# View server status
curl "http://localhost:3000/health?key=my-secret-key" | jq

# Test performance
npx autocannon -c 50 -d 10 http://localhost:3000/helloworld

# Check memory usage
node -e "console.log(process.memoryUsage())"

# Monitor server logs
tail -f server.log
```

---

**Built with ❤️ for fast, secure, and simple web development**