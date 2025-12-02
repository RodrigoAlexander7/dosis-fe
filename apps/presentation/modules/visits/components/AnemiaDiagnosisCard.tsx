import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, getAnemiaSeverityColor } from '@/utils/styles/colors';
import { AnemiaSeverity } from '@/services/types/patient.types';

interface AnemiaDiagnosisCardProps {
   hbAdjusted: number;
   anemiaSeverity: AnemiaSeverity;
   severityLabel: string;
}

const getSeverityLabel = (severity: AnemiaSeverity): string => {
   switch (severity) {
      case AnemiaSeverity.NONE: return 'Sin Anemia';
      case AnemiaSeverity.MILD: return 'Anemia Leve';
      case AnemiaSeverity.MODERATE: return 'Anemia Moderada';
      case AnemiaSeverity.SEVERE: return 'Anemia Severa';
      default: return 'Desconocido';
   }
};

export const AnemiaDiagnosisCard: React.FC<AnemiaDiagnosisCardProps> = ({
   hbAdjusted,
   anemiaSeverity,
}) => {
   const severityColor = getAnemiaSeverityColor(anemiaSeverity);
   const label = getSeverityLabel(anemiaSeverity);

   return (
      <View style={[styles.diagnosisCard, { borderColor: severityColor }]}>
         <View style={styles.diagnosisHeader}>
            <Ionicons name="fitness" size={24} color={severityColor} />
            <Text style={styles.diagnosisTitle}>Diagnóstico de Anemia</Text>
         </View>

         <View style={styles.diagnosisContent}>
            <Text style={styles.diagnosisLabel}>Hemoglobina Ajustada</Text>
            <Text style={styles.diagnosisValue}>{hbAdjusted.toFixed(2)} g/dL</Text>
         </View>

         <View style={[styles.diagnosisBadge, { backgroundColor: severityColor }]}>
            <Text style={styles.diagnosisBadgeText}>{label}</Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   diagnosisCard: {
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      backgroundColor: AppColors.background.primary,
   },
   diagnosisHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
   },
   diagnosisTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: AppColors.text.primary,
   },
   diagnosisContent: {
      marginBottom: 12,
   },
   diagnosisLabel: {
      fontSize: 14,
      color: AppColors.text.secondary,
      marginBottom: 4,
   },
   diagnosisValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: AppColors.text.primary,
   },
   diagnosisBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: 'flex-start',
   },
   diagnosisBadgeText: {
      color: AppColors.text.white,
      fontSize: 14,
      fontWeight: '600',
   },
});
