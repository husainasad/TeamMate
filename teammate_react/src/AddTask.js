import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [tags, setTags] = useState('');
    const [priority, setPriority] = useState('High');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const priorityOptions = ['High', 'Medium', 'Low'];

    useEffect(() => {
      const currentDate = new Date().toISOString().split('T')[0];
      setDueDate(currentDate);
    }, [])

    const handleTaskFormSubmit = async (event) => {
        event.preventDefault();
        
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post('http://localhost:8000/tasks/add/', {
            title: title,
            description: description,
            priority: priority,
            due_date: dueDate,
            tags: tags.split(',').map(tag => tag.trim()),
            progress: parseFloat(progress),
          }, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
    
          if (response.status === 201) {
            setTitle('');
            setDescription('');
            setPriority('High');
            setDueDate('');
            setTags('');
            setProgress(0);
            setError('');
            navigate('/dashboard');
          }
        } catch (error) {
          setError('Error adding task');
          console.log(error)
        }
    };

    return (
        <div>
            <h3>Let's add a new task</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleTaskFormSubmit}>
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
            <button onClick={() => navigate('/dashboard')}>Go Back</button>
        </div>
    );
};

export default AddTask;