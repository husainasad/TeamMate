import React, { useEffect, useState, useContext } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { getMemberTasks } from '../../services/Api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import { ErrorModal } from '../Tasks/FeedbackModal';
import TaskFilter from './TaskFilter';

const PriorityRanking = {
    Low: 1,
    Medium: 2,
    High: 3,
};

const sortTasks = (tasks, sortCriteria, sortOrder) => {
    return [...tasks].sort((a, b) => {
        if (sortCriteria === 'priority') {
            const rankA = PriorityRanking[a.priority] || 0;
            const rankB = PriorityRanking[b.priority] || 0;
            return sortOrder === 'asc' ? rankA - rankB : rankB - rankA;
        } else if (sortCriteria === 'due_date') {
            const dateA = new Date(a.due_date);
            const dateB = new Date(b.due_date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortCriteria === 'progress') {
            const progressA = parseFloat(a.progress) || 0;
            const progressB = parseFloat(b.progress) || 0;
            return sortOrder === 'asc' ? progressA - progressB : progressB - progressA;
        }
        return 0;
    });
};

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ type: null, message: '' });
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('due_date');
    const [sortOrder, setSortOrder] = useState('desc');

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
                const responseArray = Array.isArray(response.data) ? response.data : [];
                setTasks(responseArray);
                setFilteredTasks(responseArray);
            } catch (error) {
                setModal({ type: 'error', message: 'Failed to fetch tasks. Please try again later.' });
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [isAuthenticated, navigate]);

    if (loading) return <p className="text-center">Loading tasks...</p>;

    const closeModal = () => setModal({ type: null, message: '' });

    const handleSortChange = (criteria) => {
        setSortCriteria(criteria);
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const renderSortArrow = (criteria) => {
        if (sortCriteria === criteria) {
            return sortOrder === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />;
        }
        return <FaSort className="inline ml-1" />;
    };

    const sortedTasks = sortTasks(filteredTasks, sortCriteria, sortOrder);

    return (
        // <div className="p-4 max-w-4xl mx-auto">
        <div className="p-4 max-w-full md:max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Tasks</h2>
                <button
                    onClick={() => navigate('/add-task')}
                    className="text-sm font-semibold bg-green-500 hover:bg-green-600 p-2 rounded transition"
                >
                    Add Task
                </button>
            </div>
            <TaskFilter tasks={tasks} onFilter={setFilteredTasks} />
            {sortedTasks.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border-b text-center">Title</th>
                                <th
                                    className="p-2 border-b text-center cursor-pointer"
                                    onClick={() => handleSortChange('priority')}
                                >
                                    Priority {renderSortArrow('priority')}
                                </th>
                                <th
                                    className="p-2 border-b text-center cursor-pointer"
                                    onClick={() => handleSortChange('due_date')}
                                >
                                    Due Date {renderSortArrow('due_date')}
                                </th>
                                <th className="p-2 border-b text-center">Tags</th>
                                <th
                                    className="p-2 border-b text-center cursor-pointer"
                                    onClick={() => handleSortChange('progress')}
                                >
                                    Progress {renderSortArrow('progress')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTasks.map(task => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="p-2 border-b text-center">
                                        <Link to={`/tasks/${task.id}`} className="text-blue-500 hover:underline">
                                            {task.title}
                                        </Link>
                                    </td>
                                    <td className="p-2 border-b text-center">{task.priority}</td>
                                    <td className="p-2 border-b text-center">{task.due_date}</td>
                                    <td className="p-2 border-b text-center">
                                        {(task.tags || []).map(tag => tag.name).join(', ')}
                                    </td>
                                    <td className="p-2 border-b text-center">{task.progress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center">No tasks available.</p>
            )}
            {modal.type === 'error' && modal.message && (
                <ErrorModal
                    message={modal.message}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default TaskList;