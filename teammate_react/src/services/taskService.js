import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getTasks = (token, status) => axios.get(`${API_URL}/tasks/`, {
  headers: { Authorization: `Token ${token}` },
  params: { status },
});

export const getTaskDetails = (token, id) => axios.get(`${API_URL}/tasks/${id}/`, {
  headers: { Authorization: `Token ${token}` },
});

export const addTask = (token, taskData) => axios.post(`${API_URL}/tasks/add/`, taskData, {
  headers: { Authorization: `Token ${token}` },
});

export const deleteTask = (token, id) => axios.delete(`${API_URL}/tasks/${id}/delete/`, {
  headers: { Authorization: `Token ${token}` },
});

export const updateTask = (token, id, taskData) => axios.put(`${API_URL}/tasks/${id}/update`, taskData, {
  headers: { Authorization: `Token ${token}` },
});