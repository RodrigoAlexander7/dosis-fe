import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PatientVisit, AnemiaSeverity, FemaleAdditional, GestationTrimester } from '@/services/types/patient.types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { AppColors, getAnemiaSeverityColor } from '@/utils/styles/colors';

interface VisitCardProps {
   visit: PatientVisit;
   onPress?: () => void;
   showPatientInfo?: boolean;
   patientName?: string;
}

// getSeverityColor replaced by getAnemiaSeverityColor from colors.ts

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
      default:
         return null;
   }
};

export const VisitCard: React.FC<VisitCardProps> = ({
   visit,
   onPress,
   showPatientInfo = false,
   patientName
}) => {
   const femaleLabel = getFemaleAdditionalLabel(visit.femaleAdditional);
   const gestationLabel = getGestationLabel(visit.gestationTrimester);

   return (
      <TouchableOpacity
         style={styles.card}
         onPress={onPress}
         disabled={!onPress}
         activeOpacity={onPress ? 0.7 : 1}
      >
         <View style={styles.header}>
            <View style={styles.dateContainer}>
               <Ionicons name="calendar" size={20} color={AppColors.primary} />
               <Text style={styles.date}>
                  {dayjs(visit.visitDate).format('DD/MM/YYYY')}
               </Text>
            </View>
            <View
               style={[
                  styles.severityBadge,
                  { backgroundColor: getAnemiaSeverityColor(visit.anemiaSeverity) }
               ]}
            >
               <Text style={styles.severityText}>
                  {getSeverityLabel(visit.anemiaSeverity)}
               </Text>
            </View>
         </View>

         {showPatientInfo && patientName && (
            <View style={styles.patientInfo}>
               <Ionicons name="person" size={16} color={AppColors.text.secondary} />
               <Text style={styles.patientName}>{patientName}</Text>
            </View>
         )}

         <View style={styles.measurements}>
            <View style={styles.measurement}>
               <Text style={styles.measurementLabel}>Peso</Text>
               <Text style={styles.measurementValue}>{Number(visit.weight).toFixed(1)} kg</Text>
            </View>
            <View style={styles.measurement}>
               <Text style={styles.measurementLabel}>HB Observada</Text>
               <Text style={styles.measurementValue}>{Number(visit.hbObserved).toFixed(1)} g/dL</Text>
            </View>
            <View style={styles.measurement}>
               <Text style={styles.measurementLabel}>HB Ajustada</Text>
               <Text style={styles.measurementValue}>{Number(visit.hbAdjusted).toFixed(1)} g/dL</Text>
            </View>
         </View>

         {(femaleLabel || gestationLabel) && (
            <View style={styles.additionalInfo}>
               {femaleLabel && (
                  <View style={styles.badge}>
                     <Text style={styles.badgeText}>{femaleLabel}</Text>
                  </View>
               )}
               {gestationLabel && (
                  <View style={styles.badge}>
                     <Text style={styles.badgeText}>{gestationLabel}</Text>
                  </View>
               )}
            </View>
         )}

         {visit.prescriptions && visit.prescriptions.length > 0 && (
            <View style={styles.prescriptionsInfo}>
               <Ionicons name="medkit-outline" size={14} color={AppColors.primary} />
               <Text style={styles.prescriptionsText}>
                  {visit.prescriptions.length} {visit.prescriptions.length === 1 ? 'prescripción' : 'prescripciones'}
               </Text>
            </View>
         )}

         {visit.createdBy && (
            <View style={styles.footer}>
               <Ionicons name="person-circle-outline" size={14} color={AppColors.text.tertiary} />
               <Text style={styles.createdBy}>
                  {visit.createdBy.name} ({visit.createdBy.role})
               </Text>
            </View>
         )}
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   card: {
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
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
   },
   dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   date: {
      fontSize: 16,
      fontWeight: '600',
      color: AppColors.text.primary,
   },
   severityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
   },
   severityText: {
      color: AppColors.text.white,
      fontSize: 12,
      fontWeight: '600',
   },
   patientInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: AppColors.border.medium,
   },
   patientName: {
      fontSize: 15,
      fontWeight: '500',
      color: AppColors.text.primary,
   },
   measurements: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
   },
   measurement: {
      flex: 1,
      alignItems: 'center',
   },
   measurementLabel: {
      fontSize: 12,
      color: AppColors.text.tertiary,
      marginBottom: 4,
   },
   measurementValue: {
      fontSize: 16,
      fontWeight: '600',
      color: AppColors.text.primary,
   },
   additionalInfo: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
   },
   badge: {
      backgroundColor: AppColors.background.info,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
   },
   badgeText: {
      fontSize: 12,
      color: AppColors.info,
      fontWeight: '500',
   },
   prescriptionsInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: AppColors.background.success,
      borderRadius: 6,
      alignSelf: 'flex-start',
   },
   prescriptionsText: {
      fontSize: 12,
      color: AppColors.success,
      fontWeight: '500',
   },
   footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: AppColors.border.medium,
   },
   createdBy: {
      fontSize: 12,
      color: AppColors.text.tertiary,
   },
});
