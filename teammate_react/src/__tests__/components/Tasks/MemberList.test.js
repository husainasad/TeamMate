import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MemberList from './../../../components/Tasks/MemberList';
import { addMember, removeMember } from './../../../services/Api';

jest.mock('./../../../services/Api', () => ({
    addMember: jest.fn(),
    removeMember: jest.fn(),
}));

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
    )
}));

describe('MemberList Component', () => {
    const mockOnMemberChange = jest.fn();

    const renderComponent = (props = {}) =>
        render(<MemberList onMemberChange={mockOnMemberChange} {...props} />);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders a list of members', () => {
        const members = [{ user: 'Alice' }, { user: 'Bob' }];
        renderComponent({ taskId: 1, members, isOwner: false, ownerUsername: 'Charlie' });

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    test('shows "No members" message when the list is empty', () => {
        renderComponent({ taskId: 1, members: [], isOwner: false, ownerUsername: 'Charlie' });

        expect(screen.getByText('No members')).toBeInTheDocument();
    });

    test('displays "Remove Member" button for non-owner members when the user is the owner', () => {
        const members = [{ user: 'Alice' }, { user: 'Bob' }];
        renderComponent({ taskId: 1, members, isOwner: true, ownerUsername: 'Charlie' });

        const removeButtons = screen.getAllByText('Remove Member');
        expect(removeButtons).toHaveLength(2);
    });

    test('hides "Remove Member" button for the owner', () => {
        const members = [{ user: 'Alice' }, { user: 'Charlie' }];
        renderComponent({ taskId: 1, members, isOwner: true, ownerUsername: 'Charlie' });

        const removeButtonAlice = screen.getByText('Remove Member');
        expect(removeButtonAlice).toBeInTheDocument();

        const charlieRemoveButton = screen.queryByText((content, element) => {
            return (
                element.tagName.toLowerCase() === 'button' &&
                element.textContent === 'Remove Member' &&
                element.parentElement.textContent.includes('Charlie')
            );
        });

        expect(charlieRemoveButton).not.toBeInTheDocument();
    });

    test('clicking "Remove Member" button calls onMemberChange with correct user', async () => {
        const members = [{ user: 'Alice' }, { user: 'Bob' }];
        removeMember.mockResolvedValue({});

        renderComponent({ taskId: 1, members, isOwner: true, ownerUsername: 'Charlie' });

        const removeButtons = screen.getAllByText('Remove Member');
        fireEvent.click(removeButtons[0]);

        await waitFor(() => {
            expect(mockOnMemberChange).toHaveBeenCalledWith('remove', 'Alice');
        });
    });

    test('shows error modal if adding a member fails', async () => {
        const members = [{ user: 'Alice' }];
        addMember.mockRejectedValue(new Error('Error adding user'));

        renderComponent({ taskId: 1, members, isOwner: true, ownerUsername: 'Charlie' });

        fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'Bob' } });
        fireEvent.click(screen.getByText('Add Member'));

        await waitFor(() => {
            expect(screen.getByText('Error: Error adding user')).toBeInTheDocument();
        });
    });

    test('shows success modal if adding a member succeeds', async () => {
        const members = [{ user: 'Alice' }];
        addMember.mockResolvedValue({ data: { user: 'Bob' } });

        renderComponent({ taskId: 1, members, isOwner: true, ownerUsername: 'Charlie' });

        fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'Bob' } });
        fireEvent.click(screen.getByText('Add Member'));

        await waitFor(() => {
            expect(screen.getByText('Success: User added successfully')).toBeInTheDocument();
        });
    });
});