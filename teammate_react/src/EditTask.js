import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskDetails, updateTask } from './services/taskService';
import TaskForm from './components/taskForm';

function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await getTaskDetails(token, id);
            if (response.status === 200) {
                setTask(response.data);
            }
        } catch (error) {
            setError('Error fetching task details');
        }
    };

    const handleSubmit = async (taskData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await updateTask(token, id, taskData);
            if (response.status === 200) {
            navigate('/dashboard');
            }
        } catch (error) {
            setError('Error updating task');
        }
    };

  return (
    <div>
      <h3>Edit Task</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {task && <TaskForm onSubmit={handleSubmit} initialValues={task} />}
      <button onClick={() => navigate('/dashboard')}>Go Back</button>
    </div>
  );
}

export default EditTask;
