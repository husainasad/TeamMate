import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthProvider from './components/Auth/AuthContext';
import Header from './components/Tasks/Header';
import TaskList from './components/Tasks/TaskList';
import AddTask from './components/Tasks/AddTask';
import EditTask from './components/Tasks/EditTask';
import TaskDetails from './components/Tasks/TaskDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<TaskList />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/tasks/:id/edit-task" element={<EditTask />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;