import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddTask from './../../../components/Tasks/AddTask';
import { addTask } from './../../../services/Api';
import { useNavigate } from 'react-router-dom';

jest.mock('./../../../services/Api');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('./../../../components/Tasks/TaskForm', () => ({ onSubmit, onCancel }) => (
  <div>
    <button onClick={() => onSubmit({ title: 'New Task' })}>Submit</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
));

describe('AddTask Component', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AddTask />
      </MemoryRouter>
    );

  test('renders AddTask component', () => {
    renderComponent();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('successful task addition navigates to home page', async () => {
    addTask.mockResolvedValueOnce({});

    renderComponent();

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(addTask).toHaveBeenCalledWith({ title: 'New Task' }));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  test('displays error message on failed task addition', async () => {
    addTask.mockRejectedValueOnce(new Error('Failed to add task'));

    renderComponent();

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(screen.getByText('Error adding task')).toBeInTheDocument());
    expect(screen.getByText('Error adding task')).toBeInTheDocument();
  });

  test('displays loading state while adding a task', async () => {
    const promise = new Promise(() => {});
    addTask.mockReturnValueOnce(promise);

    renderComponent();

    fireEvent.click(screen.getByText('Submit'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('clicking "Cancel" navigates to home page', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Cancel'));

    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});