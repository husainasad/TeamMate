import React from 'react';

const MemberList = ({ members = [], isOwner, ownerUsername, onRemoveMember }) => {
    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            {/* <h3 className="text-xl font-semibold mb-4">Task Members</h3> */}
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
                                    onClick={() => onRemoveMember(member.user)}
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
        </div>
    );
};

export default MemberList;