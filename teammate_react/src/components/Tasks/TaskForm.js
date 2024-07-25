import React, { useState, useEffect } from 'react';
import { PRIORITY_CHOICES } from './Choices';

const TaskForm = ({ initialData, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [dueDate, setDueDate] = useState(initialData.due_date || new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState(initialData.tags || '');
    const [priority, setPriority] = useState(initialData.priority || 'High');
    const [progress, setProgress] = useState(initialData.progress || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            dueDate,
            tags,
            priority,
            progress: parseInt(progress, 10),
        };
        onSubmit(taskData);
    };

    const handleReset = () => {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setDueDate(initialData.due_date || new Date().toISOString().split('T')[0]);
        setTags(initialData.tags ? initialData.tags.join(', ') : '');
        setPriority(initialData.priority || 'High');
        setProgress(initialData.progress || 0);
    };

    useEffect(() => {
        setTitle(initialData.name || '');
        setDescription(initialData.description || '');
        setDueDate(initialData.due_date || new Date().toISOString().split('T')[0]);
        setTags(initialData.tags ? initialData.tags.map(tag => tag.name).join(', ') : '');
        setPriority(initialData.priority || 'High');
        setProgress(initialData.progress || 0);
    }, [initialData]);

    return (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <br />
            <label>
              Description:
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </label>
            <br />
            <label>
              Priority:
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITY_CHOICES.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Due Date:
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </label>
            <br />
            <label>
              Tags (comma-separated):
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
            </label>
            <br />
            <label>
              Progress (%):
              <input type="number" value={progress} onChange={(e) => setProgress(e.target.value)} />
            </label>
            <br />
            <button type="reset" onClick={handleReset}>Reset</button>
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    }

export default TaskForm;