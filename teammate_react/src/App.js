import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './SignUp';
import Dashboard from './Dashboard';
import AddTask from './AddTask';
import TaskDetails from './TaskDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/addTask" element={<AddTask />}/>
        <Route path="/taskDetails/:id" element={<TaskDetails />}/>
      </Routes>
    </Router>
  );
}

export default App;