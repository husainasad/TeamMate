import axios from 'axios';

// const API_URL = 'http://localhost:8000/api/';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const getToken = () => localStorage.getItem('access_token');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const authHeader = () => {
    const token = getToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

export const registerUser = (userData) => api.post('register/', userData);
export const loginUser = (userData) => api.post('token/', userData);
export const refreshToken = (token) => api.post('token/refresh/', { refresh: token });

export const getMemberTasks = () => api.get('tasks/member/', { headers: authHeader() });
export const getOwnerTasks = () => api.get('tasks/owner/', { headers: authHeader() });
export const getTaskById = (id) => api.get(`tasks/${id}/`, { headers: authHeader() });

export const addTask = (taskData) => api.post('tasks/add/', taskData, { headers: authHeader() });
export const editTask = (id, taskData) => api.put(`tasks/${id}/update/`, taskData, { headers: authHeader() });
export const deleteTask = (id) => api.delete(`tasks/${id}/delete/`, { headers: authHeader() });

export const addMember = (id, taskData) => api.post(`tasks/${id}/addMember/`, taskData, { headers: authHeader() });
export const removeMember = (id, taskData) => api.delete(`tasks/${id}/removeMember/`, { data: taskData, headers: authHeader() });