import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   Alert,
   ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { TextField, Button, RadioGroup, RadioButton, Colors } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { visitsApi } from '@/services/api/visits.api';
import { patientsApi } from '@/services/api/patients.api';
import { CreatePatientVisitDto } from '@/services/types/visit.types';
import { Gender, FemaleAdditional, GestationTrimester, AnemiaSeverity } from '@/services/types/patient.types';
import { useHemoglobinCalculations } from '@/hooks/useHemoglobinCalculations';
import { useSupplementCalculations } from '@/hooks/useSupplementCalculations';
import { Picker } from 'react-native-ui-lib';
import { Suplement, suplementSchema } from '@/modules/suplement/dto/suplement.dto';
import suplement_information from '@/utils/json/suplement_information.json';
import { getErrorMessage } from '@/utils/errorHandler';

const suplementItems: Suplement[] = suplementSchema.array().parse(suplement_information);
const suplementPickerItems = suplementItems.map((item) => ({
   label: item.name,
   value: item.idSuplement,
}));

dayjs.locale('es');

export default function CreateVisitScreen() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const { patientDni: urlDni } = useLocalSearchParams<{ patientDni?: string }>();
   const { calculate, mapExistingToBackend } = useHemoglobinCalculations();
   const { calculateSupplement, getRecommendedSupplements } = useSupplementCalculations();

   // Form state
   const [dni, setDni] = useState(urlDni || '');
   const [searchedDni, setSearchedDni] = useState(urlDni || '');
   const [weight, setWeight] = useState('');
   const [hbObserved, setHbObserved] = useState('');
   const [femaleAditional, setFemaleAditional] = useState<'G' | 'P' | null>(null);
   const [gestationTime, setGestationTime] = useState<'1' | '2' | '3' | null>(null);
   const [selectedSupplementId, setSelectedSupplementId] = useState<string>('');

   // Auto-load patient when URL has DNI
   useEffect(() => {
      if (urlDni && urlDni.length === 8) {
         setSearchedDni(urlDni);
      }
   }, [urlDni]);

   // Query patient data
   const { data: patient, isLoading, refetch } = useQuery({
      queryKey: ['patient', searchedDni],
      queryFn: () => patientsApi.getByDni(searchedDni),
      enabled: searchedDni.length === 8,
      retry: false,
   });

   // Mutation
   const createMutation = useMutation({
      mutationFn: (data: CreatePatientVisitDto) => visitsApi.create(data),
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: ['patients'] });
         queryClient.invalidateQueries({ queryKey: ['visits'] });
         Alert.alert('Éxito', 'Visita creada correctamente', [
            {
               text: 'Ver Paciente',
               onPress: () => router.replace(`/(home)/patients/${dni}`),
            },
         ]);
      },
      onError: (error: any) => {
         Alert.alert('Error', getErrorMessage(error, 'Error al crear visita'));
      },
   });

   const handleSearchPatient = () => {
      if (dni.length !== 8) {
         Alert.alert('Error', 'El DNI debe tener 8 dígitos');
         return;
      }
      setSearchedDni(dni);
   };

   const isFormValid = (): boolean => {
      return (
         patient !== undefined &&
         weight !== '' &&
         Number(weight) > 0 &&
         hbObserved !== '' &&
         Number(hbObserved) > 0
      );
   };

   const handleSubmit = () => {
      if (!isFormValid() || !patient) {
         Alert.alert('Error', 'Por favor complete todos los campos correctamente');
         return;
      }

      // Mapear género del paciente
      const patientGender = patient.gender === Gender.MALE ? 'M' : 'F' as 'M' | 'F';

      // Mapear tipos a formato backend
      const backendTypes = mapExistingToBackend({
         gender: patientGender,
         femaleAditional,
         gestationTime,
      });

      // Calcular hemoglobina ajustada y severidad
      const altitudeAdjustment = patient.town?.altitud
         ? getAltitudeAdjustment(patient.town.altitud)
         : 0;

      const calculations = calculate({
         hbObserved: Number(hbObserved),
         altitudeAdjustment,
         birthDate: patient.birthDate,
         gender: backendTypes.gender,
         femaleAdditional: backendTypes.femaleAdditional,
         gestationTrimester: backendTypes.gestationTrimester,
      });

      // Construir DTO para backend
      const createDto: CreatePatientVisitDto = {
         patientDni: dni,
         visitDate: dayjs().format('YYYY-MM-DD'),
         weight: Number(weight),
         hbObserved: Number(hbObserved),
         hbAdjusted: calculations.hbAdjusted,
         anemiaSeverity: calculations.anemiaSeverity,
         femaleAdditional: backendTypes.femaleAdditional,
         gestationTrimester: backendTypes.gestationTrimester,
      };

      createMutation.mutate(createDto);
   };

   // Cálculo de ajuste por altitud (basado en lógica existente)
   const getAltitudeAdjustment = (altitude: number): number => {
      if (altitude < 1000) return 0;
      if (altitude < 2000) return 0.2;
      if (altitude < 3000) return 0.5;
      if (altitude < 4000) return 0.8;
      return 1.0;
   };

   const patientAge = patient ? dayjs().diff(dayjs(patient.birthDate), 'year') : null;

   // Calcular suplemento si hay datos suficientes
   const supplementResult = patient && weight && hbObserved ? calculateSupplement({
      birthDate: patient.birthDate,
      weight: Number(weight),
      isAnemic: false, // Se actualiza después de calcular HB
      gender: patient.gender,
      supplementId: selectedSupplementId,
   }) : null;

   // Filtrar suplementos recomendados según edad
   const recommendedSupplementIds = patient ? getRecommendedSupplements(patientAge!) : [];
   const filteredSupplements = suplementPickerItems.filter(item =>
      recommendedSupplementIds.includes(item.value)
   );

   return (
      <ScrollView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
               <Ionicons name="arrow-back" size={24} color="#2196F3" />
            </TouchableOpacity>
            <Text style={styles.title}>Nueva Visita</Text>
         </View>

         {/* Search Patient */}
         <View style={styles.card}>
            <Text style={styles.sectionTitle}>Buscar Paciente</Text>

            <View style={styles.searchRow}>
               <View style={styles.searchInputContainer}>
                  <Text style={styles.label}>DNI del Paciente</Text>
                  <TextField
                     style={styles.textInput}
                     value={dni}
                     onChangeText={setDni}
                     keyboardType="numeric"
                     maxLength={8}
                     placeholder="12345678"
                     placeholderTextColor="#A0AEC0"
                     editable={!urlDni}
                  />
               </View>
               {!urlDni && (
                  <Button
                     label="Buscar"
                     onPress={handleSearchPatient}
                     backgroundColor={Colors.primary}
                     style={styles.searchButton}
                     disabled={isLoading}
                  />
               )}
            </View>

            {isLoading && (
               <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
            )}

            {patient && (
               <View style={styles.patientInfo}>
                  <View style={styles.patientHeader}>
                     <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                     <Text style={styles.patientFoundText}>Paciente encontrado</Text>
                  </View>
                  <View style={styles.patientDetails}>
                     <Text style={styles.patientName}>{patient.name}</Text>
                     <Text style={styles.patientDetail}>DNI: {patient.dni}</Text>
                     <Text style={styles.patientDetail}>
                        Edad: {patientAge} años
                     </Text>
                     <Text style={styles.patientDetail}>
                        Ubicación: {patient.town?.name}, {patient.district?.name}
                     </Text>
                     <Text style={styles.patientDetail}>
                        Altitud: {patient.town?.altitud} msnm
                     </Text>
                     {patient.visits && patient.visits.length > 0 && (
                        <Text style={styles.patientDetail}>
                           Visitas previas: {patient.visits.length}
                        </Text>
                     )}
                  </View>
               </View>
            )}

            {searchedDni && !patient && !isLoading && (
               <View style={styles.errorInfo}>
                  <Ionicons name="alert-circle" size={24} color="#F44336" />
                  <Text style={styles.errorText}>
                     No se encontró ningún paciente con ese DNI
                  </Text>
               </View>
            )}
         </View>

         {patient && (
            <>
               <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Datos de la Visita</Text>

                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>Peso (kg) *</Text>
                     <TextField
                        style={styles.textInput}
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="decimal-pad"
                        placeholder="65.5"
                        placeholderTextColor="#A0AEC0"
                     />
                  </View>

                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>HB Observada (g/dL) *</Text>
                     <TextField
                        style={styles.textInput}
                        value={hbObserved}
                        onChangeText={setHbObserved}
                        keyboardType="decimal-pad"
                        placeholder="12.5"
                        placeholderTextColor="#A0AEC0"
                     />
                  </View>

                  {patient.gender === Gender.FEMALE && (
                     <>
                        <View style={styles.inputGroup}>
                           <Text style={styles.label}>Condición Adicional</Text>
                           <RadioGroup
                              initialValue={femaleAditional}
                              onValueChange={setFemaleAditional}
                           >
                              <View style={styles.radioColumn}>
                                 <RadioButton value={null} label="Ninguna" color={Colors.primary} />
                                 <RadioButton value="G" label="Gestante" color={Colors.primary} />
                                 <RadioButton value="P" label="Puerperio" color={Colors.primary} />
                              </View>
                           </RadioGroup>
                        </View>

                        {femaleAditional === 'G' && (
                           <View style={styles.inputGroup}>
                              <Text style={styles.label}>Trimestre de Gestación</Text>
                              <RadioGroup
                                 initialValue={gestationTime}
                                 onValueChange={setGestationTime}
                              >
                                 <View style={styles.radioColumn}>
                                    <RadioButton value="1" label="Primer Trimestre" color={Colors.primary} />
                                    <RadioButton value="2" label="Segundo Trimestre" color={Colors.primary} />
                                    <RadioButton value="3" label="Tercer Trimestre" color={Colors.primary} />
                                 </View>
                              </RadioGroup>
                           </View>
                        )}
                     </>
                  )}

                  {patient.town && (
                     <View style={styles.adjustmentInfo}>
                        <Ionicons name="information-circle" size={20} color="#2196F3" />
                        <Text style={styles.adjustmentText}>
                           Ajuste por altitud: {getAltitudeAdjustment(patient.town.altitud).toFixed(1)} g/dL
                        </Text>
                     </View>
                  )}
               </View>

               {/* Supplement Selection */}
               {weight && hbObserved && (
                  <View style={styles.card}>
                     <Text style={styles.sectionTitle}>Suplementación</Text>

                     {!supplementResult?.isAdult && (
                        <View style={styles.inputGroup}>
                           <Text style={styles.label}>Tipo de Suplemento</Text>
                           <Picker
                              value={selectedSupplementId}
                              items={filteredSupplements}
                              onChange={(value) => setSelectedSupplementId(value as string)}
                              style={styles.picker}
                              placeholder="Seleccionar suplemento..."
                              mode="SINGLE"
                              showSearch
                              searchPlaceholder="Buscar..."
                           />
                        </View>
                     )}

                     {supplementResult?.supplement && (
                        <View style={styles.supplementResult}>
                           <View style={styles.supplementHeader}>
                              <Ionicons name="medical" size={24} color="#4CAF50" />
                              <Text style={styles.supplementTitle}>
                                 {supplementResult.isAdult ? 'Tratamiento Adulto' : 'Tratamiento Pediátrico'}
                              </Text>
                           </View>

                           <View style={styles.supplementDetails}>
                              <Text style={styles.supplementProduct}>
                                 {supplementResult.supplement.name}
                              </Text>

                              <View style={styles.doseInfo}>
                                 <Ionicons name="water" size={16} color="#666" />
                                 <Text style={styles.doseText}>
                                    Dosis: {supplementResult.doseAmount.toFixed(2)} {supplementResult.unitMeasure} diarios
                                 </Text>
                              </View>

                              <View style={styles.doseInfo}>
                                 <Ionicons name="calendar" size={16} color="#666" />
                                 <Text style={styles.doseText}>
                                    Duración: {supplementResult.isAdult ? '6 meses (tratamiento)' : '6 meses si anémico, 3 meses prevención'}
                                 </Text>
                              </View>

                              <View style={styles.doseInfo}>
                                 <Ionicons name="cube" size={16} color="#666" />
                                 <Text style={styles.doseText}>
                                    {supplementResult.isAdult ? 'Tabletas' : 'Frascos'} necesarios: {supplementResult.bottleNumber}
                                 </Text>
                              </View>

                              {supplementResult.supplement.notes && (
                                 <View style={styles.notesBox}>
                                    <Text style={styles.notesLabel}>Notas:</Text>
                                    <Text style={styles.notesText}>
                                       {supplementResult.supplement.notes}
                                    </Text>
                                 </View>
                              )}
                           </View>
                        </View>
                     )}

                     {!supplementResult?.isAdult && !selectedSupplementId && (
                        <View style={styles.infoBox}>
                           <Ionicons name="information-circle-outline" size={20} color="#2196F3" />
                           <Text style={styles.infoText}>
                              Seleccione un suplemento para calcular la dosis según peso y edad del paciente
                           </Text>
                        </View>
                     )}
                  </View>
               )}

               <View style={styles.buttonContainer}>
                  <Button
                     label="Crear Visita"
                     onPress={handleSubmit}
                     disabled={!isFormValid() || createMutation.isPending}
                     backgroundColor={Colors.primary}
                     style={styles.submitButton}
                     labelStyle={styles.submitButtonLabel}
                  />
               </View>
            </>
         )}
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F4F7FC',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
   },
   backButton: {
      marginRight: 16,
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#212121',
   },
   card: {
      backgroundColor: '#fff',
      margin: 16,
      marginBottom: 0,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#212121',
      marginBottom: 16,
   },
   searchRow: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-end',
   },
   searchInputContainer: {
      flex: 1,
   },
   searchButton: {
      height: 50,
      paddingHorizontal: 24,
   },
   inputGroup: {
      marginBottom: 16,
   },
   label: {
      fontSize: 14,
      fontWeight: '500',
      color: '#212121',
      marginBottom: 8,
   },
   textInput: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#fff',
   },
   radioColumn: {
      gap: 12,
   },
   loader: {
      marginVertical: 20,
   },
   patientInfo: {
      marginTop: 16,
      padding: 16,
      backgroundColor: '#E8F5E9',
      borderRadius: 8,
   },
   patientHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
   },
   patientFoundText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2E7D32',
   },
   patientDetails: {
      gap: 6,
   },
   patientName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#212121',
      marginBottom: 8,
   },
   patientDetail: {
      fontSize: 14,
      color: '#666',
   },
   errorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 16,
      padding: 16,
      backgroundColor: '#FFEBEE',
      borderRadius: 8,
   },
   errorText: {
      flex: 1,
      fontSize: 14,
      color: '#C62828',
   },
   adjustmentInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      backgroundColor: '#E3F2FD',
      borderRadius: 8,
      marginTop: 8,
   },
   adjustmentText: {
      fontSize: 14,
      color: '#1976D2',
      fontWeight: '500',
   },
   buttonContainer: {
      padding: 16,
   },
   submitButton: {
      height: 50,
      borderRadius: 8,
   },
   submitButtonLabel: {
      fontSize: 16,
      fontWeight: '600',
   },
   picker: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      backgroundColor: '#fff',
   },
   supplementResult: {
      backgroundColor: '#F1F8F4',
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
      color: '#2E7D32',
   },
   supplementDetails: {
      gap: 12,
   },
   supplementProduct: {
      fontSize: 16,
      fontWeight: '600',
      color: '#212121',
      marginBottom: 8,
   },
   doseInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   doseText: {
      fontSize: 14,
      color: '#666',
      flex: 1,
   },
   notesBox: {
      marginTop: 12,
      padding: 12,
      backgroundColor: '#FFF9E6',
      borderRadius: 6,
      borderLeftWidth: 3,
      borderLeftColor: '#FFC107',
   },
   notesLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: '#F57C00',
      marginBottom: 4,
   },
   notesText: {
      fontSize: 12,
      color: '#666',
   },
   infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      backgroundColor: '#E3F2FD',
      borderRadius: 8,
      marginTop: 12,
   },
   infoText: {
      flex: 1,
      fontSize: 13,
      color: '#1976D2',
   },
});
