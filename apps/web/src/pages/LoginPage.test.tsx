import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../hooks/useAuth';
import { LoginPage } from './LoginPage';

vi.mock('../services/api', () => ({
  clearSession: vi.fn(),
  login: vi.fn().mockResolvedValue({
    accessToken: 'access',
    refreshToken: 'refresh',
    user: {
      id: 'user-1',
      email: 'admin.demo@bchealth.local',
      displayName: 'Demo Administrator',
      roles: ['ADMINISTRATOR'],
    },
  }),
  logout: vi.fn(),
}));

afterEach(() => cleanup());

describe('LoginPage', () => {
  it('submits valid login credentials', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('toggles password visibility without changing the submitted field', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const password = screen.getByLabelText('Password');
    expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');
  });
});
