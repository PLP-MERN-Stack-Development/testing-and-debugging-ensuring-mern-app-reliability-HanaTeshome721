import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../../../hooks/useLogin';
import { loginUser } from '../../../utils/api';

jest.mock('../../../utils/api');

describe('useLogin Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should set loading to true during login', async () => {
    loginUser.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.login('test@example.com', 'password123');
    });

    expect(result.current.loading).toBe(true);
  });

  it('should successfully login and store token', async () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: '1', email: 'test@example.com' },
    };

    loginUser.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('test@example.com', 'password123');
    });

    expect(loginResult).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle login error', async () => {
    const mockError = {
      response: {
        data: { error: 'Invalid credentials' },
      },
    };

    loginUser.mockRejectedValue(mockError);

    const { result } = renderHook(() => useLogin());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('test@example.com', 'wrongpassword');
    });

    expect(loginResult).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.loading).toBe(false);
  });

  it('should handle login without token in response', async () => {
    loginUser.mockResolvedValue({ user: { id: '1' } }); // No token

    const { result } = renderHook(() => useLogin());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('test@example.com', 'password123');
    });

    expect(loginResult).toBe(false);
  });
});

