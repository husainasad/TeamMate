import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from './../../../components/Auth/AuthContext';
import Header from './../../../components/Tasks/Header';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Header Component', () => {
  const navigateMock = jest.fn();
  const logoutMock = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
  });

  const renderComponent = (authValue) =>
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    );

  test('renders header with login and register buttons when not authenticated', () => {
    const authValue = { isAuthenticated: false, user: null, logout: logoutMock };

    renderComponent(authValue);

    expect(screen.getByText('You are not logged in')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('renders header with welcome message and logout button when authenticated', () => {
    const authValue = { isAuthenticated: true, user: { username: 'JohnDoe' }, logout: logoutMock };

    renderComponent(authValue);

    expect(screen.getByText('Welcome JohnDoe!')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('navigates to home when clicking the home button', () => {
    const authValue = { isAuthenticated: false, user: null, logout: logoutMock };

    renderComponent(authValue);

    fireEvent.click(screen.getByRole('button', { name: /Home/i }));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  test('navigates to login when clicking the login button', () => {
    const authValue = { isAuthenticated: false, user: null, logout: logoutMock };

    renderComponent(authValue);

    fireEvent.click(screen.getByText('Login'));
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('navigates to register when clicking the register button', () => {
    const authValue = { isAuthenticated: false, user: null, logout: logoutMock };

    renderComponent(authValue);

    fireEvent.click(screen.getByText('Register'));
    expect(navigateMock).toHaveBeenCalledWith('/register');
  });

  test('logs out and navigates to home when clicking the logout button', () => {
    const authValue = { isAuthenticated: true, user: { username: 'JohnDoe' }, logout: logoutMock };

    renderComponent(authValue);

    fireEvent.click(screen.getByText('Logout'));
    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});