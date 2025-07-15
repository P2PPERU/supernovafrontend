import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar cookies
});

// Request interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    // Intentar obtener el token de múltiples fuentes
    let token = null;
    
    // Primero intentar desde el store de zustand (si está disponible)
    if (typeof window !== 'undefined') {
      // Intentar localStorage
      token = localStorage.getItem('token');
      
      // Si no está en localStorage, intentar cookies
      if (!token) {
        token = Cookies.get('token');
      }
      
      // Debug
      console.log('🔑 Token found:', token ? 'Yes' : 'No');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Sending request with auth to:', config.url);
    } else {
      console.log('📤 Sending request WITHOUT auth to:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para manejar errores y refresh token
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.log('❌ Response error:', error.config?.url, error.response?.status);

    // Si es 401 y no es una petición de refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;
      
      try {
        // Obtener refresh token
        const refreshToken = localStorage.getItem('refreshToken') || Cookies.get('refreshToken');
        
        console.log('🔄 Attempting token refresh...');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Hacer petición de refresh
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { token, refreshToken: newRefreshToken } = response.data;
        
        console.log('✅ Token refreshed successfully');
        
        // Guardar nuevos tokens
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('refreshToken', newRefreshToken, { expires: 30 });
        
        // Actualizar el header de la petición original
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Reintentar la petición original
        return api(originalRequest);
      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError);
        
        // Limpiar todo
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        
        // Solo redirigir si no estamos ya en login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);