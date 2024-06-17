import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from './services/authService';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type==='password'){
       setIcon(eye);
       setType('text')
    } else {
       setIcon(eyeOff)
       setType('password')
    }
 }

  const handleSignup = async(event) => {
    event.preventDefault();
    setError('');

    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }

    try{
        const response = await signup({
            username,
            email,
            password1,
            password2
        });

        if(response.status === 201){
          localStorage.setItem('token', response.data.token);
          setError('');
          navigate('/dashboard');
        }
    } catch(error){
        if (error.response && error.response.status === 400) {
            setError('Registration failed');
        }else {
            setError('An error occurred. Please try again later.');
        }
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type={type}
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
          <span onClick={handleToggle}>
            <Icon icon={icon} size={25}/>
          </span>
        </div>
        <div>
          <label>Confirm Password: </label>
          <input
            type={type}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <div>
        <p>Already a member?</p>
        <button onClick={() => navigate('/')}>Log In here</button>
      </div>
    </div>
  );
}

export default Signup;