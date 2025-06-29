import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../store/store';
import { loadUserStart, loadUserSuccess, loadUserFailure, logout } from '../store/slices/authSlice';
import http from '../utils/api';
import { IUser } from '../types/user';

/**
 * Hook to handle authentication state and user data
 * @param options Configuration options
 * @returns Authentication state and helper functions
 */
export const useAuth = (options: {
  requireAuth?: boolean;
  redirectTo?: string;
  adminOnly?: boolean;
} = {}) => {
  const { requireAuth = false, redirectTo = '/login', adminOnly = false } = options;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isAuthenticated, isLoading, token } = useSelector((state: RootState) => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    token: state.auth.token,
  }));

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Load user data on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token && !isAuthenticated && !isLoading) {
        try {
          dispatch(loadUserStart());
          const userData = await http.get<IUser>('/auth/me');
          dispatch(loadUserSuccess(userData));
          
          // Redirect if admin access is required but user is not admin
          if (adminOnly && userData.role !== 'admin') {
            navigate('/unauthorized');
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          dispatch(loadUserFailure(error instanceof Error ? error.message : 'Failed to load user'));
          // Don't redirect if we're already on the login page
          if (location.pathname !== '/login') {
            navigate(redirectTo, { state: { from: location } });
          }
        }
      } else if (requireAuth && !isAuthenticated && !isLoading && !token) {
        // Redirect to login if authentication is required but user is not authenticated
        navigate(redirectTo, { state: { from: location } });
      } else if (isAuthenticated && adminOnly && !isAdmin) {
        // Redirect if admin access is required but user is not admin
        navigate('/unauthorized');
      }
    };

    loadUser();
  }, [dispatch, isAuthenticated, isLoading, token, requireAuth, adminOnly, navigate, redirectTo, location, isAdmin]);

  // Login function
  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await http.post<{ user: IUser; token: string }>('/auth/login', {
        email,
        password,
        rememberMe,
      });
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Register function
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await http.post<{ user: IUser; token: string }>('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await http.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  // Check if user has required permissions
  const hasPermission = (requiredPermissions: string[] = []) => {
    if (!user || !user.role) return false;
    if (isAdmin) return true; // Admin has all permissions
    
    // In a real app, you would check the user's permissions against the required ones
    // This is a simplified version
    return true;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    register,
    logout: handleLogout,
    hasPermission,
  };
};

// Hook to check if the current route requires authentication
export const useRequireAuth = (redirectTo = '/login') => {
  const { isAuthenticated, isLoading } = useAuth({ requireAuth: true, redirectTo });
  return { isAuthenticated, isLoading };
};

// Hook to check if the current route requires admin access
export const useRequireAdmin = (redirectTo = '/unauthorized') => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth({ 
    requireAuth: true, 
    adminOnly: true, 
    redirectTo 
  });
  
  return { isAuthenticated, isAdmin, isLoading };
};
