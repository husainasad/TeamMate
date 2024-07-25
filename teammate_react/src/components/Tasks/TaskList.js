import React, { useEffect, useState, useContext } from 'react';
import { getMemberTasks } from '../../services/Api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTasks = async () => {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }
            try {
                const response = await getMemberTasks();
                setTasks(response.data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        };

        fetchTasks();
    }, [isAuthenticated, navigate]);

    return (
        <div>
            <h2>Tasks</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Tags</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>
                                <Link to={`/tasks/${task.id}`} >
                                    {task.title}
                                </Link>
                            </td>
                            <td>{task.priority}</td>
                            <td>{task.due_date}</td>
                            <td>{task.tags.map(tag => tag.name).join(', ')}</td>
                            <td>{task.progress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;