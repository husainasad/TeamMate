import React, { useState, useEffect } from 'react';
import { PRIORITY_CHOICES } from './Choices';

const TaskForm = ({ initialData, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [dueDate, setDueDate] = useState(initialData.due_date || new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState(initialData.tags ? initialData.tags.join(', ') : '');
    const [priority, setPriority] = useState(initialData.priority || 'High');
    const [progress, setProgress] = useState(initialData.progress || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            dueDate,
            tags: tags.split(',').map(tag => tag.trim()),
            priority,
            progress: parseInt(progress, 10),
        };
        onSubmit(taskData);
    };

    const handleReset = () => {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setDueDate(initialData.due_date || new Date().toISOString().split('T')[0]);
        setTags(initialData.tags ? initialData.tags.map(tag => tag.name).join(', ') : '');
        setPriority(initialData.priority || 'High');
        setProgress(initialData.progress || 0);
    };

    useEffect(() => {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setDueDate(initialData.due_date || new Date().toISOString().split('T')[0]);
        setTags(initialData.tags ? initialData.tags.map(tag => tag.name).join(', ') : '');
        setPriority(initialData.priority || 'High');
        setProgress(initialData.progress || 0);
    }, [initialData]);

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            {/* <h2 className="text-2xl font-bold mb-4">Task Form</h2> */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold">Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold">Priority:</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        {PRIORITY_CHOICES.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold">Due Date:</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold">Tags (comma-separated):</label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="font-semibold">Progress (%):</label>
                    <input
                        type="number"
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        type="reset"
                        onClick={handleReset}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;