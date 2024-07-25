import React, { useEffect, useState } from 'react';
import { getTaskById, editTask } from '../../services/Api';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const taskData = await getTaskById(id);
                setTaskData(taskData.data);
            } catch (error) {
                alert('Error fetching task');
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
        <div>
            {taskData ? (
                <TaskForm
                    initialData={taskData}
                    onSubmit={handleUpdateTask}
                    onCancel={() => navigate('/')}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditTask;