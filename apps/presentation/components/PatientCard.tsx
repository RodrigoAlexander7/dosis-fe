import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Patient, AnemiaSeverity } from '@/services/types/patient.types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface PatientCardProps {
   patient: Patient;
   onPress: () => void;
   showDetails?: boolean;
}

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
         return 'Leve';
      case AnemiaSeverity.MODERATE:
         return 'Moderada';
      case AnemiaSeverity.SEVERE:
         return 'Severa';
      default:
         return 'N/A';
   }
};

export const PatientCard: React.FC<PatientCardProps> = ({
   patient,
   onPress,
   showDetails = false
}) => {
   const latestVisit = patient.visits?.[0];
   const age = dayjs().diff(dayjs(patient.birthDate), 'year');

   return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
         <View style={styles.header}>
            <View style={styles.patientInfo}>
               <Text style={styles.name}>DNI: {patient.dni}</Text>
               <Text style={styles.subtitle}>
                  {age} años • {patient.gender === 'MALE' ? 'Masculino' : 'Femenino'}
               </Text>
            </View>
            {latestVisit && (
               <View
                  style={[
                     styles.severityBadge,
                     { backgroundColor: getSeverityColor(latestVisit.anemiaSeverity) }
                  ]}
               >
                  <Text style={styles.severityText}>
                     {getSeverityLabel(latestVisit.anemiaSeverity)}
                  </Text>
               </View>
            )}
         </View>

         <View style={styles.details}>
            <View style={styles.detailRow}>
               <Ionicons name="calendar-outline" size={16} color="#666" />
               <Text style={styles.detailText}>
                  Nacimiento: {dayjs(patient.birthDate).format('DD/MM/YYYY')}
               </Text>
            </View>
            <View style={styles.detailRow}>
               <Ionicons name="location-outline" size={16} color="#666" />
               <Text style={styles.detailText}>
                  {patient.town?.name}, {patient.district?.name}
               </Text>
            </View>
            {latestVisit && latestVisit.hbAdjusted && (
               <View style={styles.detailRow}>
                  <Ionicons name="water-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                     Última visita: HB {Number(latestVisit.hbAdjusted).toFixed(1)} g/dL
                  </Text>
               </View>
            )}
         </View>

         {showDetails && latestVisit && (
            <View style={styles.visitsCount}>
               <Text style={styles.visitsText}>
                  Última visita: {dayjs(latestVisit.visitDate).format('DD/MM/YYYY')}
               </Text>
            </View>
         )}

         <View style={styles.arrow}>
            <Ionicons name="chevron-forward" size={20} color="#2196F3" />
         </View>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
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
      marginBottom: 12,
   },
   patientInfo: {
      flex: 1,
   },
   name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#212121',
      marginBottom: 4,
   },
   subtitle: {
      fontSize: 14,
      color: '#666',
   },
   dni: {
      fontSize: 14,
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
   details: {
      gap: 8,
   },
   detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   detailText: {
      fontSize: 14,
      color: '#666',
   },
   visitsCount: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
   },
   visitsText: {
      fontSize: 13,
      color: '#2196F3',
      fontWeight: '500',
   },
   arrow: {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: [{ translateY: -10 }],
   },
});
