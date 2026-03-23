/**
 * Debugger Utility
 * Helps log, track, and debug errors across the application
 */

const DEBUG_MODE = process.env.NODE_ENV === 'development';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Logger object with different severity levels
 */
const logger = {
  /**
   * Log info messages
   */
  info: (message, data) => {
    if (DEBUG_MODE) {
      console.log(
        `${colors.blue}[INFO]${colors.reset} ${message}`,
        data || ''
      );
    }
  },

  /**
   * Log warning messages
   */
  warn: (message, data) => {
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} ${message}`,
      data || ''
    );
  },

  /**
   * Log error messages
   */
  error: (message, error) => {
    console.error(
      `${colors.red}[ERROR]${colors.reset} ${message}`,
      error || ''
    );
    // Store error for potential error tracking service
    storeError(message, error);
  },

  /**
   * Log success messages
   */
  success: (message, data) => {
    if (DEBUG_MODE) {
      console.log(
        `${colors.green}[SUCCESS]${colors.reset} ${message}`,
        data || ''
      );
    }
  },

  /**
   * Log API requests
   */
  api: (method, endpoint, data) => {
    if (DEBUG_MODE) {
      console.log(
        `${colors.cyan}[API]${colors.reset} ${method} ${endpoint}`,
        data || ''
      );
    }
  },

  /**
   * Log API responses
   */
  apiResponse: (endpoint, status, data) => {
    if (DEBUG_MODE) {
      console.log(
        `${colors.green}[API RESPONSE]${colors.reset} ${endpoint} (${status})`,
        data || ''
      );
    }
  },

  /**
   * Log performance metrics
   */
  performance: (label, duration) => {
    if (DEBUG_MODE) {
      console.log(
        `${colors.cyan}[PERFORMANCE]${colors.reset} ${label}: ${duration}ms`
      );
    }
  },

  /**
   * Clear console logs
   */
  clear: () => {
    console.clear();
  },

  /**
   * Create a performance timer
   */
  timer: (label) => {
    const startTime = performance.now();
    return {
      end: () => {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        logger.performance(label, duration);
        return duration;
      },
    };
  },
};

/**
 * Store errors for debugging (can be extended to send to error tracking service)
 */
const errors = [];

const storeError = (message, error) => {
  const errorObject = {
    timestamp: new Date().toISOString(),
    message,
    error: error || '',
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  errors.push(errorObject);

  // Keep only last 50 errors to avoid memory issues
  if (errors.length > 50) {
    errors.shift();
  }

  // Optionally send to error tracking service
  if (process.env.REACT_APP_ERROR_TRACKING_ENABLED === 'true') {
    sendErrorToService(errorObject);
  }
};

/**
 * Send error to external tracking service (e.g., Sentry, LogRocket)
 */
const sendErrorToService = async (errorObject) => {
  try {
    // Configure your error tracking service endpoint here
    await fetch(process.env.REACT_APP_ERROR_TRACKING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorObject),
    });
  } catch (err) {
    console.error('Failed to send error to tracking service:', err);
  }
};

/**
 * API Error Wrapper
 * Wraps API calls with automatic error logging
 */
const withErrorHandling = (apiCall, actionName) => {
  return async (...args) => {
    try {
      const timer = logger.timer(`${actionName} API Call`);
      const response = await apiCall(...args);
      timer.end();
      logger.apiResponse(actionName, response.status, response.data);
      return response;
    } catch (error) {
      logger.error(`${actionName} - API Error`, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
      throw error;
    }
  };
};

/**
 * Get all stored errors for debugging
 */
const getErrors = () => {
  return errors;
};

/**
 * Export all utilities
 */
export default {
  logger,
  withErrorHandling,
  getErrors,
  storeError,
};

export { logger, withErrorHandling, getErrors, storeError };

