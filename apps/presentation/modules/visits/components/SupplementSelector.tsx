import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Picker, TextField } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/utils/styles/colors';
import { Supplement } from '@/services/types/supplement.types';
import { getSupplementImage, defaultSupplementImage } from '@/utils/supplementImages';

interface SupplementSelectorProps {
   supplements: Supplement[];
   selectedSupplementId: string;
   onSupplementChange: (id: string) => void;
   treatmentMonths: number;
   onTreatmentMonthsChange: (months: number) => void;
   prescriptionNotes: string;
   onPrescriptionNotesChange: (notes: string) => void;
   supplementPreview?: {
      supplement: Supplement;
      prescribedDose: number;
      unitMeasure: string;
      treatmentDurationDays: number;
      numberOfBottles: number;
   } | null;
}

export const SupplementSelector: React.FC<SupplementSelectorProps> = ({
   supplements,
   selectedSupplementId,
   onSupplementChange,
   treatmentMonths,
   onTreatmentMonthsChange,
   prescriptionNotes,
   onPrescriptionNotesChange,
   supplementPreview,
}) => {
   return (
      <View style={styles.card}>
         <Text style={styles.sectionTitle}>Suplementación</Text>

         <View style={styles.inputGroup}>
            <Text style={styles.label}>Suplemento (opcional)</Text>
            <Picker
               value={selectedSupplementId}
               items={supplements.map(s => ({ label: s.name, value: s.idSupplement }))}
               onChange={(value) => onSupplementChange(value as string)}
               style={styles.picker}
               placeholder="Seleccionar suplemento..."
               showSearch
               searchPlaceholder="Buscar..."
            />
         </View>

         {selectedSupplementId && (
            <>
               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Duración del Tratamiento</Text>
                  <Picker
                     value={treatmentMonths}
                     items={[
                        { label: '1 mes', value: 1 },
                        { label: '2 meses', value: 2 },
                        { label: '3 meses', value: 3 },
                        { label: '4 meses', value: 4 },
                        { label: '5 meses', value: 5 },
                        { label: '6 meses', value: 6 },
                     ]}
                     onChange={(value) => onTreatmentMonthsChange(value as number)}
                     style={styles.picker}
                     placeholder="Seleccionar duración..."
                  />
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Notas de Prescripción (opcional)</Text>
                  <TextField
                     style={[styles.textInput, styles.textArea]}
                     value={prescriptionNotes}
                     onChangeText={onPrescriptionNotesChange}
                     placeholder="Indicaciones adicionales..."
                     placeholderTextColor={AppColors.text.placeholder}
                     multiline
                     numberOfLines={3}
                  />
               </View>
            </>
         )}

         {supplementPreview && (
            <View style={styles.supplementResult}>
               <View style={styles.supplementHeader}>
                  <Ionicons name="medical" size={24} color={AppColors.success} />
                  <Text style={styles.supplementTitle}>Prescripción Calculada</Text>
               </View>

               <Image
                  source={getSupplementImage(supplementPreview.supplement.name) || defaultSupplementImage}
                  style={styles.supplementImage}
                  resizeMode="contain"
               />

               <View style={styles.supplementDetails}>
                  <Text style={styles.supplementProduct}>
                     {supplementPreview.supplement.name}
                  </Text>

                  <View style={styles.doseInfo}>
                     <Ionicons name="water" size={16} color={AppColors.primary} />
                     <Text style={styles.doseText}>
                        Dosis por toma: <Text style={styles.doseBold}>
                           {supplementPreview.prescribedDose.toFixed(2)} {supplementPreview.unitMeasure}
                        </Text>
                     </Text>
                  </View>

                  <View style={styles.doseInfo}>
                     <Ionicons name="calendar" size={16} color={AppColors.primary} />
                     <Text style={styles.doseText}>
                        Duración: <Text style={styles.doseBold}>
                           {treatmentMonths} {treatmentMonths === 1 ? 'mes' : 'meses'} ({supplementPreview.treatmentDurationDays} días)
                        </Text>
                     </Text>
                  </View>

                  <View style={styles.doseInfo}>
                     <Ionicons name="cube" size={16} color={AppColors.primary} />
                     <Text style={styles.doseText}>
                        Frascos necesarios: <Text style={styles.doseBold}>
                           {supplementPreview.numberOfBottles}
                        </Text>
                     </Text>
                  </View>

                  <View style={styles.doseInfo}>
                     <Ionicons name="information-circle" size={16} color={AppColors.primary} />
                     <Text style={styles.doseText}>
                        Presentación: <Text style={styles.doseBold}>
                           {supplementPreview.supplement.presentation}
                        </Text>
                     </Text>
                  </View>

                  <View style={styles.doseInfo}>
                     <Ionicons name="flask" size={16} color={AppColors.primary} />
                     <Text style={styles.doseText}>
                        Contenido: <Text style={styles.doseBold}>
                           {supplementPreview.supplement.content} {supplementPreview.supplement.contentUnit}
                        </Text>
                     </Text>
                  </View>
               </View>

               {prescriptionNotes && (
                  <View style={styles.notesBox}>
                     <Text style={styles.notesLabel}>Notas de Prescripción:</Text>
                     <Text style={styles.notesText}>{prescriptionNotes}</Text>
                  </View>
               )}
            </View>
         )}

         {!selectedSupplementId && (
            <View style={styles.infoBox}>
               <Ionicons name="information-circle-outline" size={20} color={AppColors.primary} />
               <Text style={styles.infoText}>
                  Puedes agregar una prescripción de suplemento después de completar los datos de la visita
               </Text>
            </View>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   card: {
      backgroundColor: AppColors.background.primary,
      margin: 16,
      marginBottom: 0,
      borderRadius: 12,
      padding: 16,
      shadowColor: AppColors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: AppColors.text.primary,
      marginBottom: 16,
   },
   inputGroup: {
      marginBottom: 16,
   },
   label: {
      fontSize: 14,
      fontWeight: '500',
      color: AppColors.text.primary,
      marginBottom: 8,
   },
   picker: {
      borderWidth: 1,
      borderColor: AppColors.border,
      borderRadius: 8,
      backgroundColor: AppColors.background.primary,
   },
   textInput: {
      borderWidth: 1,
      borderColor: AppColors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: AppColors.background.primary,
   },
   textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
   },
   supplementResult: {
      backgroundColor: AppColors.background.success,
      borderRadius: 8,
      padding: 16,
      marginTop: 12,
   },
   supplementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
   },
   supplementTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: AppColors.success,
   },
   supplementImage: {
      width: 120,
      height: 120,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: AppColors.border,
      alignSelf: 'center',
   },
   supplementDetails: {
      gap: 12,
   },
   supplementProduct: {
      fontSize: 16,
      fontWeight: '600',
      color: AppColors.text.primary,
      marginBottom: 8,
   },
   doseInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   doseText: {
      fontSize: 14,
      color: AppColors.text.secondary,
      flex: 1,
   },
   doseBold: {
      fontWeight: '600',
      color: AppColors.text.primary,
   },
   notesBox: {
      marginTop: 12,
      padding: 12,
      backgroundColor: AppColors.background.warning,
      borderRadius: 6,
      borderLeftWidth: 3,
      borderLeftColor: AppColors.warning,
   },
   notesLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: AppColors.text.primary,
      marginBottom: 4,
   },
   notesText: {
      fontSize: 12,
      color: AppColors.text.secondary,
   },
   infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      backgroundColor: AppColors.background.info,
      borderRadius: 8,
      marginTop: 12,
   },
   infoText: {
      flex: 1,
      fontSize: 13,
      color: AppColors.info,
   },
});
