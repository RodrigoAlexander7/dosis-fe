import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

export default function UserProfile() {
   const { user, clearAuth } = useAuthStore();
   const router = useRouter();

   const handleLogout = () => {
      Alert.alert(
         'Cerrar sesión',
         '¿Estás seguro que deseas cerrar sesión?',
         [
            { text: 'Cancelar', style: 'cancel' },
            {
               text: 'Cerrar sesión',
               style: 'destructive',
               onPress: async () => {
                  await authService.logout();
                  router.replace('/login');
               },
            },
         ]
      );
   };

   if (!user) return null;

   const getRoleLabel = (role: string | null) => {
      if (!role) return 'Sin rol asignado';
      return role === 'DOCTOR' ? 'Médico' : 'Enfermera';
   };

   const getRoleColor = (role: string | null) => {
      if (!role) return '#9E9E9E';
      return role === 'DOCTOR' ? '#2196F3' : '#4CAF50';
   };

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            {user.image ? (
               <Image
                  source={{ uri: user.image }}
                  style={styles.avatar}
                  contentFit="cover"
               />
            ) : (
               <View style={styles.avatarPlaceholder}>
                  <MaterialIcons name="person" size={40} color="#fff" />
               </View>
            )}

            <View style={styles.userInfo}>
               <Text style={styles.userName}>{user.name}</Text>
               <Text style={styles.userEmail}>{user.email}</Text>
               <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                  <Text style={styles.roleText}>{getRoleLabel(user.role)}</Text>
               </View>
            </View>
         </View>

         {!user.role && (
            <View style={styles.warningContainer}>
               <MaterialIcons name="warning" size={20} color="#FF9800" />
               <Text style={styles.warningText}>
                  Tu rol aún no ha sido asignado. Contacta con un administrador.
               </Text>
            </View>
         )}

         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#f44336" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
   },
   avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
   },
   avatarPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#2196F3',
      justifyContent: 'center',
      alignItems: 'center',
   },
   userInfo: {
      marginLeft: 16,
      flex: 1,
   },
   userName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
   },
   userEmail: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
   },
   roleBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 8,
   },
   roleText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#fff',
   },
   warningContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF3E0',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
   },
   warningText: {
      flex: 1,
      marginLeft: 8,
      fontSize: 12,
      color: '#E65100',
   },
   logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#f44336',
   },
   logoutText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '600',
      color: '#f44336',
   },
});
