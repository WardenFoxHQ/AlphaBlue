const autocannon = require('autocannon');
const { performance } = require('perf_hooks');

class PerformanceBenchmark {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:3000';
    this.results = [];
  }

  async runBasicBenchmark() {
    console.log('🚀 Running basic performance benchmark...');

    const result = await autocannon({
      url: this.baseUrl,
      connections: 100,
      duration: 30,
      pipelining: 10,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    });

    this.results.push({
      name: 'Basic Load Test',
      timestamp: new Date().toISOString(),
      ...result
    });

    return result;
  }

  async runUserEndpointBenchmark() {
    console.log('👥 Running user endpoint benchmark...');

    const result = await autocannon({
      url: `${this.baseUrl}/users/1`,
      connections: 200,
      duration: 30,
      pipelining: 10,
      headers: {
        'accept': 'application/json'
      }
    });

    this.results.push({
      name: 'User Endpoint Test',
      timestamp: new Date().toISOString(),
      ...result
    });

    return result;
  }

  async runConcurrentMixedLoad() {
    console.log('🔄 Running mixed concurrent load test...');

    const endpoints = [
      '/',
      '/users/1',
      '/users/100',
      '/users?page=1&limit=10',
      '/health'
    ];

    const promises = endpoints.map(endpoint => {
      return autocannon({
        url: `${this.baseUrl}${endpoint}`,
        connections: 50,
        duration: 20,
        pipelining: 5
      });
    });

    const results = await Promise.all(promises);

    const aggregated = {
      name: 'Mixed Concurrent Load',
      timestamp: new Date().toISOString(),
      endpoints: endpoints.length,
      totalRequests: results.reduce((sum, r) => sum + r.requests.total, 0),
      avgThroughput: results.reduce((sum, r) => sum + r.throughput.average, 0),
      avgLatency: results.reduce((sum, r) => sum + r.latency.average, 0) / results.length,
      results
    };

    this.results.push(aggregated);
    return aggregated;
  }

  async runStressTest() {
    console.log('💪 Running stress test with high concurrency...');

    const result = await autocannon({
      url: this.baseUrl,
      connections: 500,
      duration: 60,
      pipelining: 20,
      headers: {
        'accept': 'application/json'
      }
    });

    this.results.push({
      name: 'High Concurrency Stress Test',
      timestamp: new Date().toISOString(),
      ...result
    });

    return result;
  }

  async runCustomBenchmark(options) {
    console.log(`🎯 Running custom benchmark: ${options.name}...`);

    const result = await autocannon({
      url: options.url || this.baseUrl,
      connections: options.connections || 100,
      duration: options.duration || 30,
      pipelining: options.pipelining || 10,
      method: options.method || 'GET',
      headers: options.headers || { 'accept': 'application/json' },
      body: options.body
    });

    this.results.push({
      name: options.name,
      timestamp: new Date().toISOString(),
      ...result
    });

    return result;
  }

  async measureMemoryUsage() {
    console.log('📊 Measuring memory usage...');

    const start = process.memoryUsage();
    const startTime = performance.now();

    // Simulate some load
    for (let i = 0; i < 100000; i++) {
      Math.random() * 1000;
    }

    const endTime = performance.now();
    const end = process.memoryUsage();

    const memoryDelta = {
      rss: end.rss - start.rss,
      heapUsed: end.heapUsed - start.heapUsed,
      heapTotal: end.heapTotal - start.heapTotal,
      external: end.external - start.external
    };

    const result = {
      name: 'Memory Usage Test',
      timestamp: new Date().toISOString(),
      duration: endTime - startTime,
      startMemory: start,
      endMemory: end,
      memoryDelta,
      iterations: 100000
    };

    this.results.push(result);
    return result;
  }

  formatResults(result) {
    if (!result) return 'No results available';

    return `
📈 Performance Results:
• Requests/sec: ${result.requests?.average?.toLocaleString() || 'N/A'}
• Total Requests: ${result.requests?.total?.toLocaleString() || 'N/A'}
• Throughput: ${result.throughput?.average?.toFixed(2) || 'N/A'} MB/s
• Latency (avg): ${result.latency?.average?.toFixed(2) || 'N/A'}ms
• Latency (p99): ${result.latency?.p99?.toFixed(2) || 'N/A'}ms
• Duration: ${result.duration || 'N/A'}s
• Connections: ${result.connections || 'N/A'}
• Errors: ${result.errors || 0}
    `;
  }

  generateReport() {
    console.log('\n📋 PERFORMANCE BENCHMARK REPORT');
    console.log('================================');

    this.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.name}`);
      console.log(`   Time: ${result.timestamp}`);
      console.log(this.formatResults(result));
    });

    const summary = this.getSummary();
    console.log('\n🏆 SUMMARY');
    console.log('===========');
    console.log(summary);

    return {
      results: this.results,
      summary
    };
  }

  getSummary() {
    if (this.results.length === 0) return 'No tests run';

    const totalRequests = this.results.reduce((sum, r) => sum + (r.requests?.total || 0), 0);
    const avgThroughput = this.results.reduce((sum, r) => sum + (r.requests?.average || 0), 0) / this.results.length;
    const bestThroughput = Math.max(...this.results.map(r => r.requests?.average || 0));

    return `
• Total Tests: ${this.results.length}
• Total Requests Processed: ${totalRequests.toLocaleString()}
• Average Throughput: ${avgThroughput.toFixed(0)} req/sec
• Best Throughput: ${bestThroughput.toLocaleString()} req/sec
• Server Performance: ${this.getPerformanceRating(bestThroughput)}
    `;
  }

  getPerformanceRating(throughput) {
    if (throughput > 50000) return '🚀 EXTREME PERFORMANCE';
    if (throughput > 30000) return '⚡ EXCELLENT PERFORMANCE';
    if (throughput > 15000) return '🔥 VERY GOOD PERFORMANCE';
    if (throughput > 8000) return '✅ GOOD PERFORMANCE';
    if (throughput > 3000) return '⚠️  AVERAGE PERFORMANCE';
    return '❌ NEEDS OPTIMIZATION';
  }

  async runFullSuite() {
    console.log('🎯 Starting comprehensive performance test suite...\n');

    try {
      await this.runBasicBenchmark();
      await new Promise(resolve => setTimeout(resolve, 2000));

      await this.runUserEndpointBenchmark();
      await new Promise(resolve => setTimeout(resolve, 2000));

      await this.runConcurrentMixedLoad();
      await new Promise(resolve => setTimeout(resolve, 2000));

      await this.measureMemoryUsage();
      await new Promise(resolve => setTimeout(resolve, 2000));

      await this.runStressTest();

      return this.generateReport();
    } catch (error) {
      console.error('❌ Benchmark failed:', error.message);
      throw error;
    }
  }
}

module.exports = { PerformanceBenchmark };

if (require.main === module) {
  const benchmark = new PerformanceBenchmark();

  const args = process.argv.slice(2);
  const testType = args[0] || 'full';

  (async () => {
    try {
      switch (testType) {
        case 'basic':
          await benchmark.runBasicBenchmark();
          break;
        case 'stress':
          await benchmark.runStressTest();
          break;
        case 'memory':
          await benchmark.measureMemoryUsage();
          break;
        case 'mixed':
          await benchmark.runConcurrentMixedLoad();
          break;
        case 'full':
        default:
          await benchmark.runFullSuite();
          break;
      }
    } catch (error) {
      console.error('Benchmark error:', error);
      process.exit(1);
    }
  })();
}