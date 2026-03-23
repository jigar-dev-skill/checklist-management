import { logger } from './debugger';

/**
 * API Testing Utility
 * Provides comprehensive testing methods for API endpoints
 */

const apiTester = {
  /**
   * Test a single API endpoint
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
   * @param {string} url - Full endpoint URL
   * @param {object} options - Request options (headers, body, params)
   * @returns {Promise<object>} Response with status, data, and error info
   */
  testEndpoint: async (method, url, options = {}) => {
    const startTime = Date.now();
    try {
      logger.api(`Testing ${method} ${url}`, options);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      const result = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
        duration,
        headers: Object.fromEntries(response.headers),
      };

      logger.apiResponse(result);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`API test failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        duration,
      };
    }
  },

  /**
   * Test multiple API endpoints in sequence
   * @param {array} endpoints - Array of endpoint configs: {method, url, options}
   * @returns {Promise<array>} Results array
   */
  testEndpoints: async (endpoints) => {
    const results = [];
    for (const endpoint of endpoints) {
      const result = await apiTester.testEndpoint(
        endpoint.method,
        endpoint.url,
        endpoint.options
      );
      results.push(result);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay between requests
    }
    return results;
  },

  /**
   * Validate API response format matches expected schema
   * @param {object} response - API response object
   * @param {object} schema - Expected schema object
   * @returns {object} Validation result with errors array
   */
  validateResponseFormat: (response, schema) => {
    const errors = [];

    const validateSchema = (data, schemaRef, path = '') => {
      for (const key in schemaRef) {
        const fullPath = path ? `${path}.${key}` : key;
        if (!(key in data)) {
          errors.push(`Missing required field: ${fullPath}`);
        } else if (typeof schemaRef[key] === 'string') {
          const actualType = typeof data[key];
          if (actualType !== schemaRef[key]) {
            errors.push(
              `Type mismatch at ${fullPath}: expected ${schemaRef[key]}, got ${actualType}`
            );
          }
        } else if (typeof schemaRef[key] === 'object') {
          validateSchema(data[key], schemaRef[key], fullPath);
        }
      }
    };

    validateSchema(response, schema);

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Perform stress test on API endpoint
   * @param {string} method - HTTP method
   * @param {string} url - Endpoint URL
   * @param {number} requestCount - Number of requests to send
   * @returns {Promise<object>} Stress test results
   */
  stressTest: async (method, url, requestCount = 10) => {
    logger.info(`Starting stress test: ${requestCount} requests to ${url}`);
    const results = [];
    const startTime = Date.now();

    for (let i = 0; i < requestCount; i++) {
      try {
        const response = await fetch(url, { method });
        results.push({
          success: response.ok,
          status: response.status,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    const totalDuration = Date.now() - startTime;
    const successful = results.filter((r) => r.success).length;
    const failed = results.length - successful;
    const avgResponseTime = totalDuration / requestCount;

    return {
      totalRequests: requestCount,
      successful,
      failed,
      successRate: ((successful / requestCount) * 100).toFixed(2) + '%',
      totalDuration,
      avgResponseTime: Math.round(avgResponseTime),
      results,
    };
  },
};

export default apiTester;
