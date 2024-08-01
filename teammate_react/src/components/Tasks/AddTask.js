import React, { useState } from 'react';
import { addTask } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';

const AddTask = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddTask = async (taskData) => {
        setIsLoading(true);
        setError(null);
        try {
            await addTask(taskData);
            navigate('/');
        } catch (error) {
            setError('Error adding task');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <TaskForm
                    initialData={{}}
                    onSubmit={handleAddTask}
                    onCancel={() => navigate('/')}
                />
            )}
        </div>
    );
};

export default AddTask;