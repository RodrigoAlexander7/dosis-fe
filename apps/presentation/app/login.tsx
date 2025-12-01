import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { authService } from '@/services/authService';
import { useRouter } from 'expo-router';
import { AppColors } from '@/utils/styles/colors';

export default function LoginScreen() {
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const handleGoogleLogin = async () => {
      try {
         setIsLoading(true);
         await authService.loginWithGoogle();

         // Si el login fue exitoso, navegar al home
         router.replace('/(home)');
      } catch (error: any) {
         console.error('Error en login:', error);
         Alert.alert(
            'Error de autenticación',
            error?.message || 'No se pudo iniciar sesión con Google. Intenta nuevamente.',
            [{ text: 'OK' }]
         );
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>
            {/* Logo o título */}
            <View style={styles.header}>
               <MaterialIcons name="local-hospital" size={80} color={AppColors.primary} />
               <Text style={styles.title}>H-Calculator</Text>
               <Text style={styles.subtitle}>Calculadora de Hemoglobina</Text>
            </View>

            {/* Información */}
            <View style={styles.infoContainer}>
               <Text style={styles.infoText}>
                  Inicia sesión para acceder al sistema de registro de pacientes y cálculo de dosis de suplementación.
               </Text>
            </View>

            {/* Botón de login */}
            <View style={styles.buttonContainer}>
               <TouchableOpacity
                  style={[styles.googleButton, isLoading && styles.buttonDisabled]}
                  onPress={handleGoogleLogin}
                  disabled={isLoading}
               >
                  {isLoading ? (
                     <ActivityIndicator color={AppColors.text.white} />
                  ) : (
                     <>
                        <MaterialIcons name="login" size={24} color={AppColors.text.white} />
                        <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
                     </>
                  )}
               </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
               <Text style={styles.footerText}>
                  Solo personal médico autorizado
               </Text>
               <Text style={styles.footerTextSmall}>
                  Tu rol será asignado por un administrador
               </Text>
            </View>
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: AppColors.background.primary,
   },
   content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
   },
   header: {
      alignItems: 'center',
      marginBottom: 40,
   },
   title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: AppColors.primary,
      marginTop: 16,
   },
   subtitle: {
      fontSize: 16,
      color: AppColors.text.secondary,
      marginTop: 8,
   },
   infoContainer: {
      backgroundColor: AppColors.background.info,
      padding: 20,
      borderRadius: 12,
      marginBottom: 40,
   },
   infoText: {
      fontSize: 14,
      color: AppColors.info,
      textAlign: 'center',
      lineHeight: 20,
   },
   buttonContainer: {
      width: '100%',
      marginBottom: 24,
   },
   googleButton: {
      backgroundColor: AppColors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      gap: 12,
      elevation: 2,
      shadowColor: AppColors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
   },
   buttonDisabled: {
      opacity: 0.6,
   },
   buttonText: {
      color: AppColors.text.white,
      fontSize: 16,
      fontWeight: '600',
   },
   footer: {
      alignItems: 'center',
   },
   footerText: {
      fontSize: 14,
      color: AppColors.text.secondary,
      marginBottom: 4,
   },
   footerTextSmall: {
      fontSize: 12,
      color: AppColors.text.tertiary,
   },
});
