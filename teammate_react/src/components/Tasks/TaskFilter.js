import React, { useState, useEffect, useMemo } from 'react';
import { PRIORITY_CHOICES } from './Choices';

const TaskFilter = ({ tasks, onFilter }) => {
    const [priorityFilter, setPriorityFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');

    const filteredTasks = useMemo(() => {
        const tagsArray = tagFilter
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0);

        return (tasks || []).filter(task => {
            const priorityMatch = priorityFilter ? task.priority === priorityFilter : true;
            const tagMatch = tagsArray.length > 0 
                ? (task.tags || []).some(taskTag => 
                    tagsArray.some(tag => taskTag.name.toLowerCase().includes(tag))
                )
                : true;
            const nameMatch = nameFilter ? task.title.toLowerCase().includes(nameFilter.toLowerCase()) : true;

            return priorityMatch && tagMatch && nameMatch;
        });
    }, [tasks, priorityFilter, tagFilter, nameFilter]);

    useEffect(() => {
        onFilter(filteredTasks);
    }, [filteredTasks, onFilter]);

    return (
        <div className="mb-4 p-4 bg-white shadow-md rounded-md">
            <div className="flex flex-col md:flex-row md:space-x-4 items-center">
                <div className="w-full mb-4 md:mb-0">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Filter by Name:</label>
                    <input
                        type="text"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition"
                        placeholder="Task name"
                    />
                </div>
                <div className="w-full mb-4 md:mb-0">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Filter by Priority:</label>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition"
                    >
                        <option value="">All</option>
                        {PRIORITY_CHOICES.map((choice) => (
                            <option key={choice} value={choice}>
                                {choice}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full mb-4 md:mb-0">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Filter by Tags:</label>
                    <input
                        type="text"
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition"
                        placeholder="Comma separated tags"
                    />
                </div>
                <button
                    onClick={() => {
                        setPriorityFilter('');
                        setTagFilter('');
                        setNameFilter('');
                    }}
                    className="py-2 px-4 bg-gray-200 border border-gray-300 text-gray-700 rounded-md leading-tight focus:outline-none hover:bg-gray-300 transition mt-4 md:mt-0 md:self-end"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default TaskFilter;