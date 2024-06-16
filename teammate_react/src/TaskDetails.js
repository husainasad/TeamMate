import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskDetails } from './services/taskService';

function TaskDetails() {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTaskDetails();
    }, [id])

    const fetchTaskDetails = async () => {
        try{
            const token = localStorage.getItem('token');
            const response = await getTaskDetails(token, id);

            if (response.status === 200) {
                setTask(response.data);
                setError('');
            }
        } catch(error){
            setError('Error fetching task details');
        }
    }

    return (
        <div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          { task && (
            <div>
                <table border="1">
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Progress (%)</th>
                    <th>Due Date</th>
                    <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{task.priority}</td>
                        <td>{task.progress}</td>
                        <td>{task.due_date}</td>
                        <td>
                            { task.tags.map((tag, index) => (
                                <span key={tag.id}>
                                    {tag.name}
                                    {index !== task.tags.length - 1 && ', '}
                                </span>
                            ))}
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
          )}
          <button onClick={() => navigate(`/taskDetails/${id}/update`)}>Update Task</button>
          <button onClick={() => navigate('/dashboard')}>Go Back</button>
        </div>
      );
}

export default TaskDetails;