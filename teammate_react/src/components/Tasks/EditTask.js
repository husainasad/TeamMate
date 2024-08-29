import React, { useEffect, useState } from 'react';
import { getTaskById, editTask } from '../../services/Api';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';
import ErrorModal from '../Tasks/ErrorModal';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await getTaskById(id);
                setTaskData(response.data);
            } catch (error) {
                setErrorMessage('Error fetching task');
                setShowErrorModal(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleUpdateTask = async (updatedData) => {
        setIsLoading(true);
        try {
            await editTask(id, updatedData);
            navigate('/');
        } catch (error) {
            setErrorMessage('Error updating task');
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">
                {isLoading ? 'Loading...' : `Edit ${taskData?.title}`}
            </h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <TaskForm
                    initialData={taskData}
                    onSubmit={handleUpdateTask}
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

export default EditTask;