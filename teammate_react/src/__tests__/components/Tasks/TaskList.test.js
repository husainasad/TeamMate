import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TaskList from './../../../components/Tasks/TaskList';
import { getMemberTasks } from './../../../services/Api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../../components/Auth/AuthContext';
import userEvent from '@testing-library/user-event';

jest.mock('./../../../services/Api');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('TaskList Component', () => {
    const navigateMock = jest.fn();
    const mockTasks = [
        {
            id: 1,
            title: 'Task 1',
            priority: 'High',
            due_date: '2024-09-01',
            tags: [{ name: 'urgent' }],
            progress: 'In Progress',
        },
        {
            id: 2,
            title: 'Task 2',
            priority: 'Low',
            due_date: '2024-09-05',
            tags: [{ name: 'optional' }],
            progress: 'Not Started',
        },
    ];

    beforeEach(() => {
        useNavigate.mockReturnValue(navigateMock);
    });

    const renderComponent = (isAuthenticated) =>
        render(
            <AuthContext.Provider value={{ isAuthenticated }}>
                <MemoryRouter>
                    <TaskList />
                </MemoryRouter>
            </AuthContext.Provider>
        );

    test('redirects to login if not authenticated', async () => {
        await act(async () => {
            renderComponent(false);
        });

        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/login'));
    });

    test('renders loading state initially', async () => {
        const loadingPromise = new Promise(() => {});
        getMemberTasks.mockReturnValueOnce(loadingPromise);
    
        renderComponent(true);
    
        expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });

    test('renders error message on failed task fetch', async () => {
        getMemberTasks.mockRejectedValueOnce(new Error('Failed to fetch tasks'));

        await act(async () => {
            renderComponent(true);
        });

        await waitFor(() =>
            expect(screen.getByText('Failed to fetch tasks. Please try again later.')).toBeInTheDocument()
        );
    });

    test('renders task list when tasks are available', async () => {
        getMemberTasks.mockResolvedValueOnce({ data: mockTasks });

        await act(async () => {
            renderComponent(true);
        });

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
            expect(screen.getByText('High')).toBeInTheDocument();
            expect(screen.getByText('Low')).toBeInTheDocument();
            expect(screen.getByText('2024-09-01')).toBeInTheDocument();
            expect(screen.getByText('2024-09-05')).toBeInTheDocument();
            expect(screen.getByText('urgent')).toBeInTheDocument();
            expect(screen.getByText('optional')).toBeInTheDocument();
            expect(screen.getByText('In Progress')).toBeInTheDocument();
            expect(screen.getByText('Not Started')).toBeInTheDocument();
        });
    });

    test('renders no tasks available message when no tasks are present', async () => {
        getMemberTasks.mockResolvedValueOnce({ data: [] });

        await act(async () => {
            renderComponent(true);
        });

        await waitFor(() => expect(screen.getByText('No tasks available.')).toBeInTheDocument());
    });

    test('clicking "Add Task" navigates to add-task page', async () => {
        getMemberTasks.mockResolvedValueOnce({ data: mockTasks });

        await act(async () => {
            renderComponent(true);
        });

        const addTaskButton = screen.getByText('Add Task');
        userEvent.click(addTaskButton);

        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/add-task'));
    });
});