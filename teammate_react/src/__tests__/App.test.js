import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from './../components/Auth/AuthContext';
import { App } from './../App';

jest.mock('./../components/Tasks/TaskList', () => () => <div>TaskList Component</div>);
jest.mock('./../components/Tasks/AddTask', () => () => <div>AddTask Component</div>);
jest.mock('./../components/Tasks/EditTask', () => () => <div>EditTask Component</div>);
jest.mock('./../components/Tasks/TaskDetails', () => () => <div>TaskDetails Component</div>);
jest.mock('./../components/Auth/Login', () => () => <div>Login Component</div>);
jest.mock('./../components/Auth/Register', () => () => <div>Register Component</div>);
jest.mock('./../components/Tasks/Header', () => () => <div>Header Component</div>);

describe('App Component', () => {

  const renderWithRoute = (route, isAuthenticated = true) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <AuthContext.Provider value={{ isAuthenticated }}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  test('renders Login component for /login route', () => {
    renderWithRoute('/login');
    expect(screen.getByText('Login Component')).toBeInTheDocument();
    expect(screen.queryByText('Header Component')).not.toBeInTheDocument();
  });

  test('renders Register component for /register route', () => {
    renderWithRoute('/register');
    expect(screen.getByText('Register Component')).toBeInTheDocument();
    expect(screen.queryByText('Header Component')).not.toBeInTheDocument();
  });

  test('renders TaskList component for authenticated user at root route', () => {
    renderWithRoute('/', true);
    expect(screen.getByText('TaskList Component')).toBeInTheDocument();
    expect(screen.getByText('Header Component')).toBeInTheDocument();
  });

  test('redirects to login for unauthenticated user at root route', () => {
    renderWithRoute('/', false);
    expect(screen.queryByText('TaskList Component')).not.toBeInTheDocument();
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  test('renders AddTask component for authenticated user at /add-task route', () => {
    renderWithRoute('/add-task', true);
    expect(screen.getByText('AddTask Component')).toBeInTheDocument();
    expect(screen.getByText('Header Component')).toBeInTheDocument();
  });

  test('renders EditTask component for authenticated user at /tasks/:id/edit route', () => {
    renderWithRoute('/tasks/1/edit-task', true);
    expect(screen.getByText('EditTask Component')).toBeInTheDocument();
    expect(screen.getByText('Header Component')).toBeInTheDocument();
  });

  test('renders TaskDetails component for authenticated user at /tasks/:id route', () => {
    renderWithRoute('/tasks/1', true);
    expect(screen.getByText('TaskDetails Component')).toBeInTheDocument();
    expect(screen.getByText('Header Component')).toBeInTheDocument();
  });
});
