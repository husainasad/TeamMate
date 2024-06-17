import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './services/authService';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const navigate = useNavigate();

  const handleToggle = () => {
    if (type==='password'){
       setIcon(eye);
       setType('text')
    } else {
       setIcon(eyeOff)
       setType('password')
    }
 }

  const handleLogin = async(event) => {
    event.preventDefault();
    setError('');

    try{
        const response = await login({
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
            type={type}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={handleToggle}>
            <Icon icon={icon} size={25}/>
          </span>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Not a member?</p>
        <button onClick={() => navigate('/signup')}>Sign up here</button>
      </div>
    </div>
  );
}

export default Login;