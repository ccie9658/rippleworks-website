import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, tokenUtils } from '../utils/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      if (tokenUtils.isAuthenticated()) {
        // Get user profile from API
        const response = await authApi.getProfile();
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        // No valid token
        setUser(null);
        setIsAuthenticated(false);
        tokenUtils.removeToken();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      tokenUtils.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      
      // Store token
      tokenUtils.setToken(response.data.token);
      
      // Set user data
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      
      // Store token
      tokenUtils.setToken(response.data.token);
      
      // Set user data
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      tokenUtils.removeToken();
    }
  };

  const hasRole = (roleName) => {
    if (!user || !user.userRoles) return false;
    return user.userRoles.some(userRole => userRole.role.name === roleName);
  };

  const isAdmin = () => {
    return hasRole('ADMIN') || hasRole('admin');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};