import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './../../../components/Auth/Login';
import { AuthContext } from './../../../components/Auth/AuthContext';
import { loginUser } from './../../../services/Api';
import { useNavigate } from 'react-router-dom';

jest.mock('./../../../services/Api');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  const navigateMock = jest.fn();
  const loginMock = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: loginMock }}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  test('renders Login component', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('successful login navigates to root', async () => {
    loginUser.mockResolvedValueOnce({ data: { access: 'access-token', refresh: 'refresh-token' } });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(loginMock).toHaveBeenCalledWith('access-token', 'refresh-token', 'testuser'));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  test('failed login displays error message', async () => {
    loginUser.mockRejectedValueOnce(new Error('Login failed'));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => screen.getByText('Login failed. Please check your credentials and try again.'));
    expect(screen.getByText('Login failed. Please check your credentials and try again.')).toBeInTheDocument();
  });

  test('clicking "Register Here" navigates to register page', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Register Here'));
    expect(navigateMock).toHaveBeenCalledWith('/register');
  });
});
