import axios from 'axios';
import Config from 'react-native-config';
import { useAuth } from '../AuthContext';

// Crear instancia de axios con baseURL
const apiClient = axios.create({
  baseURL: (Config.API_BASE_URL || 'http://10.0.2.2:3000') + '/dev',
  timeout: 10000,
});

// Interceptor que agrega el token a cada request
export const setupInterceptors = (getToken: () => string | null) => {
  apiClient.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default apiClient;
