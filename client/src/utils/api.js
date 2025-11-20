import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

/**
 * Auth API functions
 */
export const registerUser = async (username, email, password) => {
  return await api.post('/auth/register', { username, email, password });
};

export const loginUser = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

export const getProfile = async () => {
  return await api.get('/auth/profile');
};

/**
 * Posts API functions
 */
export const fetchPosts = async (page = 1, limit = 10, category = null) => {
  const params = { page, limit };
  if (category) params.category = category;
  return await api.get('/posts', { params });
};

export const fetchPostById = async (id) => {
  return await api.get(`/posts/${id}`);
};

export const createPost = async (title, content, category = null) => {
  return await api.post('/posts', { title, content, category });
};

export const updatePost = async (id, updates) => {
  return await api.put(`/posts/${id}`, updates);
};

export const deletePost = async (id) => {
  return await api.delete(`/posts/${id}`);
};

