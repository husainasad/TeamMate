import React, { useEffect, useState } from 'react';
import { getTaskById, editTask } from '../../services/Api';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';
import { ErrorModal } from '../Tasks/FeedbackModal';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ type: null, message: '' });

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await getTaskById(id);
                setTaskData(response.data);
            } catch (error) {
                setModal({ type: 'error', message: 'Error fetching task' });
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
            setModal({ type: 'error', message: 'Error updating task' });
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setModal({ type: null, message: '' });
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
            {modal.type && modal.type === 'error' && (
                <ErrorModal
                    message={modal.message}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default EditTask;