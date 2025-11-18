import React, { useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   ActivityIndicator,
   TouchableOpacity,
   Alert,
   RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { visitsApi } from '@/services/api/visits.api';
import { AnemiaSeverity, FemaleAdditional, GestationTrimester } from '@/services/types/patient.types';
import { useAuthStore, canDeleteRecords } from '@/stores/authStore';
import { getErrorMessage } from '@/utils/errorHandler';

export default function VisitDetailsScreen() {
   const { id } = useLocalSearchParams<{ id: string }>();
   const router = useRouter();
   const { user } = useAuthStore();
   const queryClient = useQueryClient();
   const [refreshing, setRefreshing] = useState(false);

   // Redirect if trying to access create route through [id] pattern
   React.useEffect(() => {
      if (id === 'create' || id === 'index') {
         router.back();
      }
   }, [id, router]);

   // Convert id to number and validate
   const visitId = id ? Number(id) : null;
   const isValidId = visitId !== null && !isNaN(visitId) && visitId > 0;

   const { data: visit, isLoading, error, refetch } = useQuery({
      queryKey: ['visit', visitId],
      queryFn: () => {
         console.log('Fetching visit with ID:', visitId);
         if (!isValidId) {
            throw new Error('ID de visita inválido');
         }
         return visitsApi.getById(visitId!);
      },
      enabled: isValidId,
   });

   // Debug: Log the error if any
   React.useEffect(() => {
      if (error) {
         console.error('Error loading visit:', error);
         console.log('Visit ID:', id, 'Parsed:', visitId, 'Valid:', isValidId);
      }
   }, [error, id, visitId, isValidId]);

   const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
   }, [refetch]);

   const deleteMutation = useMutation({
      mutationFn: () => {
         if (!visitId) throw new Error('ID de visita inválido');
         return visitsApi.delete(visitId);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['patient'] });
         queryClient.invalidateQueries({ queryKey: ['visits'] });
         Alert.alert('Éxito', 'Visita eliminada correctamente');
         router.back();
      },
      onError: (error: any) => {
         Alert.alert('Error', getErrorMessage(error, 'Error al eliminar visita'));
      },
   });

   const handleDelete = () => {
      Alert.alert(
         'Confirmar eliminación',
         '¿Está seguro que desea eliminar esta visita? Esta acción no se puede deshacer.',
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

   const getSeverityColor = (severity: AnemiaSeverity): string => {
      switch (severity) {
         case AnemiaSeverity.NONE:
            return '#4CAF50';
         case AnemiaSeverity.MILD:
            return '#FF9800';
         case AnemiaSeverity.MODERATE:
            return '#FF5722';
         case AnemiaSeverity.SEVERE:
            return '#F44336';
         default:
            return '#9E9E9E';
      }
   };

   const getSeverityLabel = (severity: AnemiaSeverity): string => {
      switch (severity) {
         case AnemiaSeverity.NONE:
            return 'Sin Anemia';
         case AnemiaSeverity.MILD:
            return 'Anemia Leve';
         case AnemiaSeverity.MODERATE:
            return 'Anemia Moderada';
         case AnemiaSeverity.SEVERE:
            return 'Anemia Severa';
         default:
            return 'N/A';
      }
   };

   const getFemaleAdditionalLabel = (status: FemaleAdditional): string | null => {
      switch (status) {
         case FemaleAdditional.PREGNANT:
            return 'Gestante';
         case FemaleAdditional.LACTATING:
            return 'Lactante';
         case FemaleAdditional.NONE:
            return null;
         default:
            return null;
      }
   };

   const getGestationLabel = (trimester: GestationTrimester): string | null => {
      switch (trimester) {
         case GestationTrimester.FIRST:
            return '1er Trimestre';
         case GestationTrimester.SECOND:
            return '2do Trimestre';
         case GestationTrimester.THIRD:
            return '3er Trimestre';
         case GestationTrimester.NONE:
            return null;
         default:
            return null;
      }
   };

   if (isLoading) {
      return (
         <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2196F3" />
         </View>
      );
   }

   if (!isValidId) {
      return (
         <View style={styles.centered}>
            <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
            <Text style={styles.errorText}>ID de visita inválido</Text>
            <Text style={styles.errorDetail}>
               El ID proporcionado ({id}) no es válido
            </Text>
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
         </View>
      );
   }

   if (!visit) {
      return (
         <View style={styles.centered}>
            <Text style={styles.errorText}>Visita no encontrada</Text>
            {error && (
               <Text style={styles.errorDetail}>
                  {getErrorMessage(error as any, 'Error al cargar visita')}
               </Text>
            )}
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
         </View>
      );
   }

   const femaleAdditionalLabel = getFemaleAdditionalLabel(visit.femaleAdditional);
   const gestationLabel = getGestationLabel(visit.gestationTrimester);

   return (
      <ScrollView 
         style={styles.container}
         refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
         }
      >
         {/* Visit Info Card */}
         <View style={styles.infoCard}>
            <View style={styles.header}>
               <View style={styles.headerLeft}>
                  <Text style={styles.title}>Visita #{visit.visitId}</Text>
                  <Text style={styles.subtitle}>
                     {dayjs(visit.visitDate).format('DD/MM/YYYY')}
                  </Text>
               </View>
               <View
                  style={[
                     styles.severityBadge,
                     { backgroundColor: getSeverityColor(visit.anemiaSeverity) },
                  ]}
               >
                  <Text style={styles.severityText}>
                     {getSeverityLabel(visit.anemiaSeverity)}
                  </Text>
               </View>
            </View>

            {/* Patient Link */}
            <TouchableOpacity
               style={styles.patientLink}
               onPress={() => router.push(`/(home)/patients/${visit.patientDni}`)}
            >
               <Ionicons name="person-outline" size={20} color="#2196F3" />
               <Text style={styles.patientLinkText}>Ver Paciente DNI: {visit.patientDni}</Text>
               <Ionicons name="chevron-forward" size={20} color="#2196F3" />
            </TouchableOpacity>

            {/* Measurements Section */}
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Mediciones</Text>
               <View style={styles.measurementsGrid}>
                  <View style={styles.measurementCard}>
                     <Ionicons name="scale-outline" size={24} color="#2196F3" />
                     <Text style={styles.measurementLabel}>Peso</Text>
                     <Text style={styles.measurementValue}>{visit.weight} kg</Text>
                  </View>

                  <View style={styles.measurementCard}>
                     <Ionicons name="water-outline" size={24} color="#FF5722" />
                     <Text style={styles.measurementLabel}>HB Observada</Text>
                     <Text style={styles.measurementValue}>
                        {Number(visit.hbObserved).toFixed(1)} g/dL
                     </Text>
                  </View>

                  <View style={styles.measurementCard}>
                     <Ionicons name="analytics-outline" size={24} color="#4CAF50" />
                     <Text style={styles.measurementLabel}>HB Ajustada</Text>
                     <Text style={styles.measurementValue}>
                        {Number(visit.hbAdjusted).toFixed(1)} g/dL
                     </Text>
                  </View>
               </View>
            </View>

            {/* Female Additional Info */}
            {(femaleAdditionalLabel || gestationLabel) && (
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Información Adicional</Text>
                  <View style={styles.infoRow}>
                     <Ionicons name="information-circle-outline" size={20} color="#666" />
                     <View style={styles.infoContent}>
                        {femaleAdditionalLabel && (
                           <Text style={styles.infoText}>{femaleAdditionalLabel}</Text>
                        )}
                        {gestationLabel && (
                           <Text style={styles.infoText}>{gestationLabel}</Text>
                        )}
                     </View>
                  </View>
               </View>
            )}

            {/* Prescriptions Section */}
            {visit.prescriptions && visit.prescriptions.length > 0 && (
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Prescripciones</Text>
                  {visit.prescriptions.map((prescription) => (
                     <View key={prescription.prescriptionId} style={styles.prescriptionCard}>
                        <View style={styles.prescriptionHeader}>
                           <View style={styles.supplementInfo}>
                              <Ionicons name="medkit" size={20} color="#2196F3" />
                              <View style={styles.supplementText}>
                                 <Text style={styles.supplementName}>
                                    {prescription.supplement?.name || 'Suplemento'}
                                 </Text>
                                 <Text style={styles.supplementType}>
                                    {prescription.supplement?.type} - {prescription.supplement?.presentation}
                                 </Text>
                              </View>
                           </View>
                        </View>

                        <View style={styles.prescriptionDetails}>
                           <View style={styles.prescriptionDetailRow}>
                              <Ionicons name="water-outline" size={16} color="#666" />
                              <Text style={styles.prescriptionDetailText}>
                                 Dosis: {Number(prescription.prescribedDose).toFixed(1)} mg
                              </Text>
                           </View>

                           <View style={styles.prescriptionDetailRow}>
                              <Ionicons name="calendar-outline" size={16} color="#666" />
                              <Text style={styles.prescriptionDetailText}>
                                 Duración: {prescription.treatmentDurationDays} días
                              </Text>
                           </View>

                           {prescription.prescriptionNotes && (
                              <View style={styles.prescriptionDetailRow}>
                                 <Ionicons name="document-text-outline" size={16} color="#666" />
                                 <Text style={styles.prescriptionDetailText}>
                                    {prescription.prescriptionNotes}
                                 </Text>
                              </View>
                           )}
                        </View>
                     </View>
                  ))}
               </View>
            )}

            {/* Created By Info */}
            {visit.createdBy && (
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Registro</Text>
                  <View style={styles.infoRow}>
                     <Ionicons name="person-circle-outline" size={20} color="#666" />
                     <View style={styles.infoContent}>
                        <Text style={styles.infoText}>
                           Registrado por: {visit.createdBy.name}
                        </Text>
                        <Text style={styles.infoSubtext}>
                           Rol: {visit.createdBy.role}
                        </Text>
                        <Text style={styles.infoSubtext}>
                           Fecha: {dayjs(visit.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Text>
                     </View>
                  </View>
               </View>
            )}

            {/* Action Buttons */}
            {canDeleteRecords(user) && (
               <TouchableOpacity
                  style={styles.dangerButton}
                  onPress={handleDelete}
                  disabled={deleteMutation.isPending}
               >
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                  <Text style={styles.dangerButtonText}>
                     {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar Visita'}
                  </Text>
               </TouchableOpacity>
            )}
         </View>
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
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
   },
   headerLeft: {
      flex: 1,
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#212121',
      marginBottom: 4,
   },
   subtitle: {
      fontSize: 16,
      color: '#666',
   },
   severityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
   },
   severityText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
   },
   patientLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      backgroundColor: '#E3F2FD',
      borderRadius: 8,
      marginBottom: 16,
   },
   patientLinkText: {
      flex: 1,
      fontSize: 14,
      color: '#2196F3',
      fontWeight: '600',
   },
   section: {
      marginBottom: 20,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#212121',
      marginBottom: 12,
   },
   measurementsGrid: {
      flexDirection: 'row',
      gap: 12,
   },
   measurementCard: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      gap: 4,
   },
   measurementLabel: {
      fontSize: 11,
      color: '#666',
      textAlign: 'center',
   },
   measurementValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#212121',
   },
   infoRow: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
   },
   infoContent: {
      flex: 1,
      gap: 4,
   },
   infoText: {
      fontSize: 14,
      color: '#212121',
   },
   infoSubtext: {
      fontSize: 12,
      color: '#666',
   },
   dangerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F44336',
      paddingVertical: 12,
      borderRadius: 8,
      gap: 8,
      marginTop: 8,
   },
   dangerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
   prescriptionCard: {
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderLeftWidth: 3,
      borderLeftColor: '#2196F3',
   },
   prescriptionHeader: {
      marginBottom: 8,
   },
   supplementInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   supplementText: {
      flex: 1,
   },
   supplementName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#212121',
      marginBottom: 2,
   },
   supplementType: {
      fontSize: 12,
      color: '#666',
   },
   prescriptionDetails: {
      gap: 6,
   },
   prescriptionDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   prescriptionDetailText: {
      fontSize: 14,
      color: '#666',
      flex: 1,
   },
   errorText: {
      fontSize: 16,
      color: '#666',
      marginBottom: 8,
   },
   errorDetail: {
      fontSize: 14,
      color: '#F44336',
      marginBottom: 16,
      textAlign: 'center',
      paddingHorizontal: 20,
   },
   backButton: {
      backgroundColor: '#2196F3',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 8,
   },
   backButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
});
