const {
  isValidEmail,
  validatePassword,
  sanitizeInput,
  validateRequiredFields,
} = require('../../../src/utils/validation');

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('invalid@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return valid for passwords with 6+ characters', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Password is valid');
    });

    it('should return invalid for passwords shorter than 6 characters', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password must be at least 6 characters long');
    });

    it('should return invalid for passwords longer than 50 characters', () => {
      const longPassword = 'a'.repeat(51);
      const result = validatePassword(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password cannot exceed 50 characters');
    });

    it('should return invalid for empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace from input', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });

    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(123)).toBe('');
      expect(sanitizeInput({})).toBe('');
    });

    it('should handle normal text correctly', () => {
      expect(sanitizeInput('normal text')).toBe('normal text');
    });
  });

  describe('validateRequiredFields', () => {
    it('should return valid when all required fields are present', () => {
      const data = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      const result = validateRequiredFields(data, ['username', 'email', 'password']);
      
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('All required fields are present');
    });

    it('should return invalid when required fields are missing', () => {
      const data = {
        username: 'testuser',
        // email and password missing
      };
      const result = validateRequiredFields(data, ['username', 'email', 'password']);
      
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('email');
      expect(result.missingFields).toContain('password');
    });

    it('should return invalid for empty string values', () => {
      const data = {
        username: 'testuser',
        email: '   ', // whitespace only
        password: 'password123',
      };
      const result = validateRequiredFields(data, ['username', 'email', 'password']);
      
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('email');
    });
  });
});

