import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from './services/authService';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
            type="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password: </label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <div>
        <p>Already a member?</p>
        <p><a href='/'>Log in here</a></p>
      </div>
    </div>
  );
}

export default Signup;