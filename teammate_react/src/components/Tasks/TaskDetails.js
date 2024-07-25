import React, { useEffect, useState, useContext } from 'react';
import { getTaskById, deleteTask, addMember, removeMember } from '../../services/Api';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({ tags: [], is_owner: false, members: [] });
    const [newUsername, setNewUsername] = useState('');
    const [usernameToRemove, setUsernameToRemove] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        const fetchTask = async () => {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }
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
            setError('Username cannot be empty.');
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const response = await addMember(id, { username: newUsername });
            const newMember = response.data;
            setTask(prevTask => ({
                ...prevTask,
                members: Array.isArray(prevTask.members) ? [...prevTask.members, newMember] : [newMember]
            }));
            setSuccess('User added successfully');
            setNewUsername('');
        } catch (error) {
            setError('Error adding user');
        }
    };

    const handleRemoveMember = async () => {
        if (!usernameToRemove.trim()) {
            setError('Username cannot be empty.');
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            await removeMember(id, { username: usernameToRemove });
            setTask(prevTask => ({
                ...prevTask,
                members: Array.isArray(prevTask.members) ? prevTask.members.filter(member => member.username !== usernameToRemove) : []
            }));
            setSuccess('User removed successfully');
            setUsernameToRemove('');
        } catch (error) {
            setError('Error removing user');
        }
    };

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
            {task.is_owner && (
                <>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                    <button onClick={handleAddMember}>Add User</button>
                    <input
                        type="text"
                        value={usernameToRemove}
                        onChange={(e) => setUsernameToRemove(e.target.value)}
                        placeholder="Enter username to remove"
                    />
                    <button onClick={handleRemoveMember}>Remove User</button>
                </>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <button type="submit" onClick={() => navigate(`/tasks/${id}/edit-task`)}>Edit</button>
            {task.is_owner && (
                <button type="submit" onClick={handleDelete}>Delete</button>
            )}
        </div>
    );
};

export default TaskDetails;