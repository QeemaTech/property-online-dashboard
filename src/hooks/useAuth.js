import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api/auth';

const AuthContext = createContext(null);
const ACCESS_TOKEN_KEY = 'admin_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';

function clearStoredAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)));

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      getProfile()
        .then((res) => setAdmin(res.data.data))
        .catch((err) => {
          if (err.response?.status === 401) {
            clearStoredAuth();
          }
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const loginSuccess = (tokens, adminData) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    setAdmin(adminData);
  };

  const logoutAction = () => {
    clearStoredAuth();
    setAdmin(null);
  };

  const updateAdmin = (adminData) => {
    setAdmin(adminData);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { admin, loading, loginSuccess, logoutAction, updateAdmin } },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
