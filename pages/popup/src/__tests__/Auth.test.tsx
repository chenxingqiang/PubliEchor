// pages/popup/src/__tests__/Auth.test.tsx

import { supabase } from '@packages/supabase-client';
import { fireEvent, render, waitFor } from '@testing-library/react';
import Auth from '../components/Auth';

jest.mock('@packages/supabase-client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

describe('Auth Component', () => {
  it('renders without crashing', () => {
    render(<Auth />);
  });

  it('handles sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<Auth />);

    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(getByText('Sign Up'));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  // Add more tests for sign in and sign out...
});
