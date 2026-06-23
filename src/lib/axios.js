import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';
const ACCESS_TOKEN_KEY = 'admin_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';
let refreshPromise = null;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

function clearStoredAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function redirectToLogin() {
  clearStoredAuth();
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

function isLoginRequest(config) {
  return config?.url?.includes('/admin/auth/login');
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return Promise.reject(new Error('Missing refresh token'));

    refreshPromise = axios
      .post(`${API_URL}/admin/auth/refresh-token`, { refreshToken })
      .then(({ data }) => {
        const { accessToken, refreshToken: newRefreshToken } = data.data;
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isLoginRequest(originalRequest)
    ) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
