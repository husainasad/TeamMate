import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTask } from './services/taskService';
import TaskForm from './components/taskForm';

function AddTask() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (taskData) => {

        try {
          const token = localStorage.getItem('token');
          const response = await addTask(token, taskData);
    
          if (response.status === 201) {
            navigate('/dashboard');
          }
        } catch (error) {
          setError('Error adding task');
        }
    };

    return (
        <div>
            <h3>Let's add a new task</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <TaskForm onSubmit={handleSubmit}/>
            <button onClick={() => navigate('/dashboard')}>Go Back</button>
        </div>
    );
};

export default AddTask;