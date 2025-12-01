import React, { useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   TouchableOpacity,
   Alert,
   ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Picker, Colors, Switch } from 'react-native-ui-lib';
import { adminApi } from '@/services/api/admin.api';
import { AdminUser } from '@/services/types/admin.types';
import { useAuthStore, canManageUsers } from '@/stores/authStore';
import { getErrorMessage } from '@/utils/errorHandler';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useRouter } from 'expo-router';
import { AppColors, getRoleColor } from '@/utils/styles/colors';

dayjs.locale('es');

const ROLE_OPTIONS = [
   { label: 'Doctor', value: 'DOCTOR' },
   { label: 'Enfermera', value: 'NURSE' },
   { label: 'Paciente', value: 'PATIENT' },
];

const ROLE_LABELS: Record<string, string> = {
   DOCTOR: 'Doctor',
   NURSE: 'Enfermera',
   PATIENT: 'Paciente',
   ADMIN: 'Administrador',
};

export default function AdminPanelScreen() {
   const { user } = useAuthStore();
   const queryClient = useQueryClient();
   const router = useRouter();

   // Check permissions
   if (!canManageUsers(user)) {
      return (
         <View style={styles.centered}>
            <Ionicons name="lock-closed" size={64} color={AppColors.disabled} />
            <Text style={styles.errorText}>No tienes permisos para acceder a esta sección</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
               <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
         </View>
      );
   }

   const { data: users, isLoading, refetch } = useQuery({
      queryKey: ['admin-users'],
      queryFn: () => adminApi.getAllUsers(),
   });

   const updateRoleMutation = useMutation({
      mutationFn: ({ userId, role }: { userId: string; role: 'DOCTOR' | 'NURSE' | 'PATIENT' }) =>
         adminApi.updateRole(userId, { role }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['admin-users'] });
         Alert.alert('Éxito', 'Rol actualizado correctamente');
      },
      onError: (error: any) => {
         Alert.alert('Error', getErrorMessage(error, 'Error al actualizar rol'));
      },
   });

   const updateStatusMutation = useMutation({
      mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
         adminApi.updateStatus(userId, { isActive }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['admin-users'] });
         Alert.alert('Éxito', 'Estado actualizado correctamente');
      },
      onError: (error: any) => {
         Alert.alert('Error', getErrorMessage(error, 'Error al actualizar estado'));
      },
   });

   const handleRoleChange = (userId: string, currentRole: string, newRole: any) => {
      if (newRole === currentRole || newRole === 'ADMIN') return;

      Alert.alert(
         'Confirmar cambio de rol',
         `¿Está seguro que desea cambiar el rol de este usuario?`,
         [
            { text: 'Cancelar', style: 'cancel' },
            {
               text: 'Confirmar',
               onPress: () => updateRoleMutation.mutate({ userId, role: newRole }),
            },
         ]
      );
   };

   const handleStatusChange = (userId: string, currentStatus: boolean) => {
      const action = currentStatus ? 'desactivar' : 'activar';
      Alert.alert(
         `Confirmar ${action}`,
         `¿Está seguro que desea ${action} este usuario?`,
         [
            { text: 'Cancelar', style: 'cancel' },
            {
               text: 'Confirmar',
               onPress: () => updateStatusMutation.mutate({ userId, isActive: !currentStatus }),
            },
         ]
      );
   };

   const renderUserCard = ({ item }: { item: AdminUser }) => {
      const isCurrentUser = item.id === user?.id;
      const canModify = !isCurrentUser && item.role !== 'ADMIN';

      return (
         <View style={styles.userCard}>
            <View style={styles.userHeader}>
               <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                     <Text style={styles.userName}>{item.name}</Text>
                     {item.role === 'ADMIN' && (
                        <View style={styles.adminBadge}>
                           <Ionicons name="shield-checkmark" size={16} color={AppColors.warning} />
                           <Text style={styles.adminBadgeText}>Admin</Text>
                        </View>
                     )}
                  </View>
                  <Text style={styles.userEmail}>{item.email}</Text>
                  <Text style={styles.userDate}>
                     Registro: {dayjs(item.createdAt).format('DD/MM/YYYY')}
                  </Text>
               </View>
               <View style={[styles.statusBadge, !item.isActive && styles.inactiveBadge]}>
                  <Text style={styles.statusText}>
                     {item.isActive ? 'Activo' : 'Inactivo'}
                  </Text>
               </View>
            </View>

            {canModify && (
               <View style={styles.controls}>
                  <View style={styles.controlGroup}>
                     <Text style={styles.controlLabel}>Rol:</Text>
                     <Picker
                        value={item.role}
                        items={ROLE_OPTIONS}
                        onChange={(value) => handleRoleChange(item.id, item.role, value)}
                        style={styles.rolePicker}
                        placeholder="Seleccionar rol"
                        mode="SINGLE"
                        disabled={updateRoleMutation.isPending}
                     />
                  </View>

                  <View style={styles.controlGroup}>
                     <Text style={styles.controlLabel}>Estado:</Text>
                     <Switch
                        value={item.isActive}
                        onValueChange={() => handleStatusChange(item.id, item.isActive)}
                        disabled={updateStatusMutation.isPending}
                        onColor={Colors.primary}
                     />
                  </View>
               </View>
            )}

            {isCurrentUser && (
               <View style={styles.currentUserInfo}>
                  <Ionicons name="information-circle" size={16} color={AppColors.primary} />
                  <Text style={styles.currentUserText}>Este es tu usuario actual</Text>
               </View>
            )}

            {item.accounts && item.accounts.length > 0 && (
               <View style={styles.providersInfo}>
                  <Text style={styles.providersLabel}>Proveedor de autenticación:</Text>
                  {item.accounts.map((account, index) => (
                     <View key={index} style={styles.providerBadge}>
                        <Ionicons
                           name={account.provider === 'google' ? 'logo-google' : 'person'}
                           size={14}
                           color={AppColors.text.secondary}
                        />
                        <Text style={styles.providerText}>{account.provider}</Text>
                     </View>
                  ))}
               </View>
            )}
         </View>
      );
   };

   if (isLoading) {
      return (
         <View style={styles.centered}>
            <ActivityIndicator size="large" color={AppColors.primary} />
            <Text style={styles.loadingText}>Cargando usuarios...</Text>
         </View>
      );
   }

   const stats = users ? {
      total: users.length,
      doctors: users.filter(u => u.role === 'DOCTOR').length,
      nurses: users.filter(u => u.role === 'NURSE').length,
      patients: users.filter(u => u.role === 'PATIENT').length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
   } : null;

   return (
      <View style={styles.container}>
         {/* Stats Header */}
         {stats && (
            <View style={styles.statsContainer}>
               <Text style={styles.statsTitle}>Resumen del Sistema</Text>
               <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                     <Text style={styles.statValue}>{stats.total}</Text>
                     <Text style={styles.statLabel}>Total Usuarios</Text>
                  </View>
                  <View style={styles.statCard}>
                     <Text style={styles.statValue}>{stats.doctors}</Text>
                     <Text style={styles.statLabel}>Doctores</Text>
                  </View>
                  <View style={styles.statCard}>
                     <Text style={styles.statValue}>{stats.nurses}</Text>
                     <Text style={styles.statLabel}>Enfermeras</Text>
                  </View>
                  <View style={styles.statCard}>
                     <Text style={styles.statValue}>{stats.active}</Text>
                     <Text style={styles.statLabel}>Activos</Text>
                  </View>
               </View>
            </View>
         )}

         <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Gestión de Usuarios</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.refreshButton}>
               <Ionicons name="refresh" size={20} color={AppColors.primary} />
            </TouchableOpacity>
         </View>

         <FlatList
            data={users}
            renderItem={renderUserCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
               <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={64} color={AppColors.disabled} />
                  <Text style={styles.emptyText}>No hay usuarios registrados</Text>
               </View>
            }
         />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: AppColors.background.secondary,
   },
   centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
   },
   errorText: {
      fontSize: 16,
      color: AppColors.text.secondary,
      marginTop: 16,
      textAlign: 'center',
   },
   backButton: {
      marginTop: 24,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: AppColors.primary,
      borderRadius: 8,
   },
   backButtonText: {
      color: AppColors.text.white,
      fontSize: 16,
      fontWeight: '600',
   },
   loadingText: {
      marginTop: 16,
      fontSize: 14,
      color: AppColors.text.secondary,
   },
   statsContainer: {
      backgroundColor: AppColors.background.primary,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: AppColors.border.medium,
   },
   statsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: AppColors.text.primary,
      marginBottom: 12,
   },
   statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
   },
   statCard: {
      flex: 1,
      minWidth: '22%',
      backgroundColor: AppColors.background.secondary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
   },
   statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: AppColors.primary,
   },
   statLabel: {
      fontSize: 12,
      color: AppColors.text.secondary,
      marginTop: 4,
   },
   listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: AppColors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: AppColors.border.medium,
   },
   listTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: AppColors.text.primary,
   },
   refreshButton: {
      padding: 8,
   },
   listContent: {
      padding: 16,
   },
   userCard: {
      backgroundColor: AppColors.background.primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: AppColors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   userHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
   },
   userInfo: {
      flex: 1,
   },
   nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
   },
   userName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: AppColors.text.primary,
   },
   adminBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: AppColors.background.warning,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
   },
   adminBadgeText: {
      fontSize: 12,
      color: AppColors.warning,
      fontWeight: '600',
   },
   userEmail: {
      fontSize: 14,
      color: AppColors.text.secondary,
      marginBottom: 4,
   },
   userDate: {
      fontSize: 12,
      color: AppColors.text.tertiary,
   },
   statusBadge: {
      backgroundColor: AppColors.success,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      height: 32,
      justifyContent: 'center',
   },
   inactiveBadge: {
      backgroundColor: AppColors.error,
   },
   statusText: {
      color: AppColors.text.white,
      fontSize: 12,
      fontWeight: '600',
   },
   controls: {
      flexDirection: 'row',
      gap: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: AppColors.border.medium,
      marginTop: 12,
   },
   controlGroup: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   controlLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: AppColors.text.secondary,
   },
   rolePicker: {
      flex: 1,
   },
   currentUserInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      padding: 8,
      backgroundColor: AppColors.background.info,
      borderRadius: 6,
   },
   currentUserText: {
      fontSize: 12,
      color: AppColors.info,
   },
   providersInfo: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: AppColors.border.medium,
   },
   providersLabel: {
      fontSize: 12,
      color: AppColors.text.tertiary,
      marginBottom: 6,
   },
   providerBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
   },
   providerText: {
      fontSize: 12,
      color: AppColors.text.secondary,
      textTransform: 'capitalize',
   },
   emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 64,
   },
   emptyText: {
      fontSize: 16,
      color: AppColors.text.tertiary,
      marginTop: 16,
   },
});
