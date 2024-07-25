import React from 'react';
import { addTask } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';

const AddTask = () => {
    const navigate = useNavigate();

    const handleAddTask = async (taskData) => {
        try {
            await addTask(taskData);
            navigate('/');
        } catch (error) {
            alert('Error adding task');
        }
    };

    return (
        <div>
            <TaskForm
                initialData={{}}
                onSubmit={handleAddTask}
                onCancel={() => navigate('/')}
            />
        </div>
    );
};

export default AddTask;