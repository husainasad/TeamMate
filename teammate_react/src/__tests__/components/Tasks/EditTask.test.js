import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditTask from './../../../components/Tasks/EditTask';
import { getTaskById, editTask } from './../../../services/Api';
import { useNavigate } from 'react-router-dom';

jest.mock('./../../../services/Api');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: () => ({ id: '1' }),
}));
jest.mock('./../../../components/Tasks/TaskForm', () => ({ initialData, onSubmit, onCancel }) => (
  <div>
    <button onClick={() => onSubmit({ title: 'Updated Task' })}>Submit</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
));
jest.mock('./../../../components/Tasks/FeedbackModal', () => ({
  ErrorModal: ({ message, onClose }) => (
    <div>
      <div>Error: {message}</div>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('EditTask Component', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <EditTask />
      </MemoryRouter>
    );

  test('renders EditTask component with loading state', async () => {
    getTaskById.mockResolvedValueOnce({ data: { title: 'Sample Task' } });

    renderComponent();

    screen.getAllByText('Loading...');

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
  });

  test('displays task data after successful fetch', async () => {
    getTaskById.mockResolvedValueOnce({ data: { title: 'Sample Task' } });

    renderComponent();

    await waitFor(() => expect(screen.getByText('Edit Sample Task')).toBeInTheDocument());
  });

  test('displays error message when failing to fetch task', async () => {
    getTaskById.mockRejectedValueOnce(new Error('Failed to fetch task'));

    renderComponent();

    await waitFor(() => expect(screen.getByText('Error: Error fetching task')).toBeInTheDocument());
  });

  test('successful task editing navigates to home page', async () => {
    getTaskById.mockResolvedValueOnce({ data: { title: 'Sample Task' } });
    editTask.mockResolvedValueOnce({});

    renderComponent();

    await waitFor(() => expect(screen.getByText('Edit Sample Task')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(editTask).toHaveBeenCalledWith('1', { title: 'Updated Task' }));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  test('displays error modal on failed task editing', async () => {
    getTaskById.mockResolvedValueOnce({ data: { title: 'Sample Task' } });
    editTask.mockRejectedValueOnce(new Error('Failed to update task'));

    renderComponent();

    await waitFor(() => expect(screen.getByText('Edit Sample Task')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(screen.getByText('Error: Error updating task')).toBeInTheDocument());
  });

  test('clicking "Cancel" navigates to home page', async () => {
    getTaskById.mockResolvedValueOnce({ data: { title: 'Sample Task' } });

    renderComponent();

    await waitFor(() => expect(screen.getByText('Edit Sample Task')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Cancel'));

    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});