import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Obtener la URL de la API desde las variables de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
   baseURL: API_URL,
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json',
   },
});

// Interceptor de request para agregar token
apiClient.interceptors.request.use(
   (config) => {
      const token = useAuthStore.getState().token;

      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Interceptor de response para manejar errores
apiClient.interceptors.response.use(
   (response) => response,
   async (error: AxiosError) => {
      if (error.response?.status === 401) {
         // Token inválido o expirado
         const { clearAuth } = useAuthStore.getState();
         await clearAuth();

         // Podrías navegar a login aquí si tienes acceso al router
         console.log('Token expirado, usuario deslogueado');
      }

      return Promise.reject(error);
   }
);

export default apiClient;
