import React, { useEffect, useState, useContext } from 'react';
import { getMemberTasks } from '../../services/Api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

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
                setError('Failed to fetch tasks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [isAuthenticated, navigate]);

    if (loading) {
        return <p className="text-center">Loading tasks...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Tasks</h2>
            {tasks.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border-b text-center">Title</th>
                                <th className="p-2 border-b text-center">Priority</th>
                                <th className="p-2 border-b text-center">Due Date</th>
                                <th className="p-2 border-b text-center">Tags</th>
                                <th className="p-2 border-b text-center">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="p-2 border-b text-center">
                                        <Link to={`/tasks/${task.id}`} className="text-blue-500 hover:underline">
                                            {task.title}
                                        </Link>
                                    </td>
                                    <td className="p-2 border-b text-center">{task.priority}</td>
                                    <td className="p-2 border-b text-center">{task.due_date}</td>
                                    <td className="p-2 border-b text-center">{task.tags.map(tag => tag.name).join(', ')}</td>
                                    <td className="p-2 border-b text-center">{task.progress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center">No tasks available.</p>
            )}
        </div>
    );
};

export default TaskList;