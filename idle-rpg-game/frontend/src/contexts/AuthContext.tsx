import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '../services/api';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await apiService.getUserProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            apiService.clearAuthToken();
          }
        } catch (error) {
          console.error('Failed to get user profile:', error);
          apiService.clearAuthToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await apiService.login(data);
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        apiService.setAuthToken(token);
        setUser(userData);
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiService.register(data);
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        apiService.setAuthToken(token);
        setUser(userData);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    apiService.clearAuthToken();
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await apiService.updateUserProfile(data);
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};