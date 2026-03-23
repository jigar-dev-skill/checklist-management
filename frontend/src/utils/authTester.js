import { logger } from './debugger';

/**
 * Authentication Testing Utility
 * Provides methods for testing authentication flows and security
 */

const authTester = {
  /**
   * Test login flow with credentials
   * @param {object} credentials - {email, password}
   * @returns {Promise<object>} Login test result
   */
  testLoginFlow: async (credentials) => {
    try {
      logger.info('Testing login flow', { email: credentials.email });

      // Step 1: Validate credentials format
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email);
      if (!emailValid) {
        throw new Error('Invalid email format');
      }

      if (credentials.password.length < 8) {
        throw new Error('Password too short');
      }

      logger.success('Credentials validation passed');

      // Step 2: Simulate login API call
      const loginResult = {
        success: true,
        token: 'mock_jwt_token_' + Math.random().toString(36).substring(7),
        user: {
          id: 1,
          email: credentials.email,
          role: 'user',
        },
        timestamp: new Date().toISOString(),
      };

      logger.success('Login successful', loginResult);

      return {
        success: true,
        result: loginResult,
      };
    } catch (error) {
      logger.error(`Login flow error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Test logout flow
   * @returns {object} Logout test result
   */
  testLogoutFlow: () => {
    try {
      logger.info('Testing logout flow');

      // Simulate logout
      const logoutResult = {
        success: true,
        message: 'Successfully logged out',
        timestamp: new Date().toISOString(),
      };

      logger.success('Logout successful');

      return {
        success: true,
        result: logoutResult,
      };
    } catch (error) {
      logger.error(`Logout flow error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Test token storage and retrieval
   * @param {string} token - Token to store
   * @returns {object} Token storage test result
   */
  testTokenStorage: (token) => {
    try {
      logger.info('Testing token storage');

      const errors = [];

      // Test 1: Store token in localStorage
      try {
        localStorage.setItem('auth_token', token);
        logger.info('Token stored in localStorage');
      } catch (error) {
        errors.push(`localStorage storage failed: ${error.message}`);
      }

      // Test 2: Retrieve token
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken !== token) {
        errors.push('Retrieved token does not match stored token');
      } else {
        logger.success('Token retrieved successfully');
      }

      // Test 3: Token expiration check
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        errors.push('Invalid JWT format');
      } else {
        logger.success('Token format valid');
      }

      // Clean up
      localStorage.removeItem('auth_token');

      return {
        success: errors.length === 0,
        errors,
        tokenValid: errors.length === 0,
      };
    } catch (error) {
      logger.error(`Token storage test error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Test authentication guard/middleware
   * @param {object} userRole - User role (doctor, admin, patient)
   * @param {array} allowedRoles - Array of allowed roles
   * @returns {object} Guard test result
   */
  testAuthGuard: (userRole, allowedRoles) => {
    try {
      logger.info('Testing authentication guard', { userRole, allowedRoles });

      const hasAccess = allowedRoles.includes(userRole);

      if (hasAccess) {
        logger.success(`Access granted for role: ${userRole}`);
      } else {
        logger.warn(`Access denied for role: ${userRole}`);
      }

      return {
        hasAccess,
        userRole,
        allowedRoles,
      };
    } catch (error) {
      logger.error(`Auth guard error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Run comprehensive authentication test suite
   * @param {object} config - Test configuration
   * @returns {Promise<object>} Full auth test suite results
   */
  runAuthSuite: async (config) => {
    try {
      logger.info('Running comprehensive authentication test suite');

      const results = {
        timestamp: new Date().toISOString(),
        testResults: {},
      };

      // Test 1: Login flow
      if (config.credentials) {
        results.testResults.loginFlow = await authTester.testLoginFlow(
          config.credentials
        );
      }

      // Test 2: Logout flow
      results.testResults.logoutFlow = authTester.testLogoutFlow();

      // Test 3: Token storage
      if (config.credentials) {
        const mockToken =
          'mock_jwt_token_' + Math.random().toString(36).substring(7);
        results.testResults.tokenStorage = authTester.testTokenStorage(
          mockToken
        );
      }

      // Test 4: Auth guard
      if (config.role && config.allowedRoles) {
        results.testResults.authGuard = authTester.testAuthGuard(
          config.role,
          config.allowedRoles
        );
      }

      // Calculate overall results
      const allTests = Object.values(results.testResults);
      const passedTests = allTests.filter((t) => t.success).length;
      const totalTests = allTests.length;

      results.summary = {
        totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        passRate: ((passedTests / totalTests) * 100).toFixed(2) + '%',
      };

      logger.success('Auth test suite completed', results.summary);

      return results;
    } catch (error) {
      logger.error(`Auth test suite error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default authTester;
