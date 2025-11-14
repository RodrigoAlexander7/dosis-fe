import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function AuthErrorScreen() {
   const { message } = useLocalSearchParams<{ message?: string }>();
   const router = useRouter();

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>
            <MaterialIcons name="error-outline" size={80} color="#f44336" />

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
      backgroundColor: '#fff',
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
      color: '#333',
      marginTop: 24,
      marginBottom: 16,
   },
   message: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
   },
   button: {
      backgroundColor: '#2196F3',
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 8,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
});
