import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './../components/Auth/Register';
import { registerUser } from './../services/Api';
import { useNavigate } from 'react-router-dom';

jest.mock('./../services/Api');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Register Component', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

  test('renders Register component', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('successful registration navigates to login', async () => {
    registerUser.mockResolvedValueOnce({});

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(registerUser).toHaveBeenCalledWith({ username: 'testuser', email: 'testuser@example.com', password: 'password123' }));
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('failed registration displays error message', async () => {
    registerUser.mockRejectedValueOnce(new Error('Registration failed'));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'wronguser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => screen.getByText('Registration failed. Please try again.'));
    expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
  });

  test('clicking "Login Here" navigates to login page', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Login Here'));
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});