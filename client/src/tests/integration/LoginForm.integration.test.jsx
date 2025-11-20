import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../../components/LoginForm';
import * as api from '../../utils/api';

jest.mock('../../utils/api');

describe('LoginForm Integration Test', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should complete full login flow', async () => {
    const mockResponse = {
      token: 'test-token-123',
      user: {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      },
    };

    api.loginUser.mockResolvedValue(mockResponse);

    const mockOnSuccess = jest.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />);

    // Fill form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Wait for API call
    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    // Check that token is stored
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token-123');
    });

    // Check success callback
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should handle API error during login', async () => {
    const mockError = {
      response: {
        data: { error: 'Invalid email or password' },
      },
    };

    api.loginUser.mockRejectedValue(mockError);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    expect(localStorage.setItem).not.toHaveBeenCalledWith('token', expect.anything());
  });
});

