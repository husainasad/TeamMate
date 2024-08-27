import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthProvider from './components/Auth/AuthContext';
import TaskList from './components/Tasks/TaskList';
import AddTask from './components/Tasks/AddTask';
import EditTask from './components/Tasks/EditTask';
import TaskDetails from './components/Tasks/TaskDetails';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><TaskList /></PrivateRoute>} />
      <Route path="/add-task" element={<PrivateRoute><AddTask /></PrivateRoute>} />
      <Route path="/tasks/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
      <Route path="/tasks/:id/edit-task" element={<PrivateRoute><EditTask /></PrivateRoute>} />
    </Routes>
  );
}

function AppContainer() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

export default AppContainer;
export { App };