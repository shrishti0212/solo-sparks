import axios from 'axios';
import store from '../utils/store';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Add Authorization dynamically
API.interceptors.request.use((req) => {
  const state = store.getState();
  const token = state.user.currentUser?.token;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  // 🧠 Only set Content-Type if not sending FormData
  if (!(req.data instanceof FormData)) {
    req.headers['Content-Type'] = 'application/json';
  }

  return req;
});

export default API;
