import React, { useState } from 'react';
import { addTask } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';
import ErrorModal from '../Tasks/ErrorModal';

const AddTask = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddTask = async (taskData) => {
        setIsLoading(true);
        try {
            await addTask(taskData);
            navigate('/');
        } catch (error) {
            setErrorMessage('Error Adding Task. Please try again.');
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
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
            {showErrorModal && (
                <ErrorModal
                    message={errorMessage}
                    onClose={() => setShowErrorModal(false)}
                />
            )}
        </div>
    );
};

export default AddTask;