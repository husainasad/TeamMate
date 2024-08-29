import React, { useState } from 'react';
import { addTask } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';
import { ErrorModal } from '../Tasks/FeedbackModal';

const AddTask = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState({ type: null, message: '' });

    const handleAddTask = async (taskData) => {
        setIsLoading(true);
        try {
            await addTask(taskData);
            navigate('/');
        } catch (error) {
            setModal({ type: 'error', message: 'Error Adding Task. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setModal({ type: null, message: '' });
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <TaskForm
                    initialData={{}}
                    onSubmit={handleAddTask}
                    onCancel={() => navigate('/')}
                />
            )}
            {modal.type && modal.type === 'error' && (
                <ErrorModal
                    message={modal.message}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default AddTask;