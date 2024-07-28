import React from 'react';

const MemberList = ({ members, isOwner, ownerUsername, onRemoveMember }) => {
    return (
        <div>
            <h3>Task Members</h3>
            <ul>
                {members && members.length > 0 ? (
                    members.map((member,index) => (
                        <li key={index}>
                            {member.user}
                            {isOwner && member.user !== ownerUsername && (
                                <button onClick={() => onRemoveMember(member.user)}>Remove</button>
                            )}
                        </li>
                    ))
                ) : (
                    <li>No members</li>
                )}
            </ul>
        </div>
    );
};

export default MemberList;