import React from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   ActivityIndicator,
   Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { patientsApi } from '@/services/api/patients.api';
import { VisitCard } from '@/components/VisitCard';
import { useAuthStore, canDeleteRecords, isMedicalStaff } from '@/stores/authStore';

export default function PatientDetailsScreen() {
   const { dni } = useLocalSearchParams<{ dni: string }>();
   const router = useRouter();
   const { user } = useAuthStore();
   const queryClient = useQueryClient();

   const { data: patient, isLoading } = useQuery({
      queryKey: ['patient', dni],
      queryFn: () => patientsApi.getByDni(dni!),
      enabled: !!dni,
   });

   const deleteMutation = useMutation({
      mutationFn: () => patientsApi.delete(dni!),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['patients'] });
         Alert.alert('Éxito', 'Paciente eliminado correctamente');
         router.back();
      },
      onError: (error: any) => {
         Alert.alert('Error', getErrorMessage(error, 'Error al eliminar paciente'));
      },
   });

   const handleDelete = () => {
      Alert.alert(
         'Confirmar eliminación',
         '¿Está seguro que desea eliminar este paciente? Esta acción no se puede deshacer y eliminará todas las visitas asociadas.',
         [
            { text: 'Cancelar', style: 'cancel' },
            {
               text: 'Eliminar',
               style: 'destructive',
               onPress: () => deleteMutation.mutate(),
            },
         ]
      );
   };

   const handleCreateVisit = () => {
      router.push(`/(home)/visits/create?patientDni=${dni}`);
   };

   if (isLoading) {
      return (
         <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2196F3" />
         </View>
      );
   }

   if (!patient) {
      return (
         <View style={styles.centered}>
            <Text>Paciente no encontrado</Text>
         </View>
      );
   }

   const age = dayjs().diff(dayjs(patient.birthDate), 'year');

   return (
      <ScrollView style={styles.container}>
         {/* Patient Info Card */}
         <View style={styles.infoCard}>
            <View style={styles.header}>
               <View>
                  <Text style={styles.name}>DNI: {patient.dni}</Text>
                  <Text style={styles.subtitle}>
                     {age} años • {patient.gender === 'M' ? 'Masculino' : 'Femenino'}
                  </Text>
               </View>
               <View style={[styles.statusBadge, !patient.isActive && styles.inactiveBadge]}>
                  <Text style={styles.statusText}>
                     {patient.isActive ? 'Activo' : 'Inactivo'}
                  </Text>
               </View>
            </View>

            <View style={styles.detailsGrid}>
               <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <View style={styles.detailContent}>
                     <Text style={styles.detailLabel}>Edad</Text>
                     <Text style={styles.detailValue}>{age} años</Text>
                  </View>
               </View>

               <View style={styles.detailItem}>
                  <Ionicons name="person-outline" size={20} color="#666" />
                  <View style={styles.detailContent}>
                     <Text style={styles.detailLabel}>Sexo</Text>
                     <Text style={styles.detailValue}>
                        {patient.gender === 'MALE' ? 'Masculino' : 'Femenino'}
                     </Text>
                  </View>
               </View>

               <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <View style={styles.detailContent}>
                     <Text style={styles.detailLabel}>Ubicación</Text>
                     <Text style={styles.detailValue}>
                        {patient.town?.name}, {patient.district?.name}
                     </Text>
                     <Text style={styles.detailSubvalue}>
                        {patient.province?.name}, {patient.department?.name}
                     </Text>
                     <Text style={styles.detailSubvalue}>
                        Altitud: {patient.town?.altitud} msnm
                     </Text>
                  </View>
               </View>

               <View style={styles.detailItem}>
                  <Ionicons name="medkit-outline" size={20} color="#666" />
                  <View style={styles.detailContent}>
                     <Text style={styles.detailLabel}>Visitas</Text>
                     <Text style={styles.detailValue}>
                        {patient.visits?.length || 0} {patient.visits?.length === 1 ? 'visita' : 'visitas'}
                     </Text>
                  </View>
               </View>
            </View>

            {/* Action Buttons */}
            {isMedicalStaff(user) && (
               <View style={styles.actionButtons}>
                  <TouchableOpacity
                     style={styles.primaryButton}
                     onPress={handleCreateVisit}
                  >
                     <Ionicons name="add-circle-outline" size={20} color="#fff" />
                     <Text style={styles.primaryButtonText}>Nueva Visita</Text>
                  </TouchableOpacity>

                  {canDeleteRecords(user) && (
                     <TouchableOpacity
                        style={styles.dangerButton}
                        onPress={handleDelete}
                        disabled={deleteMutation.isPending}
                     >
                        <Ionicons name="trash-outline" size={20} color="#fff" />
                        <Text style={styles.dangerButtonText}>Eliminar</Text>
                     </TouchableOpacity>
                  )}
               </View>
            )}
         </View>

         {/* Visits History */}
         <View style={styles.visitsSection}>
            <Text style={styles.sectionTitle}>Historial de Visitas</Text>
            {patient.visits && patient.visits.length > 0 ? (
               patient.visits.map((visit) => (
                  <VisitCard
                     key={visit.id}
                     visit={visit}
                     onPress={() => router.push(`/(home)/visits/${visit.id}`)}
                  />
               ))
            ) : (
               <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>No hay visitas registradas</Text>
               </View>
            )}
         </View>

         {/* Created By Info */}
         {patient.createdBy && (
            <View style={styles.footerInfo}>
               <Text style={styles.footerText}>
                  Registrado por: {patient.createdBy.name} ({patient.createdBy.role})
               </Text>
               <Text style={styles.footerText}>
                  Fecha: {dayjs(patient.createdAt).format('DD/MM/YYYY HH:mm')}
               </Text>
            </View>
         )}
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
   },
   centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   infoCard: {
      backgroundColor: '#fff',
      margin: 16,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
   },
   name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#212121',
      marginBottom: 4,
   },
   subtitle: {
      fontSize: 16,
      color: '#666',
   },
   dni: {
      fontSize: 16,
      color: '#666',
   },
   statusBadge: {
      backgroundColor: '#4CAF50',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
   },
   inactiveBadge: {
      backgroundColor: '#F44336',
   },
   statusText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
   },
   detailsGrid: {
      gap: 16,
      marginBottom: 20,
   },
   detailItem: {
      flexDirection: 'row',
      gap: 12,
   },
   detailContent: {
      flex: 1,
   },
   detailLabel: {
      fontSize: 12,
      color: '#999',
      marginBottom: 4,
   },
   detailValue: {
      fontSize: 16,
      color: '#212121',
      fontWeight: '500',
   },
   detailSubvalue: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
   },
   actionButtons: {
      flexDirection: 'row',
      gap: 12,
   },
   primaryButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2196F3',
      paddingVertical: 12,
      borderRadius: 8,
      gap: 8,
   },
   primaryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
   dangerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F44336',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      gap: 8,
   },
   dangerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
   visitsSection: {
      padding: 16,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#212121',
      marginBottom: 16,
   },
   emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      backgroundColor: '#fff',
      borderRadius: 12,
   },
   emptyText: {
      fontSize: 14,
      color: '#999',
      marginTop: 12,
   },
   footerInfo: {
      padding: 16,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
   },
   footerText: {
      fontSize: 12,
      color: '#999',
      marginBottom: 4,
   },
});
