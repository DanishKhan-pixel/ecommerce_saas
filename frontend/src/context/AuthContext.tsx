import React, { useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService, cartService } from '@/services/api';
import { AuthContext, User } from './AuthContextInstance';


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await authService.me();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded = jwtDecode<{ exp: number }>(token);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('access_token');
            setUser(null);
          } else {
            await fetchUser();
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('access_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for custom logout event emitted from interceptor (e.g. refresh failed)
    const handleLogoutEvent = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const { access, refresh, user: userData } = response.data;
    
    if (access) {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(userData);
      
      // Merge guest cart if a session exists
      const sessionId = localStorage.getItem('session_id');
      if (sessionId) {
        try {
          await cartService.mergeCart(sessionId);
          // Optional: localStorage.removeItem('session_id');
        } catch (err) {
          console.error('Failed to merge cart during login:', err);
        }
      }
    }
  };

  const register = async (data: Record<string, unknown>) => {
    const response = await authService.register(data);
    const { access, refresh, user: userData } = response.data;

    if (access) {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(userData);

      // Merge guest cart if a session exists
      const sessionId = localStorage.getItem('session_id');
      if (sessionId) {
        try {
          await cartService.mergeCart(sessionId);
        } catch (err) {
          console.error('Failed to merge cart during registration:', err);
        }
      }
    }
  };

  const logout = () => {
    // In our backend, logout isn't explicitly defined as an endpoint, but we can clear tokens here.
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
