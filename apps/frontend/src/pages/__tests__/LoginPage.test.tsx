import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const loginMock = vi.fn();
const setSessionMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
    setSession: setSessionMock,
  }),
}));

vi.mock('../../components/ui/ToastProvider', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('../../api/auth', () => {
  const verifyTwoFactorLogin = vi.fn();
  return {
    authApi: {
      verifyTwoFactorLogin,
    },
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import { authApi } from '../../api/auth';
import LoginPage from '../LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invia le credenziali di login', async () => {
    loginMock.mockResolvedValueOnce({
      user: { ruolo: 'collaboratore' },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'mypassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Accedi alla piattaforma/i }));

    await waitFor(() => expect(loginMock).toHaveBeenCalled());
    expect(loginMock).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'mypassword',
    });
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('gestisce il flusso 2FA', async () => {
    loginMock.mockResolvedValueOnce({
      requiresTwoFactor: true,
      userId: 'u-2fa',
      channel: 'email',
    });
    (authApi.verifyTwoFactorLogin as any).mockResolvedValueOnce({
      user: { ruolo: 'collaboratore' },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user2@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /Accedi alla piattaforma/i }));

    await screen.findByText(/Codice 2FA inviato/i);

    fireEvent.change(screen.getByLabelText(/Codice di verifica/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Verifica e accedi/i }));

    await waitFor(() => expect(authApi.verifyTwoFactorLogin).toHaveBeenCalled());
    expect(authApi.verifyTwoFactorLogin).toHaveBeenCalledWith('u-2fa', '123456');
    expect(setSessionMock).toHaveBeenCalled();
  });
});
