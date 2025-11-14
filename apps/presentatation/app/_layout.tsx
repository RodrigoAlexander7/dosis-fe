import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';
import { useAuthStore, isAdmin } from '@/stores/authStore';
import { ActivityIndicator, View } from 'react-native';
import "../utils/styles/styles";
import "../utils/styles/themes";

function useProtectedRoute() {
   const segments = useSegments();
   const router = useRouter();
   const { isAuthenticated, isLoading, initialize, user } = useAuthStore();

   useEffect(() => {
      initialize();
   }, []);

   useEffect(() => {
      if (isLoading) return;

      const inAuthGroup = segments[0] === '(home)';
      const inLoginGroup = segments[0] === 'login' || segments[0] === 'auth';

      if (!isAuthenticated && inAuthGroup) {
         // Usuario no autenticado intentando acceder a rutas protegidas
         router.replace('/login');
      } else if (isAuthenticated && inLoginGroup) {
         // Usuario autenticado en páginas de login - redirigir según rol
         if (isAdmin(user)) {
            router.replace('/(home)/admin');
         } else {
            router.replace('/(home)');
         }
      }
   }, [isAuthenticated, segments, isLoading, user]);

   return { isLoading };
}

export default function RootLayout() {
   const { isLoading } = useProtectedRoute();

   if (isLoading) {
      return (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2196F3" />
         </View>
      );
   }

   return (
      <QueryClientProvider client={queryClient}>
         <Stack screenOptions={{
            headerShown: false,
         }}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
            <Stack.Screen name="auth/error" options={{ headerShown: false }} />
            <Stack.Screen name="(home)" />
         </Stack>
      </QueryClientProvider>
   );
}