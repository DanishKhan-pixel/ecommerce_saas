import axios from 'axios';

// Get base URL from environment or use proxy default
export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token and session id to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Attach session ID for guest cart
    const sessionId = localStorage.getItem('session_id');
    if (sessionId && !token) {
      config.headers['X-Session-ID'] = sessionId;
    } else if (sessionId && token) {
      config.headers['X-Session-ID'] = sessionId; // Even if logged in, we might need it for merging
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Process responses and handle 401 automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop if refresh endpoint itself fails
    if (originalRequest.url === '/api/auth/refresh/' || originalRequest.url === '/api/auth/login/') {
      return Promise.reject(error);
    }

    // Check if error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}/api/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          
          if (access) {
            localStorage.setItem('access_token', access);
            // Also store new refresh token if backend rotates it, though simplejwt might not always return it 
            if (response.data.refresh) {
              localStorage.setItem('refresh_token', response.data.refresh);
            }
            
            // Re-attempt original request
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, log out the user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Dispatch a custom event to notify AuthContext to update state
          window.dispatchEvent(new Event('auth:logout'));
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, force logout
        localStorage.removeItem('access_token');
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(error);
  }
);
