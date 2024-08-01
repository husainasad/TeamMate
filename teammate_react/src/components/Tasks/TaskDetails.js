import React, { useEffect, useState, useContext } from 'react';
import { getTaskById, deleteTask, addMember, removeMember } from '../../services/Api';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import TaskMembers from './TaskMembers';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({ tags: [], members: [] });
    const [message, setMessage] = useState({ error: null, success: null });
    const [loading, setLoading] = useState(true);
    const [membersVisible, setMembersVisible] = useState(false); // State for dropdown visibility
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

    const handleAddMember = async (username) => {
        try {
            const response = await addMember(id, { username });
            const newMember = response.data;
            setTask(prevTask => ({
                ...prevTask,
                members: Array.isArray(prevTask.members) ? [...prevTask.members, newMember] : [newMember]
            }));
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

    const toggleMembersVisibility = () => {
        setMembersVisible(!membersVisible);
    };

    if (loading) {
        return <p className="text-center text-gray-500">Loading task details...</p>;
    }

    if (!task) {
        return <p className="text-center text-red-500">Task not found</p>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold mb-4">
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
                        <h3 className="text-xl font-semibold">Title:</h3>
                        <p className="text-xl">{task.title}</p>
                    </div>
                    
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold">Priority:</h3>
                        <p className="text-xl">{task.priority}</p>
                    </div>
                    
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold">Due Date:</h3>
                        <p className="text-xl">{task.due_date}</p>
                    </div>
                    
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold">Tags:</h3>
                        <p className="text-xl">{task.tags.map(tag => tag.name).join(', ')}</p>
                    </div>
                    
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold">Progress:</h3>
                        <p className="text-xl">{task.progress}</p>
                    </div>
                    
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold">Description:</h3>
                        <p className="text-xl">{task.description}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Task Members</h2>
                    <button
                        onClick={toggleMembersVisibility}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                    >
                        {membersVisible ? 'Hide Members' : 'Show Members'}
                    </button>
                </div>
                {membersVisible && (
                    <TaskMembers
                        members={task.members || []}
                        isOwner={isOwner}
                        ownerUsername={task.owner}
                        onRemoveMember={handleRemoveMember}
                        onAddMember={handleAddMember}
                    />
                )}
            </div>
        </div>
    );
};

export default TaskDetails;