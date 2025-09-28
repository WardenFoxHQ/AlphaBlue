// Ultra-lightweight API framework - 70k+ req/sec
// Save PORT before dotenv potentially overwrites it
const envPort = process.env.PORT;
require('dotenv').config();
// Restore PORT if it was set via environment
if (envPort) process.env.PORT = envPort;

const fastify = require('fastify')({
  logger: process.env.ENABLE_LOGGING === 'true',
  disableRequestLogging: process.env.ENABLE_LOGGING !== 'true',
  ignoreTrailingSlash: true,
  trustProxy: process.env.TRUST_PROXY === 'true',
  onProtoPoisoning: 'error',
  onConstructorPoisoning: 'error',
  maxParamLength: parseInt(process.env.MAX_PARAM_LENGTH) || 100,
  bodyLimit: parseInt(process.env.BODY_LIMIT) || 1024,
  keepAliveTimeout: parseInt(process.env.KEEP_ALIVE_TIMEOUT) || 5000,
  connectionTimeout: parseInt(process.env.CONNECTION_TIMEOUT) || 5000,
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
  caseSensitive: false
});

const fs = require('fs');
const path = require('path');

// Register CORS for frontend development
fastify.register(require('@fastify/cors'), {
  origin: true, // Allow all origins in development
  credentials: true
});

// Register static files with caching
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '../public/assets'),
  prefix: '/assets/',
  cacheControl: true,
  maxAge: 31536000000, // 1 year cache for static assets
  immutable: true
});

const port = process.argv[2] || process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const serverName = process.env.SERVER_NAME || `Simple-API-${port}`;

// Load all HTML files from public folder into memory at startup
const htmlFiles = {};
const publicDirName = process.env.PUBLIC_DIR || 'public';
const publicDir = path.resolve(__dirname, `../${publicDirName}`);

// Security: Validate path to prevent directory traversal
function isValidFilePath(filePath, baseDir) {
  const resolvedPath = path.resolve(baseDir, filePath);
  const normalizedBase = path.resolve(baseDir);
  return resolvedPath.startsWith(normalizedBase);
}

try {
  // Security: Check if public directory exists and is accessible
  if (!fs.existsSync(publicDir)) {
    console.error('❌ Public directory does not exist');
    process.exit(1);
  }

  const files = fs.readdirSync(publicDir);
  const htmlFilesList = files.filter(file => {
    // Security: Only allow .html files, prevent path traversal
    return file.endsWith('.html') &&
           !/[\/\\]/.test(file) &&
           !/\.\./.test(file) &&
           /^[\w\-\.]+\.html$/.test(file);
  });

  if (htmlFilesList.length === 0) {
    console.error('❌ No valid HTML files found in public folder');
    process.exit(1);
  }

  // Process files quietly for clean output
  let loadedCount = 0;
  let skippedCount = 0;

  htmlFilesList.forEach(file => {
    const filePath = path.join(publicDir, file);

    // Security: Double-check path is safe
    if (!isValidFilePath(file, publicDir)) {
      console.error(`❌ Invalid file path detected: ${file}`);
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const routeName = path.basename(file, '.html');

    // Security: Sanitize route name
    if (!/^[\w\-]+$/.test(routeName)) {
      console.error(`❌ Invalid route name: ${routeName}`);
      process.exit(1);
    }

    htmlFiles[routeName] = content;
    loadedCount++;
  });

  // Clean summary instead of spam
  if (loadedCount <= 5) {
    // Show individual files only if 5 or fewer
    Object.keys(htmlFiles).forEach(route => {
      console.log(`📄 /${route}`);
    });
  } else {
    // Just show summary for many files
    console.log(`📄 Loading ${loadedCount} HTML files...`);
  }

  console.log(`📁 ${loadedCount} HTML files loaded into memory`);
} catch (err) {
  console.error('❌ Could not load HTML files:', err.message);
  process.exit(1);
}

// Pre-compiled responses for maximum speed
const helloWorldResponse = 'Hello World!';

// Ultra-fast JSON API endpoint
fastify.get('/helloworld', (request, reply) => {
  reply.header('content-type', 'text/plain; charset=utf-8');
  reply.send(helloWorldResponse);
});

// Dynamic HTML endpoints - create route for each loaded HTML file (skip 'helloworld' to avoid conflict)
Object.keys(htmlFiles).forEach(routeName => {
  if (routeName !== 'helloworld') {
    fastify.get(`/${routeName}`, (request, reply) => {
      reply.header('content-type', 'text/html; charset=utf-8');
      reply.send(htmlFiles[routeName]);
    });

  }
});

// Backward compatibility endpoint
fastify.get('/helloworld-heavy', (request, reply) => {
  reply.header('content-type', 'text/html; charset=utf-8');
  reply.send(htmlFiles['helloworld'] || 'HTML file not found');
});

// Custom error handlers - plain text responses
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404);
  reply.header('content-type', 'text/plain; charset=utf-8');
  reply.send('404 Not Found');
});

fastify.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500;
  reply.code(statusCode);
  reply.header('content-type', 'text/plain; charset=utf-8');

  if (statusCode === 503) {
    reply.send('503 Service Unavailable');
  } else if (statusCode === 500) {
    reply.send('500 Internal Server Error');
  } else {
    reply.send(`${statusCode} Error`);
  }
});

// API key protected health check endpoint
fastify.get('/health', (request, reply) => {
  const apiKey = request.headers['x-api-key'] || request.query.key;
  const expectedKey = process.env.HEALTH_CHECK_API_KEY;

  // Security warning for default API key
  if (expectedKey === 'dev-health-check-key-12345') {
    reply.code(403);
    reply.header('content-type', 'text/plain; charset=utf-8');
    reply.send('403 Forbidden - Change default API key in .env file for security');
    return;
  }

  if (!apiKey || apiKey !== expectedKey) {
    reply.code(401);
    reply.header('content-type', 'text/plain; charset=utf-8');
    reply.send('401 Unauthorized');
    return;
  }

  // Convert memory from bytes to MB for readability
  const memoryUsage = process.memoryUsage();
  const memoryInMB = {
    rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100 + ' MB',
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100 + ' MB',
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100 + ' MB',
    external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100 + ' MB'
  };

  // Format uptime with units
  const uptimeSeconds = process.uptime();
  let formattedUptime;
  if (uptimeSeconds < 60) {
    formattedUptime = Math.round(uptimeSeconds * 100) / 100 + ' seconds';
  } else if (uptimeSeconds < 3600) {
    const minutes = Math.floor(uptimeSeconds / 60);
    const seconds = Math.round(uptimeSeconds % 60);
    formattedUptime = `${minutes} min ${seconds} sec`;
  } else if (uptimeSeconds < 86400) {
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    formattedUptime = `${hours} hr ${minutes} min`;
  } else {
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    formattedUptime = `${days} days ${hours} hr`;
  }

  reply.header('content-type', 'application/json; charset=utf-8');
  reply.send({
    status: 'healthy',
    uptime: formattedUptime,
    memory: memoryInMB,
    loadedHtmlFiles: Object.keys(htmlFiles).length
  });
});

// Root endpoint - serve index.html if exists, otherwise show available files
fastify.get('/', (request, reply) => {
  // If index.html exists, serve it at root
  if (htmlFiles.index) {
    reply.header('content-type', 'text/html; charset=utf-8');
    reply.send(htmlFiles.index);
    return;
  }

  // Otherwise show available HTML files and endpoints
  const htmlRoutes = Object.keys(htmlFiles).map(route => `/${route}`);
  const apiRoutes = ['/helloworld', '/health'];

  reply.header('content-type', 'application/json; charset=utf-8');
  reply.send({
    server: serverName,
    htmlPages: htmlRoutes,
    apiEndpoints: apiRoutes,
    staticAssets: '/assets/*',
    author: 'Warden Fox'
  });
});

// Start server
const start = async () => {
  try {
    process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || 1;

    let currentPort = parseInt(port);
    let serverStarted = false;

    // Try to find an available port if default is in use
    while (!serverStarted && currentPort < parseInt(port) + 10) {
      try {
        await fastify.listen({
          port: currentPort,
          host: host,
          backlog: 511,
          ipv6Only: false
        });
        serverStarted = true;
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          if (currentPort === parseInt(port)) {
            console.log(`\x1b[33m🔍 Port ${currentPort} in use, searching for available port...\x1b[0m`);
          }
          currentPort++;
        } else {
          throw err;
        }
      }
    }

    if (!serverStarted) {
      console.error(`❌ Could not find available port in range ${port}-${parseInt(port) + 10}`);
      process.exit(1);
    }

    // Clean colorful dashboard
    console.log('\n\x1b[36m╔══════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[36m║\x1b[0m                 \x1b[1m\x1b[32m⚡ Fast Static Server\x1b[0m                  \x1b[36m║\x1b[0m');
    console.log('\x1b[36m║\x1b[0m               \x1b[33mOptimized for HTML/CSS/JS\x1b[0m                \x1b[36m║\x1b[0m');
    console.log('\x1b[36m║\x1b[0m                     \x1b[33mv0.0.1 AlphaBlue\x1b[0m                     \x1b[36m║\x1b[0m');
    console.log('\x1b[36m╠══════════════════════════════════════════════════════════╣\x1b[0m');
    console.log(`\x1b[36m║\x1b[0m \x1b[1m\x1b[32m🌐 Server:\x1b[0m http://localhost:${currentPort}                        \x1b[36m║\x1b[0m`);
    console.log(`\x1b[36m║\x1b[0m \x1b[1m\x1b[34m📄 Content:\x1b[0m ${Object.keys(htmlFiles).length} HTML files in memory                      \x1b[36m║\x1b[0m`);
    console.log(`\x1b[36m║\x1b[0m \x1b[1m\x1b[35m📁 Assets:\x1b[0m /assets/* (CSS, JS, Images cached)\x1b[0m             \x1b[36m║\x1b[0m`);
    console.log('\x1b[36m╠══════════════════════════════════════════════════════════╣\x1b[0m');
    const htmlCount = Object.keys(htmlFiles).length;
    console.log(`\x1b[36m║\x1b[0m \x1b[1m\x1b[35mSTATIC PAGES:\x1b[0m ${htmlCount} at http://localhost:${currentPort}/[filename]    \x1b[36m║\x1b[0m`);
    console.log(`\x1b[36m║\x1b[0m \x1b[1m\x1b[35mAPI HELPERS:\x1b[0m /helloworld, /health \x1b[90m(API key in .env)\x1b[0m     \x1b[36m║\x1b[0m`);
    console.log('\x1b[36m╚══════════════════════════════════════════════════════════╝\x1b[0m');
    console.log('\x1b[90mPress Ctrl+C to stop • Serving static content at maximum speed\x1b[0m\n');

  } catch (err) {
    console.error(`❌ ${serverName} failed:`, err);
    process.exit(1);
  }
};

start();

// Global error handlers to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => fastify.close(() => process.exit(0)));
process.on('SIGINT', () => fastify.close(() => process.exit(0)));