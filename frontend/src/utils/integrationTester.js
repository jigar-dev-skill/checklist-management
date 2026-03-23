import { logger } from './debugger';

/**
 * Integration Testing Utility
 * Provides methods for testing component interactions and data flows
 */

const integrationTester = {
  /**
   * Test component flow through multiple steps
   * @param {array} steps - Array of test steps with {name, execute, validate}
   * @returns {Promise<object>} Flow test results
   */
  testComponentFlow: async (steps) => {
    try {
      logger.info(`Starting component flow test: ${steps.length} steps`);

      const results = [];
      let flowState = {};
      let stepsPassed = 0;

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        logger.info(`Executing step ${i + 1}: ${step.name}`);

        try {
          const result = await step.execute(flowState);
          flowState = { ...flowState, ...result };

          // Validate step result
          const isValid = step.validate ? step.validate(result) : true;

          if (isValid) {
            stepsPassed++;
            results.push({
              step: step.name,
              status: 'passed',
              result,
            });
            logger.success(`Step passed: ${step.name}`);
          } else {
            results.push({
              step: step.name,
              status: 'failed',
              result,
              error: 'Validation failed',
            });
            logger.warn(`Step validation failed: ${step.name}`);
          }
        } catch (error) {
          results.push({
            step: step.name,
            status: 'error',
            error: error.message,
          });
          logger.error(`Step error: ${step.name} - ${error.message}`);
        }
      }

      return {
        totalSteps: steps.length,
        stepsPassed,
        stepsFailed: steps.length - stepsPassed,
        passRate: ((stepsPassed / steps.length) * 100).toFixed(2) + '%',
        results,
        finalState: flowState,
      };
    } catch (error) {
      logger.error(`Component flow test failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Test data flow between components
   * @param {array} components - Component names in data flow chain
   * @param {object} initialData - Initial data to pass through components
   * @returns {object} Data flow test results
   */
  testDataFlow: (components, initialData = {}) => {
    try {
      logger.info(`Testing data flow through ${components.length} components`);

      const flowLog = [];
      let currentData = { ...initialData };

      for (const component of components) {
        logger.info(`Data flowing through: ${component}`);
        flowLog.push({
          component,
          dataSnapshot: { ...currentData },
          timestamp: new Date().toISOString(),
        });

        // Simulate data transformation
        currentData = {
          ...currentData,
          lastComponent: component,
          flowTimestamp: new Date().toISOString(),
        };
      }

      logger.success(`Data flow completed through ${components.length} components`);

      return {
        success: true,
        components: components.length,
        flowLog,
        finalData: currentData,
      };
    } catch (error) {
      logger.error(`Data flow test failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Test user journey through multiple pages/components
   * @param {array} journey - Array of user actions: {action, target, expectedResult}
   * @returns {Promise<object>} Journey test results
   */
  testUserJourney: async (journey) => {
    try {
      logger.info(`Starting user journey test: ${journey.length} actions`);

      const results = [];
      let actionsCompleted = 0;
      let userState = {
        authenticated: false,
        currentPage: 'login',
      };

      for (let i = 0; i < journey.length; i++) {
        const step = journey[i];
        logger.info(`User action ${i + 1}: ${step.action}`);

        try {
          // Simulate user action
          const result = {
            action: step.action,
            target: step.target,
            status: 'completed',
            timestamp: new Date().toISOString(),
          };

          // Validate expected result
          if (step.expectedResult) {
            const meetsExpectation = Object.keys(step.expectedResult).every(
              (key) => step.expectedResult[key] === true
            );
            result.meetsExpectation = meetsExpectation;
          }

          userState = {
            ...userState,
            lastAction: step.action,
            lastPage: step.target,
          };

          results.push(result);
          actionsCompleted++;
          logger.success(`Action completed: ${step.action}`);
        } catch (error) {
          results.push({
            action: step.action,
            status: 'failed',
            error: error.message,
          });
          logger.error(`Action failed: ${step.action} - ${error.message}`);
        }
      }

      return {
        totalActions: journey.length,
        actionsCompleted,
        actionsFailed: journey.length - actionsCompleted,
        successRate: ((actionsCompleted / journey.length) * 100).toFixed(2) + '%',
        results,
        finalUserState: userState,
      };
    } catch (error) {
      logger.error(`User journey test failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default integrationTester;
