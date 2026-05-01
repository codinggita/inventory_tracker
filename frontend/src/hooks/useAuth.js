import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logout, clearError, setCredentials } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const login = (email, password) => dispatch(loginUser({ email, password }));
  const register = (userData) => dispatch(registerUser(userData));
  const signout = () => dispatch(logout());
  const resetError = () => dispatch(clearError());
  const setAuth = (user, token) => dispatch(setCredentials({ user, token }));

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout: signout,
    clearError: resetError,
    setAuth,
    isAuthenticated: !!token,
  };
};
