import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskpulse_token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.getMe(token);
          if (res.success) {
            setUser(res.data);
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.login(email, password);
      if (res.success) {
        setToken(res.data.token);
        setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
        localStorage.setItem('taskpulse_token', res.data.token);
        return true;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.register(name, email, password);
      if (res.success) {
        setToken(res.data.token);
        setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
        localStorage.setItem('taskpulse_token', res.data.token);
        return true;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('taskpulse_token');
    localStorage.removeItem('taskpulse_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
