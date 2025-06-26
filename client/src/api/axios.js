import axios from 'axios';
import store from '../utils/store';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

API.interceptors.request.use((req) => {
  const token = store.getState().user.currentUser?.token;
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  if (!(req.data instanceof FormData)) {
    req.headers['Content-Type'] = 'application/json';
  }
  return req;
});

export default API;
