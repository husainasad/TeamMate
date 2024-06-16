import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './services/authService';
import { deleteTask, getTasks } from './services/taskService';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getTasks(token, filterStatus)

      if (response.status === 200) {
        setUsername(response.data.username);
        setTasks(response.data.tasks);
        setError('');
      }
    } catch (error) {
      setError('Error fetching user data');
    }
  };

  const handleStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleDeleteTask = async(taskId) => {
    try{
      const token = localStorage.getItem('token');
      const response = await deleteTask(token, taskId);

      if (response.status === 204) {
        setTasks(tasks.filter(task => task.id !== taskId));
        setError('');
      }

    } catch(error){
      setError('Error deleting task');
    }
  }

  const handleLogout = async(event) => {
    event.preventDefault();
    try{
        const token = localStorage.getItem('token');
        const response = await logout(token);

        if(response.status === 200){
          localStorage.removeItem('token');
            setError('');
            navigate('/');
        }
    } catch(error){
        if (error.response && error.response.status === 400) {
            setError('Invalid credentials');
        }else {
            setError('An error occurred. Please try again later.');
        }
    }
  }

  return (
    <div>
      <h1>Welcome {username}!</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogout}>Log Out</button>
      <h3>Tasks</h3>
      <form>
        <label>
          Filter by Status:
          <select value={filterStatus} onChange={handleStatusChange}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </form>
      <div>
        <table border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Progress (%)</th>
              <th>Due Date</th>
              <th>Delete Task?</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td><a href={`/taskDetails/${task.id}`}>{task.title}</a></td>
                <td>{task.priority}</td>
                <td>{task.progress}</td>
                <td>{task.due_date}</td>
                <td><button onClick={() => handleDeleteTask(task.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => navigate('/addTask')}>Add Task</button>
    </div>
  );
}

export default Dashboard;