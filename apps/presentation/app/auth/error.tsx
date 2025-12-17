import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppColors } from '@/utils/styles/colors';

export default function AuthErrorScreen() {
   const { message } = useLocalSearchParams<{ message?: string }>();
   const router = useRouter();

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>
            <MaterialIcons name="error-outline" size={80} color={AppColors.error} />

            <Text style={styles.title}>Error de Autenticación</Text>

            <Text style={styles.message}>
               {message || 'Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.'}
            </Text>

            <TouchableOpacity
               style={styles.button}
               onPress={() => router.replace('/login')}
            >
               <Text style={styles.buttonText}>Volver a intentar</Text>
            </TouchableOpacity>
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
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: AppColors.text.primary,
      marginTop: 24,
      marginBottom: 16,
   },
   message: {
      fontSize: 16,
      color: AppColors.text.secondary,
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
   },
   button: {
      backgroundColor: AppColors.primary,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 8,
   },
   buttonText: {
      color: AppColors.text.white,
      fontSize: 16,
      fontWeight: '600',
   },
});
