import React, { useState } from 'react';
import { addMember, removeMember } from '../../services/Api';
import ErrorModal from '../Tasks/ErrorModal';
import SuccessModal from '../Tasks/SuccessModal';

const MemberList = ({ taskId, members = [], isOwner, ownerUsername, onMemberChange }) => {
    const [newUsername, setNewUsername] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');    

    const handleAddMember = async () => {
        if (!newUsername.trim()) {
            setErrorMessage('Username cannot be empty');
            setShowErrorModal(true);
            return;
        }

        try {
            const response = await addMember(taskId, { username: newUsername });
            const newMember = response.data;
            onMemberChange('add', newMember);
            setSuccessMessage('User added successfully');
            setShowSuccessModal(true);
            setNewUsername('');
        } catch (error) {
            setErrorMessage('Error adding user');
            setShowErrorModal(true);
        }
    };

    const handleRemoveMember = async (username) => {
        try {
            await removeMember(taskId, { username });
            onMemberChange('remove', username);
            setSuccessMessage('User removed successfully');
            setShowSuccessModal(true);
        } catch (error) {
            setErrorMessage('Error removing user');
            setShowErrorModal(true);
        }
    };

    const closeModal = () => {
        setShowErrorModal(false);
        setShowSuccessModal(false);
        setErrorMessage('');
        setSuccessMessage('');
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

            {showErrorModal && (
                <ErrorModal
                    message={errorMessage}
                    onClose={closeModal}
                />
            )}

            {showSuccessModal && (
                <SuccessModal
                    message={successMessage}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default MemberList;