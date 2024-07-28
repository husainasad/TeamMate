import React, { useEffect, useState, useContext } from 'react';
import { getTaskById, deleteTask, addMember, removeMember } from '../../services/Api';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import MemberList from './MemberList';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({ tags: [], members: [] });
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState({ error: null, success: null });
    const { isAuthenticated, user } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchTask = async () => {
            try {
                const response = await getTaskById(id);
                setTask(response.data);
            } catch (error) {
                console.error('Failed to fetch task:', error);
            }
        };

        fetchTask();
    }, [isAuthenticated, navigate, id]);

    const handleDelete = async () => {
        try {
            await deleteTask(id);
            alert('Task deleted successfully');
            navigate('/');
        } catch (error) {
            alert('Error deleting task');
        }
    };

    const handleAddMember = async () => {
        if (!newUsername.trim()) {
            setMessage({ error: 'Username cannot be empty.', success: null });
            return;
        }

        try {
            const response = await addMember(id, { username: newUsername });
            const newMember = response.data;
            setTask(prevTask => ({
                ...prevTask,
                members: Array.isArray(prevTask.members) ? [...prevTask.members, newMember] : [newMember]
            }));
            setMessage({ error: null, success: 'User added successfully' });
            setNewUsername('');
        } catch (error) {
            setMessage({ error: 'Error adding user', success: null });
        }
    };

    const handleRemoveMember = async (username) => {
        try {
            await removeMember(id, { username });
            setTask(prevTask => {
                const updatedMembers = prevTask.members.filter(member => member.user !== username);
                return {
                    ...prevTask,
                    members: updatedMembers
                };
            });
            setMessage({ error: null, success: 'User removed successfully' });
        } catch (error) {
            setMessage({ error: 'Error removing user', success: null });
        }
    };

    const isOwner = task.owner === user?.username;

    return (
        <div>
            <h2>Task Details</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Tags</th>
                        <th>Progress</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.priority}</td>
                        <td>{task.due_date}</td>
                        <td>{task.tags.map(tag => tag.name).join(', ')}</td>
                        <td>{task.progress}</td>
                        <td>{task.description}</td>
                    </tr>
                </tbody>
            </table>
            <MemberList
                members={task.members || []}
                isOwner={isOwner}
                ownerUsername={task.owner}
                onRemoveMember={handleRemoveMember}
            />
            {isOwner && (
                <>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                    <button onClick={handleAddMember}>Add User</button>
                </>
            )}
            {message.error && <p style={{ color: 'red' }}>{message.error}</p>}
            {message.success && <p style={{ color: 'green' }}>{message.success}</p>}
            <button type="submit" onClick={() => navigate(`/tasks/${id}/edit-task`)}>Edit Task</button>
            {isOwner && (
                <button type="submit" onClick={handleDelete}>Delete Task</button>
            )}
        </div>
    );
};

export default TaskDetails;