import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const signup = (data) => axios.post(`${API_URL}/signup/`, data);
export const login = (data) => axios.post(`${API_URL}/login/`, data);
export const logout = (token) => axios.post(`${API_URL}/logout/`, null, {
    headers: { Authorization: `Token ${token}` },
  });
  