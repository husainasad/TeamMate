import React, { useEffect, useState } from 'react';
import { getTaskById, editTask } from '../../services/Api';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await getTaskById(id);
                setTaskData(response.data);
            } catch (error) {
                setError('Error fetching task');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleUpdateTask = async (updatedData) => {
        try {
            await editTask(id, updatedData);
            navigate('/');
        } catch (error) {
            alert('Error updating task');
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">
                {isLoading ? 'Loading...' : error ? 'Error' : `Edit ${taskData?.title}`}
            </h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500 mb-4">{error}</p>
            ) : (
                <TaskForm
                    initialData={taskData}
                    onSubmit={handleUpdateTask}
                    onCancel={() => navigate('/')}
                />
            )}
        </div>
    );
};

export default EditTask;