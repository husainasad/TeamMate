import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async(event) => {
    event.preventDefault();
    setError('');

    try{
        const response = await axios.post('http://localhost:8000/login/', {
            username,
            password,
        });

        if(response.status === 200){
            localStorage.setItem('token', response.data.token);
            setError('');
            navigate('/dashboard');
        }
    } catch(error){
        if (error.response && error.response.status === 400) {
            setError('Invalid username or password');
        }else {
            setError('An error occurred. Please try again later.');
        }
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Not a member?</p>
        <p><a href='/signup'>Sign up here</a></p>
      </div>
    </div>
  );
}

export default Login;