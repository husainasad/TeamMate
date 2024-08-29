import React, { useEffect, useState, useContext } from 'react';
import { getTaskById, deleteTask } from '../../services/Api';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import MemberList from './MemberList';
import ErrorModal from '../Tasks/ErrorModal';
import SuccessModal from '../Tasks/SuccessModal';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({ tags: [], members: [] });
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [membersVisible, setMembersVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
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
                setErrorMessage('Failed to fetch task. Please try again later.');
                setShowErrorModal(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [isAuthenticated, navigate, id]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteTask(id);
            setSuccessMessage('Task deleted successfully');
            setShowSuccessModal(true);
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            setErrorMessage('Error deleting task');
            setShowErrorModal(true);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleMemberChange = (action, memberOrUsername) => {
        if (action === 'add') {
            setTask(prevTask => ({
                ...prevTask,
                members: [...prevTask.members, memberOrUsername]
            }));
        } else if (action === 'remove') {
            setTask(prevTask => ({
                ...prevTask,
                members: prevTask.members.filter(member => member.user !== memberOrUsername)
            }));
        }
    };

    const closeModal = () => {
        setShowErrorModal(false);
        setShowSuccessModal(false);
        setErrorMessage('');
        setSuccessMessage('');
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
                        {loading ? 'Loading task details...' : errorMessage ? 'Error loading task' : `${task.title} Details`}
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
                                disabled={isDeleting}
                                className={`bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Delete Task
                            </button>
                        )}
                    </div>
                </div>
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
                    <MemberList
                        taskId = {id}
                        members={task.members || []}
                        isOwner={isOwner}
                        ownerUsername={task.owner}
                        onMemberChange={handleMemberChange}
                    />
                )}
            </div>
            
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

export default TaskDetails;