import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskDetails from './../../../components/Tasks/TaskDetails';
import { getTaskById, deleteTask } from './../../../services/Api';
import { AuthContext } from './../../../components/Auth/AuthContext';
import MemberList from './../../../components/Tasks/MemberList';
import { ErrorModal, SuccessModal } from './../../../components/Tasks/FeedbackModal';
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('./../../../services/Api');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));
jest.mock('./../../../components/Tasks/MemberList', () => ({ members, onMemberChange, isOwner, taskId }) => (
    <div>
        <div>Members List:</div>
        {members.map(member => (
            <div key={member.user}>
                {member.user}
                {isOwner && (
                    <button onClick={() => onMemberChange('remove', member.user)}>Remove</button>
                )}
            </div>
        ))}
        {isOwner && (
            <button onClick={() => onMemberChange('add', { user: 'newuser' })}>Add Member</button>
        )}
    </div>
));
jest.mock('./../../../components/Tasks/FeedbackModal', () => ({
    ErrorModal: ({ message, onClose }) => (
        <div>
            <div>Error: {message}</div>
            <button onClick={onClose}>Close</button>
        </div>
    ),
    SuccessModal: ({ message, onClose }) => (
        <div>
            <div>Success: {message}</div>
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

describe('TaskDetails Component', () => {
    const navigateMock = jest.fn();
    const mockTask = {
        id: 1,
        title: 'Sample Task',
        priority: 'High',
        due_date: '2024-09-01',
        tags: [{ name: 'urgent' }],
        progress: 'In Progress',
        description: 'Task Description',
        owner: 'testuser',
        members: [{ user: 'member1' }]
    };
    const mockUser = { username: 'testuser' };

    beforeAll(() => {
        window.alert = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(navigateMock);
        useParams.mockReturnValue({ id: '1' });
        jest.useFakeTimers();
    });

    const renderComponent = (isAuthenticated) =>
        render(
            <AuthContext.Provider value={{ isAuthenticated, user: mockUser }}>
                <MemoryRouter initialEntries={['/tasks/1']}>
                    <Routes>
                        <Route path="/tasks/:id" element={<TaskDetails />} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );

    test('renders loading state initially', async () => {
        const loadingPromise = new Promise(() => {});
        getTaskById.mockReturnValueOnce(loadingPromise);

        await act(async () => {
            renderComponent(true);
        });

        expect(screen.getByText('Loading task details...')).toBeInTheDocument();
    });

    test('renders error message on failed task fetch', async () => {
        getTaskById.mockRejectedValueOnce(new Error('Failed to fetch task'));

        await act(async () => {
            renderComponent(true);
        });

        await waitFor(() =>
            expect(screen.getByText('Error: Failed to fetch task. Please try again later.')).toBeInTheDocument()
        );
    });

    test('renders task details when data is fetched successfully', async () => {
        getTaskById.mockResolvedValueOnce({ data: mockTask });

        await act(async () => {
            renderComponent(true);
        });

        await waitFor(() => {
            expect(screen.getByText('Sample Task')).toBeInTheDocument();
            expect(screen.getByText('High')).toBeInTheDocument();
            expect(screen.getByText('2024-09-01')).toBeInTheDocument();
            expect(screen.getByText('urgent')).toBeInTheDocument();
            expect(screen.getByText('In Progress')).toBeInTheDocument();
            expect(screen.getByText('Task Description')).toBeInTheDocument();
        });
    });

    test('handles task deletion and shows success modal', async () => {
        getTaskById.mockResolvedValueOnce({ data: mockTask });
        deleteTask.mockResolvedValueOnce({});

        await act(async () => {
            renderComponent(true);
        });

        fireEvent.click(screen.getByText('Delete Task'));

        await waitFor(() => {
            expect(screen.getByText('Success: Task deleted successfully')).toBeInTheDocument();
        });

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/'));
    });

    test('handles adding and removing members', async () => {
        getTaskById.mockResolvedValueOnce({ data: mockTask });

        await act(async () => {
            renderComponent(true);
        });

        fireEvent.click(screen.getByText('Show Members'));

        await waitFor(() => expect(screen.getByText('Members List:')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Add Member'));

        await waitFor(() => expect(screen.getByText('newuser')).toBeInTheDocument());

        const removeButtons = screen.queryAllByText('Remove');
        expect(removeButtons.length).toBe(2);
        
        fireEvent.click(removeButtons[0]);

        await waitFor(() => expect(screen.queryByText('member1')).not.toBeInTheDocument());
    });

    test('toggles task members visibility', async () => {
        getTaskById.mockResolvedValueOnce({ data: mockTask });

        await act(async () => {
            renderComponent(true);
        });

        fireEvent.click(screen.getByText('Show Members'));

        await waitFor(() => expect(screen.getByText('Members List:')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Hide Members'));

        await waitFor(() => expect(screen.queryByText('Members List:')).not.toBeInTheDocument());
    });
});