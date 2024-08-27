import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MemberList from './../../../components/Tasks/MemberList';

describe('MemberList Component', () => {
  const mockOnRemoveMember = jest.fn();

  const renderComponent = (props = {}) =>
    render(<MemberList onRemoveMember={mockOnRemoveMember} {...props} />);

  test('renders a list of members', () => {
    const members = [{ user: 'Alice' }, { user: 'Bob' }];
    renderComponent({ members, isOwner: false, ownerUsername: 'Charlie' });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('shows "No members" message when the list is empty', () => {
    renderComponent({ members: [], isOwner: false, ownerUsername: 'Charlie' });

    expect(screen.getByText('No members')).toBeInTheDocument();
  });

  test('displays "Remove Member" button for non-owner members when the user is the owner', () => {
    const members = [{ user: 'Alice' }, { user: 'Bob' }];
    renderComponent({ members, isOwner: true, ownerUsername: 'Charlie' });

    const removeButtons = screen.getAllByText('Remove Member');
    expect(removeButtons).toHaveLength(2); // Both Alice and Bob
  });

  test('hides "Remove Member" button for the owner', () => {
    const members = [{ user: 'Alice' }, { user: 'Charlie' }];
    renderComponent({ members, isOwner: true, ownerUsername: 'Charlie' });

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

  test('clicking "Remove Member" button calls onRemoveMember with correct user', () => {
    const members = [{ user: 'Alice' }, { user: 'Bob' }];
    renderComponent({ members, isOwner: true, ownerUsername: 'Charlie' });

    const removeButtons = screen.getAllByText('Remove Member');

    fireEvent.click(removeButtons[0]);

    expect(mockOnRemoveMember).toHaveBeenCalledWith('Alice');
  });
});
