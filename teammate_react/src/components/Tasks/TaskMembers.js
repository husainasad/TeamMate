import React, { useState } from 'react';
import MemberList from './MemberList';

const TaskMembers = ({ members, isOwner, ownerUsername, onRemoveMember, onAddMember }) => {
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState({ error: null, success: null });

    const handleAddMember = async () => {
        if (!newUsername.trim()) {
            setMessage({ error: 'Username cannot be empty.', success: null });
            return;
        }

        try {
            await onAddMember(newUsername);
            setMessage({ error: null, success: 'User added successfully' });
            setNewUsername('');
        } catch (error) {
            setMessage({ error: 'Error adding user', success: null });
        }
    };

    return (
        <div className="task-members bg-gray-50 p-4 rounded-md mb-6">
            {/* <h3 className="text-xl font-bold mb-4">Members</h3> */}
            <MemberList
                members={members}
                isOwner={isOwner}
                ownerUsername={ownerUsername}
                onRemoveMember={onRemoveMember}
            />
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
                    {message.error && <p className="text-red-500 mt-2">{message.error}</p>}
                    {message.success && <p className="text-green-500 mt-2">{message.success}</p>}
                </div>
            )}
        </div>
    );
};

export default TaskMembers;