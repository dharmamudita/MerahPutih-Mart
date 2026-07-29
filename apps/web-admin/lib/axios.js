import axios from 'axios';

// Konfigurasi instance axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Coba ambil token dari localStorage jika ada (untuk nanti)
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('token');
      // DEV MOCK: Auto inject token jika kosong
      if (!token && process.env.NODE_ENV === 'development') {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtczMzbmlvdzAwMDF0azZncDFyaWUyYmciLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJrb3BkZXNJZCI6ImNtczMzbmlvNzAwMDB0azZnM2h0OW5mZHAiLCJpYXQiOjE3ODUzMzQ3ODMsImV4cCI6MTc4NzkyNjc4M30.Q2sL5-ShH0R3uQzvrQ99zCNGUm8bFzE4WUUo85UiACQ';
        localStorage.setItem('token', token);
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error global (misal session expired, dsb)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Redirect ke login jika unauthorized
      }
    }
    return Promise.reject(error);
  }
);

export default api;
