import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthProvider, { AuthContext } from '../../../components/Auth/AuthContext';
import PrivateRoute from './../../../components/Auth/PrivateRoute';

jest.mock('./../../../components/Tasks/Header', () => () => <div>Header</div>);

const TestComponent = () => <div>Protected Content</div>;

describe('PrivateRoute', () => {
  const renderWithAuthProvider = (isAuthenticated) => {
    return render(
      <AuthProvider>
        <AuthContext.Provider value={{ isAuthenticated }}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route path="/protected" element={<PrivateRoute><TestComponent /></PrivateRoute>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      </AuthProvider>
    );
  };

  test('renders children and header when authenticated', () => {
    renderWithAuthProvider(true);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login page when not authenticated', () => {
    renderWithAuthProvider(false);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
