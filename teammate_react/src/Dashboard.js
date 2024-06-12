import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const response = await axios.get('http://localhost:8000/dashboard/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          if (response.status === 200) {
            setUsername(response.data.username);
            setError('');
          }
        } else {
          setError('No token found');
        }
      } catch (error) {
        setError('Error fetching User data');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome {username}!</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Dashboard;