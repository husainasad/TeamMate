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
    const [loading, setLoading] = useState(true);
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
                setMessage({ error: 'Failed to fetch task. Please try again later.', success: null });
            } finally {
                setLoading(false);
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

    if (loading) {
        return <p className="text-center text-gray-500">Loading task details...</p>;
    }

    if (!task) {
        return <p className="text-center text-red-500">Task not found</p>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">
                    {loading ? 'Loading task details...' : message.error ? 'Error loading task' : `${task.title} Details`}
                </h2>
                <div className="space-x-2">
                    <button
                        type="button"
                        onClick={() => navigate(`/tasks/${id}/edit-task`)}
                        className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition"
                    >
                        Edit Task
                    </button>
                    {isOwner && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                        >
                            Delete Task
                        </button>
                    )}
                </div>
            </div>
            
            {message.error && <p className="text-red-500 mb-4 text-center">{message.error}</p>}
            {message.success && <p className="text-green-500 mb-4 text-center">{message.success}</p>}
            
            <div className="task-details mb-6">
                <div className="mb-4">
                    <h3 className="text-2xl font-semibold">Title:</h3>
                    <p className="text-xl">{task.title}</p>
                </div>
                
                <div className="mb-4">
                    <h3 className="text-2xl font-semibold">Priority:</h3>
                    <p className="text-xl">{task.priority}</p>
                </div>
                
                <div className="mb-4">
                    <h3 className="text-2xl font-semibold">Due Date:</h3>
                    <p className="text-xl">{task.due_date}</p>
                </div>
                
                <div className="mb-4">
                    <h3 className="text-2xl font-semibold">Tags:</h3>
                    <p className="text-xl">{task.tags.map(tag => tag.name).join(', ')}</p>
                </div>
                
                <div className="mb-4">
                    <h3 className="text-2xl font-semibold">Progress:</h3>
                    <p className="text-xl">{task.progress}</p>
                </div>
                
                <div className="mb-4">
                    <h3 className="text-2xl font-semibold">Description:</h3>
                    <p className="text-xl">{task.description}</p>
                </div>
            </div>
            
            <div className="task-members bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-2xl font-semibold mb-2">Members</h3>
                <MemberList
                    members={task.members || []}
                    isOwner={isOwner}
                    ownerUsername={task.owner}
                    onRemoveMember={handleRemoveMember}
                />
            </div>
            
            {isOwner && (
                <div className="add-member bg-gray-100 p-4 rounded-md">
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
        </div>
    );
};

export default TaskDetails;