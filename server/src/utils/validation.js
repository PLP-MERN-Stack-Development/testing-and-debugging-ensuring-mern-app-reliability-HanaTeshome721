/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} True if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }

  if (password.length > 50) {
    return {
      isValid: false,
      message: 'Password cannot exceed 50 characters',
    };
  }

  return {
    isValid: true,
    message: 'Password is valid',
  };
};

/**
 * Sanitize string input
 * @param {String} input - Input to sanitize
 * @returns {String} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate required fields
 * @param {Object} data - Data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result
 */
const validateRequiredFields = (data, requiredFields) => {
  const missing = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missing.join(', ')}`,
      missingFields: missing,
    };
  }

  return {
    isValid: true,
    message: 'All required fields are present',
  };
};

module.exports = {
  isValidEmail,
  validatePassword,
  sanitizeInput,
  validateRequiredFields,
};

