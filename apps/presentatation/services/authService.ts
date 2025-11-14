import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { useAuthStore, User } from '@/stores/authStore';
import apiClient from './apiClient';

// Configuración
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

// Permite que el navegador se cierre automáticamente después de la autenticación
WebBrowser.maybeCompleteAuthSession();

export interface AuthResponse {
   accessToken: string;
   user: User;
}

/**
 * Servicio de autenticación
 */
export const authService = {
   /**
    * Iniciar sesión con Google OAuth
    * Abre el navegador para autenticación
    */
   loginWithGoogle: async (): Promise<void> => {
      try {
         const redirectUri = makeRedirectUri({
            scheme: process.env.EXPO_PUBLIC_APP_SCHEME || 'ironsuplementcalculator',
            path: 'auth/callback',
         });

         console.log('Redirect URI:', redirectUri);
         console.log('Opening Google OAuth...');

         // Abrir navegador para OAuth
         const result = await WebBrowser.openAuthSessionAsync(
            `${API_URL}/auth/google`,
            redirectUri
         );

         console.log('Auth result:', result);

         if (result.type === 'success' && result.url) {
            // Extraer token y usuario de la URL
            const url = new URL(result.url);
            const token = url.searchParams.get('token');
            const userJson = url.searchParams.get('user');

            if (token && userJson) {
               const user: User = JSON.parse(decodeURIComponent(userJson));

               // Guardar en el store
               const { setAuth } = useAuthStore.getState();
               await setAuth(user, token);

               console.log('Login exitoso:', user);
            } else {
               throw new Error('No se recibió token o datos de usuario');
            }
         } else if (result.type === 'cancel') {
            console.log('Usuario canceló el login');
         }
      } catch (error) {
         console.error('Error en login con Google:', error);
         throw error;
      }
   },

   /**
    * Cerrar sesión
    */
   logout: async (): Promise<void> => {
      const { clearAuth } = useAuthStore.getState();
      await clearAuth();
      console.log('Sesión cerrada');
   },

   /**
    * Obtener perfil del usuario actual
    */
   getCurrentUser: async (): Promise<User> => {
      try {
         const response = await apiClient.get<User>('/users/me');
         return response.data;
      } catch (error) {
         console.error('Error obteniendo perfil:', error);
         throw error;
      }
   },

   /**
    * Verificar si el token es válido
    */
   verifyToken: async (): Promise<boolean> => {
      try {
         await apiClient.get('/users/me');
         return true;
      } catch (error) {
         return false;
      }
   },
};
