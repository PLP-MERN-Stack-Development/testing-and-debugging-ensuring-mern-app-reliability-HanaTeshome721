import {
  formatDate,
  truncateText,
  isValidEmail,
  debounce,
  getToken,
  isAuthenticated,
} from '../../../utils/helpers';

describe('Helper Utils', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('formatDate', () => {
    it('should format a valid date', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/December 25, 2023/);
    });

    it('should format a date string', () => {
      const formatted = formatDate('2023-12-25');
      expect(formatted).toMatch(/December 25, 2023/);
    });

    it('should return empty string for invalid date', () => {
      expect(formatDate('invalid')).toBe('');
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      const longText = 'a'.repeat(150);
      const truncated = truncateText(longText, 100);
      expect(truncated.length).toBe(103); // 100 + '...'
      expect(truncated).toEndWith('...');
    });

    it('should return original text if shorter than maxLength', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 100)).toBe(shortText);
    });

    it('should handle empty or null text', () => {
      expect(truncateText('', 100)).toBe('');
      expect(truncateText(null, 100)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.useRealTimers();
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      expect(getToken()).toBe('test-token');
    });

    it('should return null if no token', () => {
      expect(getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('token', 'test-token');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false if no token', () => {
      expect(isAuthenticated()).toBe(false);
    });
  });
});

