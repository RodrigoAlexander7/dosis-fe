import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { AppColors, getRoleColor } from '@/utils/styles/colors';

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

   // getRoleColor now imported from colors.ts

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
                  <MaterialIcons name="person" size={40} color={AppColors.text.white} />
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
               <MaterialIcons name="warning" size={20} color={AppColors.warning} />
               <Text style={styles.warningText}>
                  Tu rol aún no ha sido asignado. Contacta con un administrador.
               </Text>
            </View>
         )}

         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color={AppColors.error} />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: AppColors.background.primary,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 16,
      elevation: 2,
      shadowColor: AppColors.shadow,
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
      backgroundColor: AppColors.primary,
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
      color: AppColors.text.primary,
   },
   userEmail: {
      fontSize: 14,
      color: AppColors.text.secondary,
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
      color: AppColors.text.white,
   },
   warningContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: AppColors.background.warning,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
   },
   warningText: {
      flex: 1,
      marginLeft: 8,
      fontSize: 12,
      color: AppColors.warning,
   },
   logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: AppColors.error,
   },
   logoutText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '600',
      color: AppColors.error,
   },
});
