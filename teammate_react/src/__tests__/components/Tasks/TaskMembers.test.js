import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskMembers from './../../../components/Tasks/TaskMembers';
import MemberList from './../../../components/Tasks/MemberList';

jest.mock('./../../../components/Tasks/MemberList', () => ({ members, isOwner, onRemoveMember }) => (
    <div>
        <div>Members List:</div>
        {members.map(member => (
            <div key={member.user}>
                {member.user}
                {isOwner && <button onClick={() => onRemoveMember(member.user)}>Remove</button>}
            </div>
        ))}
    </div>
));

describe('TaskMembers Component', () => {
    const mockMembers = [{ user: 'member1' }, { user: 'member2' }];
    const mockOnRemoveMember = jest.fn();
    const mockOnAddMember = jest.fn();

    test('renders member list', () => {
        render(
            <TaskMembers
                members={mockMembers}
                isOwner={true}
                ownerUsername="owner"
                onRemoveMember={mockOnRemoveMember}
                onAddMember={mockOnAddMember}
            />
        );

        mockMembers.forEach(member => {
            expect(screen.getByText(member.user)).toBeInTheDocument();
        });
    });

    test('renders add member input and button for owner', () => {
        render(
            <TaskMembers
                members={mockMembers}
                isOwner={true}
                ownerUsername="owner"
                onRemoveMember={mockOnRemoveMember}
                onAddMember={mockOnAddMember}
            />
        );

        expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
        expect(screen.getByText('Add Member')).toBeInTheDocument();
    });

    test('does not render add member input and button for non-owner', () => {
        render(
            <TaskMembers
                members={mockMembers}
                isOwner={false}
                ownerUsername="owner"
                onRemoveMember={mockOnRemoveMember}
                onAddMember={mockOnAddMember}
            />
        );

        expect(screen.queryByPlaceholderText('Enter username')).not.toBeInTheDocument();
        expect(screen.queryByText('Add Member')).not.toBeInTheDocument();
    });

    test('handles adding a member successfully', async () => {
        mockOnAddMember.mockResolvedValueOnce();

        render(
            <TaskMembers
                members={mockMembers}
                isOwner={true}
                ownerUsername="owner"
                onRemoveMember={mockOnRemoveMember}
                onAddMember={mockOnAddMember}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'newuser' } });
        fireEvent.click(screen.getByText('Add Member'));

        await waitFor(() => {
            expect(mockOnAddMember).toHaveBeenCalledWith('newuser');
            expect(screen.getByText('User added successfully')).toBeInTheDocument();
        });
    });

    test('handles adding a member with empty username', async () => {
        render(
            <TaskMembers
                members={mockMembers}
                isOwner={true}
                ownerUsername="owner"
                onRemoveMember={mockOnRemoveMember}
                onAddMember={mockOnAddMember}
            />
        );

        fireEvent.click(screen.getByText('Add Member'));

        await waitFor(() => {
            expect(mockOnAddMember).not.toHaveBeenCalled();
            expect(screen.getByText('Username cannot be empty.')).toBeInTheDocument();
        });
    });

    test('handles removing a member', async () => {
        render(
            <TaskMembers
                members={mockMembers}
                isOwner={true}
                ownerUsername="owner"
                onRemoveMember={mockOnRemoveMember}
                onAddMember={mockOnAddMember}
            />
        );

        fireEvent.click(screen.getAllByText('Remove')[0]);

        await waitFor(() => {
            expect(mockOnRemoveMember).toHaveBeenCalledWith('member1');
        });
    });
});