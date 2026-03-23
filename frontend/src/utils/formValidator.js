import { logger } from './debugger';

/**
 * Form Validation Testing Utility
 * Provides comprehensive form validation methods
 */

const formValidator = {
  /**
   * Validate entire form against schema
   * @param {object} formData - Form data object
   * @param {object} schema - Validation schema with rules for each field
   * @returns {object} Validation result with errors array
   */
  validateForm: (formData, schema) => {
    try {
      logger.info('Validating form', { fieldCount: Object.keys(schema).length });

      const errors = [];
      const validatedFields = {};

      for (const fieldName in schema) {
        const rules = schema[fieldName];
        const fieldValue = formData[fieldName];

        // Check required
        if (rules.required && (!fieldValue || fieldValue.trim() === '')) {
          errors.push(`${fieldName} is required`);
          validatedFields[fieldName] = false;
          continue;
        }

        // Check type
        if (rules.type && fieldValue) {
          const isValid = formValidator.validateType(fieldValue, rules.type);
          if (!isValid) {
            errors.push(
              `${fieldName} must be of type ${rules.type}`
            );
            validatedFields[fieldName] = false;
            continue;
          }
        }

        // Check minimum length
        if (rules.minLength && fieldValue && fieldValue.length < rules.minLength) {
          errors.push(
            `${fieldName} must be at least ${rules.minLength} characters`
          );
          validatedFields[fieldName] = false;
          continue;
        }

        // Check maximum length
        if (rules.maxLength && fieldValue && fieldValue.length > rules.maxLength) {
          errors.push(
            `${fieldName} must not exceed ${rules.maxLength} characters`
          );
          validatedFields[fieldName] = false;
          continue;
        }

        // Check pattern (regex)
        if (rules.pattern && fieldValue) {
          const regex = new RegExp(rules.pattern);
          if (!regex.test(fieldValue)) {
            errors.push(`${fieldName} format is invalid`);
            validatedFields[fieldName] = false;
            continue;
          }
        }

        validatedFields[fieldName] = true;
      }

      const isValid = errors.length === 0;
      logger.info(`Form validation ${isValid ? 'passed' : 'failed'}`, {
        valid: isValid,
        errorCount: errors.length,
      });

      return {
        valid: isValid,
        errors,
        validatedFields,
      };
    } catch (error) {
      logger.error(`Form validation error: ${error.message}`);
      return {
        valid: false,
        errors: [error.message],
      };
    }
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    logger.info(`Email validation: ${email} - ${isValid ? 'valid' : 'invalid'}`);
    return isValid;
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} Password validation result with strength score
   */
  validatePassword: (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };

    const strengthScore =
      Object.values(checks).filter((check) => check).length;
    const strengthLevels = [
      'very weak',
      'weak',
      'fair',
      'good',
      'strong',
      'very strong',
    ];
    const strength = strengthLevels[strengthScore];

    logger.info(`Password strength: ${strength}`, checks);

    return {
      valid: strengthScore >= 3,
      strength,
      strengthScore,
      checks,
    };
  },

  /**
   * Validate field type
   * @param {any} value - Value to validate
   * @param {string} type - Expected type (email, number, phone, url)
   * @returns {boolean} Is valid type
   */
  validateType: (value, type) => {
    const validators = {
      email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      number: (val) => !isNaN(val) && val.toString().trim() !== '',
      phone: (val) => /^\d{10,}$/.test(val.replace(/\D/g, '')),
      url: (val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      text: (val) => typeof val === 'string',
    };

    const validator = validators[type] || (() => true);
    return validator(value);
  },

  /**
   * Test form validation with multiple test cases
   * @param {array} testCases - Array of test cases: {name, data, schema, shouldPass}
   * @returns {object} Test results summary
   */
  testFormValidation: (testCases) => {
    try {
      logger.info(`Running ${testCases.length} form validation test cases`);

      const results = [];
      let passed = 0;
      let failed = 0;

      for (const testCase of testCases) {
        const validation = formValidator.validateForm(testCase.data, testCase.schema);
        const testPassed = validation.valid === testCase.shouldPass;

        if (testPassed) {
          passed++;
          logger.success(`Test passed: ${testCase.name}`);
        } else {
          failed++;
          logger.error(`Test failed: ${testCase.name}`);
        }

        results.push({
          name: testCase.name,
          passed: testPassed,
          validation,
        });
      }

      return {
        total: testCases.length,
        passed,
        failed,
        passRate: ((passed / testCases.length) * 100).toFixed(2) + '%',
        results,
      };
    } catch (error) {
      logger.error(`Form validation test error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default formValidator;
