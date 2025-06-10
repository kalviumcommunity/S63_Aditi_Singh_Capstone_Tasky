// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://s63-aditi-singh-capstone-tasky-1.onrender.com',
  withCredentials: true,
});

export default api;
