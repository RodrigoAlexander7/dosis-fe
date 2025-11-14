import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore, isAdmin } from '@/stores/authStore';

export default function AuthCallbackScreen() {
   const { token, user } = useLocalSearchParams<{ token?: string; user?: string }>();
   const router = useRouter();
   const { setAuth } = useAuthStore();

   useEffect(() => {
      handleCallback();
   }, []);

   const handleCallback = async () => {
      try {
         if (token && user) {
            const userData = JSON.parse(decodeURIComponent(user as string));
            await setAuth(userData, token as string);

            // Navegar según rol
            if (isAdmin(userData)) {
               router.replace('/(home)/admin');
            } else {
               router.replace('/(home)');
            }
         } else {
            throw new Error('Datos de autenticación incompletos');
         }
      } catch (error) {
         console.error('Error procesando callback:', error);
         router.replace('/login');
      }
   };

   return (
      <View style={styles.container}>
         <ActivityIndicator size="large" color="#2196F3" />
         <Text style={styles.text}>Completando autenticación...</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
   },
   text: {
      marginTop: 16,
      fontSize: 16,
      color: '#666',
   },
});
