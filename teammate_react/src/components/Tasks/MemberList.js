import React, { useState } from 'react';
import { addMember, removeMember } from '../../services/Api';
import { ErrorModal, SuccessModal} from '../Tasks/FeedbackModal';

const MemberList = ({ taskId, members = [], isOwner, ownerUsername, onMemberChange }) => {
    const [newUsername, setNewUsername] = useState('');
    const [modal, setModal] = useState({ type: null, message: '' });

    const handleAddMember = async () => {
        if (!newUsername.trim()) {
            setModal({ type: 'error', message: 'Username cannot be empty' });
            return;
        }

        try {
            const response = await addMember(taskId, { username: newUsername });
            const newMember = response.data;
            onMemberChange('add', newMember);
            setModal({ type: 'success', message: 'User added successfully' });
            setNewUsername('');
        } catch (error) {
            setModal({ type: 'error', message: 'Error adding user' });
        }
    };

    const handleRemoveMember = async (username) => {
        try {
            await removeMember(taskId, { username });
            onMemberChange('remove', username);
            setModal({ type: 'success', message: 'User removed successfully' });
        } catch (error) {
            setModal({ type: 'error', message: 'Error removing user' });
        }
    };

    const closeModal = () => {
        setModal({ type: null, message: '' });
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <ul className="space-y-2">
                {members.length > 0 ? (
                    members.map((member, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between p-2 border border-gray-200 rounded-md"
                        >
                            <span>{member.user}</span>
                            {isOwner && member.user !== ownerUsername && (
                                <button
                                    onClick={() => handleRemoveMember(member.user)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                >
                                    Remove Member
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No members</li>
                )}
            </ul>

            {isOwner && (
                <div className="add-member bg-gray-100 p-4 rounded-md mt-4">
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    />
                    <button
                        onClick={handleAddMember}
                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                    >
                        Add Member
                    </button>
                </div>
            )}

            {modal.type && modal.type === 'error' && (
                <ErrorModal
                    message={modal.message}
                    onClose={closeModal}
                />
            )}

            {modal.type && modal.type === 'success' && (
                <SuccessModal
                    message={modal.message}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default MemberList;