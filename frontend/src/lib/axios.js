// axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:5000/api/v1' 
    : '/api/v1',
  withCredentials: true,
});

// Flag to prevent infinite loops
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait and retry
        return new Promise(resolve => {
          const retry = () => {
            originalRequest._retry = true;
            resolve(axiosInstance(originalRequest));
          };
          setTimeout(retry, 100);
        });
      }
      
      isRefreshing = true;
      originalRequest._retry = true;
      
      try {
        // Attempt token refresh
        await axiosInstance.post('/auth/refresh-token');
        isRefreshing = false;
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        // Handle refresh failure
        isRefreshing = false;
        
        if (refreshError.response?.data?.message === "Refresh token was reused") {
          // Token reuse detected - force logout
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;