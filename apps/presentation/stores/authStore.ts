import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

// Tipos
export interface User {
   id: string;
   email: string;
   name: string;
   role: 'DOCTOR' | 'NURSE' | 'ADMIN' | 'PATIENT' | null;
   image: string | null;
   isActive?: boolean;
}

// Helper functions para permisos
export const isDoctor = (user: User | null): boolean => user?.role === 'DOCTOR';
export const isNurse = (user: User | null): boolean => user?.role === 'NURSE';
export const isAdmin = (user: User | null): boolean => user?.role === 'ADMIN';
export const isMedicalStaff = (user: User | null): boolean =>
   user?.role === 'DOCTOR' || user?.role === 'NURSE';
export const canCreatePatient = (user: User | null): boolean => user?.role === 'DOCTOR';
export const canCreateVisit = (user: User | null): boolean =>
   user?.role === 'DOCTOR' || user?.role === 'NURSE';
export const canDeleteRecords = (user: User | null): boolean => user?.role === 'DOCTOR';
export const canManageUsers = (user: User | null): boolean => user?.role === 'ADMIN';
export const canAssignRoles = (user: User | null): boolean =>
   user?.role === 'ADMIN' || user?.role === 'DOCTOR';

interface AuthState {
   user: User | null;
   token: string | null;
   isLoading: boolean;
   isAuthenticated: boolean;
}

interface AuthActions {
   setAuth: (user: User, token: string) => Promise<void>;
   clearAuth: () => Promise<void>;
   updateUser: (user: Partial<User>) => void;
   initialize: () => Promise<void>;
}

// Custom storage usando SecureStore
const secureStorage = {
   getItem: async (name: string): Promise<string | null> => {
      try {
         return await SecureStore.getItemAsync(name);
      } catch (error) {
         console.error('Error reading from SecureStore:', error);
         return null;
      }
   },
   setItem: async (name: string, value: string): Promise<void> => {
      try {
         await SecureStore.setItemAsync(name, value);
      } catch (error) {
         console.error('Error writing to SecureStore:', error);
      }
   },
   removeItem: async (name: string): Promise<void> => {
      try {
         await SecureStore.deleteItemAsync(name);
      } catch (error) {
         console.error('Error removing from SecureStore:', error);
      }
   },
};

// Store de autenticación
export const useAuthStore = create<AuthState & AuthActions>()(
   persist(
      (set, get) => ({
         // Estado inicial
         user: null,
         token: null,
         isLoading: true,
         isAuthenticated: false,

         // Establecer autenticación
         setAuth: async (user: User, token: string) => {
            set({
               user,
               token,
               isAuthenticated: true,
               isLoading: false,
            });
         },

         // Limpiar autenticación
         clearAuth: async () => {
            set({
               user: null,
               token: null,
               isAuthenticated: false,
               isLoading: false,
            });
         },

         // Actualizar usuario
         updateUser: (userData: Partial<User>) => {
            const currentUser = get().user;
            if (currentUser) {
               set({
                  user: { ...currentUser, ...userData },
               });
            }
         },

         // Inicializar (cargar desde storage)
         initialize: async () => {
            set({ isLoading: false });
         },
      }),
      {
         name: 'auth-storage',
         storage: createJSONStorage(() => secureStorage),
         partialize: (state) => ({
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
         }),
      }
   )
);
