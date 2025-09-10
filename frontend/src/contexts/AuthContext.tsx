import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { User } from '@/types/schemas';
import { AxiosError } from 'axios';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify token with backend and get user profile
          const response = await authApi.getProfile();
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login({ email, password });
      
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      
      // Fetch user profile after login
      const profileResponse = await authApi.getProfile();
      setUser(profileResponse.data.user);
      
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as { message: string })?.message || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.signup(userData);
      
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      
      // Fetch user profile after signup
      const profileResponse = await authApi.getProfile();
      setUser(profileResponse.data.user);
      
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as { message: string })?.message || 'Signup failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authApi.logout().finally(() => {
      localStorage.removeItem('authToken');
      setUser(null);
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
