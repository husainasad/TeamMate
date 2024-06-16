import React, { useState, useEffect } from 'react';

function TaskForm({ onSubmit, initialValues }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [priority, setPriority] = useState('High');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const priorityOptions = ['High', 'Medium', 'Low'];

  useEffect(() => {
    setTitle(initialValues.title || '');
    setDescription(initialValues.description || '');
    setDueDate(initialValues.due_date || new Date().toISOString().split('T')[0]);
    setTags(initialValues.tags ? initialValues.tags.map(tag => tag.name).join(', '): '');
    setPriority(initialValues.priority || 'High');
    setProgress(initialValues.progress || 0);
  }, [initialValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const taskData = {
        title,
        description,
        due_date: dueDate,
        tags: tags.split(',').map(tag => tag.trim()),
        priority,
        progress: parseFloat(progress),
      };
      await onSubmit(taskData);
    } catch (error) {
      setError('Error submitting task');
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
            {priorityOptions.map(option => (
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
        <button type="reset">Reset</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default TaskForm;