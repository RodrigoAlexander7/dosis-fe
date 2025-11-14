import React, { useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   Alert,
   Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextField, Button, RadioGroup, RadioButton, Colors, Picker } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { patientsApi } from '@/services/api/patients.api';
import { locationsApi } from '@/services/api/locations.api';
import {
   Gender,
   FemaleAdditional,
   GestationTrimester,
   CreatePatientDto,
} from '@/services/types/patient.types';
import { useHemoglobinCalculations } from '@/hooks/useHemoglobinCalculations';
import { getErrorMessage } from '@/utils/errorHandler';
import { useLocationPickerData } from '@/modules/location/hooks/useLocationPickerData';

dayjs.locale('es');

export default function CreatePatientScreen() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const { calculate, mapExistingToBackend } = useHemoglobinCalculations();

   // Location data from local JSON
   const {
      location,
      onLocationChange,
      departmentItems,
      provinceItems,
      districtItems,
      townItems,
      isValidLocation
   } = useLocationPickerData();

   // Form state
   const [dni, setDni] = useState('');
   const [birthDate, setBirthDate] = useState<dayjs.Dayjs>(dayjs());
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [gender, setGender] = useState<'M' | 'F'>('M');
   const [femaleAditional, setFemaleAditional] = useState<'G' | 'P' | null>(null);
   const [gestationTime, setGestationTime] = useState<'1' | '2' | '3' | null>(null);
   const [weight, setWeight] = useState('');
   const [hbObserved, setHbObserved] = useState('');

   // Mutation
   const createMutation = useMutation({
      mutationFn: (data: CreatePatientDto) => patientsApi.create(data),
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: ['patients'] });
         queryClient.invalidateQueries({ queryKey: ['patient', data.dni] });
         Alert.alert('Éxito', 'Paciente creado correctamente', [
            {
               text: 'OK',
               onPress: () => router.push(`/(home)/patients/${data.dni}`),
            },
         ]);
      },
      onError: (error: any) => {
         const errorMessage = error.response?.data?.message;
         const displayMessage = Array.isArray(errorMessage)
            ? errorMessage.join('\n')
            : errorMessage || 'Error al crear paciente';

         Alert.alert('Error', displayMessage);
      },
   });

   const handleDateChange = (event: any, selectedDate?: Date) => {
      if (event?.type === 'dismissed') {
         setShowDatePicker(false);
         return;
      }
      if (selectedDate) {
         setBirthDate(dayjs(selectedDate));
      }
      setShowDatePicker(false);
   };

   const isFormValid = (): boolean => {
      return (
         dni.length === 8 &&
         weight !== '' &&
         Number(weight) > 0 &&
         hbObserved !== '' &&
         Number(hbObserved) > 0 &&
         isValidLocation()
      );
   };

   const handleSubmit = async () => {
      if (!isFormValid()) {
         Alert.alert('Error', 'Por favor complete todos los campos correctamente');
         return;
      }

      try {
         console.log('Enviando ubicación:', {
            department: location.department,
            province: location.province,
            district: location.district,
            town: location.town,
            adjustHB: location.adjustHB
         });

         // Primero resolver ubicaciones a IDs
         const locationIds = await locationsApi.resolveLocationIds(
            location.department,
            location.province,
            location.district,
            location.town,
            location.adjustHB
         );

         console.log('IDs recibidos:', locationIds);

         // Mapear tipos a formato backend
         const backendTypes = mapExistingToBackend({
            gender,
            femaleAditional,
            gestationTime,
         });

         // Calcular hemoglobina ajustada y severidad
         const calculations = calculate({
            hbObserved: Number(hbObserved),
            altitudeAdjustment: location.adjustHB,
            birthDate: birthDate.format('YYYY-MM-DD'),
            gender: backendTypes.gender,
            femaleAdditional: backendTypes.femaleAdditional,
            gestationTrimester: backendTypes.gestationTrimester,
         });

         // Construir DTO para backend
         const createDto: CreatePatientDto = {
            dni,
            birthDate: birthDate.format('YYYY-MM-DD'),
            gender: backendTypes.gender,
            departmentId: locationIds.departmentId,
            provinceId: locationIds.provinceId,
            districtId: locationIds.districtId,
            townId: locationIds.townId,
            firstVisit: {
               visitDate: dayjs().format('YYYY-MM-DD'),
               weight: Number(weight),
               hbObserved: Number(hbObserved),
               hbAdjusted: calculations.hbAdjusted,
               anemiaSeverity: calculations.anemiaSeverity,
               femaleAdditional: backendTypes.femaleAdditional,
               gestationTrimester: backendTypes.gestationTrimester,
            },
         };

         console.log('DTO a enviar:', createDto);

         createMutation.mutate(createDto);
      } catch (error: any) {
         console.error('Error completo:', error);
         console.error('Error response:', error.response?.data);
         const errorMsg = error.response?.data?.message || error.message || 'Error al procesar ubicación';
         Alert.alert('Error', Array.isArray(errorMsg) ? errorMsg.join('\n') : errorMsg);
      }
   };

   return (
      <ScrollView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
               <Ionicons name="arrow-back" size={24} color="#2196F3" />
            </TouchableOpacity>
            <Text style={styles.title}>Nuevo Paciente</Text>
         </View>

         <View style={styles.card}>
            <Text style={styles.sectionTitle}>Datos del Paciente</Text>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>DNI *</Text>
               <TextField
                  style={styles.textInput}
                  value={dni}
                  onChangeText={setDni}
                  keyboardType="numeric"
                  maxLength={8}
                  placeholder="12345678"
                  placeholderTextColor="#A0AEC0"
               />
            </View>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>Fecha de Nacimiento *</Text>
               <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.datePickerButton}
               >
                  <TextField
                     style={styles.textInput}
                     editable={false}
                     value={birthDate.format('DD [de] MMMM [de] YYYY')}
                     pointerEvents="none"
                     placeholderTextColor="#2D3748"
                  />
               </TouchableOpacity>
               {showDatePicker && (
                  <DateTimePicker
                     mode="date"
                     display={Platform.OS === 'ios' ? 'compact' : 'calendar'}
                     value={birthDate.toDate()}
                     maximumDate={new Date()}
                     onChange={handleDateChange}
                  />
               )}
            </View>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>Género *</Text>
               <RadioGroup initialValue={gender} onValueChange={setGender}>
                  <View style={styles.radioRow}>
                     <RadioButton value="M" label="Masculino" color={Colors.primary} />
                     <RadioButton value="F" label="Femenino" color={Colors.primary} />
                  </View>
               </RadioGroup>
            </View>

            {gender === 'F' && (
               <>
                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>Condición Adicional</Text>
                     <RadioGroup initialValue={femaleAditional} onValueChange={setFemaleAditional}>
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
         </View>

         <View style={styles.card}>
            <Text style={styles.sectionTitle}>Primera Visita</Text>

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
         </View>

         <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ubicación del Paciente *</Text>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>Departamento</Text>
               <Picker
                  showSearch
                  preset="outline"
                  placeholder="Selecciona Departamento"
                  items={departmentItems}
                  value={location.department}
                  onChange={onLocationChange('department')}
               />
            </View>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>Provincia</Text>
               <Picker
                  showSearch
                  preset="outline"
                  placeholder="Selecciona Provincia"
                  editable={location.department !== ''}
                  items={provinceItems}
                  value={location.province}
                  onChange={onLocationChange('province')}
               />
            </View>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>Distrito</Text>
               <Picker
                  showSearch
                  preset="outline"
                  placeholder="Selecciona Distrito"
                  editable={location.province !== ''}
                  items={districtItems}
                  value={location.district}
                  onChange={onLocationChange('district')}
               />
            </View>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>Centro Poblado</Text>
               <Picker
                  showSearch
                  preset="outline"
                  placeholder="Selecciona Centro Poblado"
                  editable={location.district !== ''}
                  items={townItems}
                  value={location.town}
                  onChange={onLocationChange('town')}
               />
            </View>

            {location.adjustHB > 0 && (
               <View style={styles.adjustmentInfo}>
                  <Ionicons name="information-circle" size={20} color="#2196F3" />
                  <Text style={styles.adjustmentText}>
                     Ajuste por altitud: {location.adjustHB.toFixed(2)} g/dL
                  </Text>
               </View>
            )}
         </View>

         <View style={styles.buttonContainer}>
            <Button
               label="Crear Paciente"
               onPress={handleSubmit}
               disabled={!isFormValid() || createMutation.isPending}
               backgroundColor={Colors.primary}
               style={styles.submitButton}
               labelStyle={styles.submitButtonLabel}
            />
         </View>
      </ScrollView >
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
   datePickerButton: {
      width: '100%',
   },
   radioRow: {
      flexDirection: 'row',
      gap: 24,
   },
   radioColumn: {
      gap: 12,
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
});
