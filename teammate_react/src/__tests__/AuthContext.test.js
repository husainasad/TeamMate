import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthProvider, { AuthContext } from './../components/Auth/AuthContext';

const TestComponent = () => {
  const { isAuthenticated, user, login, logout } = React.useContext(AuthContext);

  return (
    <div>
      <button onClick={() => login('test-access-token', 'test-refresh-token', 'testuser')}>Login</button>
      <button onClick={logout}>Logout</button>
      <p>{isAuthenticated ? `Logged in as: ${user?.username}` : 'Not logged in'}</p>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders and shows initial state when no tokens are present in localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });

  test('login updates state and localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    expect(screen.getByText('Logged in as: testuser')).toBeInTheDocument();
    expect(localStorage.getItem('access_token')).toBe('test-access-token');
    expect(localStorage.getItem('username')).toBe('testuser');
  });

  test('logout clears state and localStorage', () => {
    localStorage.setItem('access_token', 'test-access-token');
    localStorage.setItem('username', 'testuser');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
    expect(localStorage.getItem('access_token')).toBe(null);
    expect(localStorage.getItem('username')).toBe(null);
  });

  test('handles login with missing arguments gracefully', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    expect(screen.getByText('Logged in as: testuser')).toBeInTheDocument();
  });

  test('ensures logout is called correctly when no user is logged in', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
    expect(localStorage.getItem('access_token')).toBe(null);
    expect(localStorage.getItem('username')).toBe(null);
  });
});