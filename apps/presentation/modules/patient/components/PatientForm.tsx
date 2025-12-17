import { usePatientForm } from '@/modules/patient/hooks/usePatientForm';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { AppColors } from '@/utils/styles/colors';
import 'dayjs/locale/es';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Colors, RadioButton, RadioGroup, TextField } from 'react-native-ui-lib';
import { usePatientStore } from '../store/patientStore';

dayjs.locale('es');

export function PatientForm() {
   const [showPicker, setShowPicker] = useState<boolean>(false);
   const [auxWeight, setAuxWeight] = useState<string>('');

   const {
      idDocument, setIdDocument,
      birthDate, setBirthDate,
      gender, setGender,
      weight, setWeight,
      femaleAditional, setFemaleAditional,
      gestationTime, setGestationTime,
      patient,
      isValid,
   } = usePatientForm();

   const handleDateChange = (event: any, selectedDate?: Date) => {
      if (event?.type === 'dismissed') {
         setShowPicker(false);
         return;
      }
      if (selectedDate) {
         setBirthDate(dayjs(selectedDate));
      }
      setShowPicker(false);
   };

   const handleSubmit = () => {
      if (!isValid()) return;
      usePatientStore.getState().setPatient(patient);
      router.push('/(home)/(tabs)/(diagnostic)/diagnostic');
   }

   return (
      <View style={{ flex: 1, backgroundColor: AppColors.background.secondary }}>
         <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
               Registro de Paciente
            </Text>

            <View style={styles.formContainer}>
               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Peso del paciente (kg)</Text>
                  <TextField
                     style={styles.textInput}
                     onChangeText={(val) => {
                        setAuxWeight(val);
                        setWeight(Number(val))
                     }}
                     value={auxWeight}
                     keyboardType="decimal-pad"
                     placeholder="Ej: 65.5"
                     placeholderTextColor={AppColors.text.placeholder}
                     underlineColorAndroid="transparent"
                  />
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Fecha de nacimiento</Text>
                  <TouchableOpacity
                     onPress={() => setShowPicker(true)}
                     style={styles.datePickerButton}
                  >
                     <TextField
                        style={styles.textInput}
                        editable={false}
                        value={birthDate ? dayjs(birthDate).format('DD [de] MMMM [de] YYYY') : 'Seleccionar fecha'}
                        pointerEvents="none"
                        placeholder="Seleccionar fecha"
                        placeholderTextColor={birthDate ? AppColors.text.primary : AppColors.text.placeholder}
                        underlineColorAndroid="transparent"
                     />
                  </TouchableOpacity>

                  {showPicker &&
                     <DateTimePicker
                        mode="date"
                        display={Platform.OS === 'ios' ? 'compact' : 'calendar'}
                        value={birthDate?.toDate?.() ?? new Date()}
                        maximumDate={new Date()}
                        onChange={handleDateChange}
                        textColor={AppColors.primary}
                     />
                  }
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Seleccione Género</Text>
                  <RadioGroup
                     initialValue={gender}
                     onValueChange={(v: string) => {
                        if (v === 'F') setGender(v);
                        if (v === 'M') {
                           setGender(v);
                           setFemaleAditional(null);
                           setGestationTime(null)
                        }
                     }}
                  >
                     <View style={styles.radioOption}>
                        <RadioButton
                           color={Colors.primary}
                           labelStyle={styles.radioLabel}
                           label="Masculino"
                           value="M"
                        />
                     </View>
                     <View style={styles.radioOption}>
                        <RadioButton
                           color={Colors.primary}
                           labelStyle={styles.radioLabel}
                           label="Femenino"
                           value="F"
                        />
                     </View>
                  </RadioGroup>
               </View>

               <View style={[styles.inputGroup, gender === 'F' ? {} : styles.hidden]}>
                  <Text style={styles.label}>Por favor especifique</Text>
                  <RadioGroup
                     onValueChange={(v: string) => {
                        if (v === 'G' || v === 'P') setFemaleAditional(v);
                        if (v === 'G') setGestationTime('1')   // the default value for gestation time is 1 
                        else if (v === '') setFemaleAditional(null);
                     }}
                     initialValue={femaleAditional || ''}
                  >
                     <View style={styles.radioOption}>
                        <RadioButton
                           color={Colors.primary}
                           labelStyle={styles.radioLabel}
                           label="Sin Adicional"
                           value=""
                        />
                     </View>
                     <View style={styles.radioOption}>
                        <RadioButton
                           color={Colors.primary}
                           labelStyle={styles.radioLabel}
                           label="Gestante"
                           value="G"
                        />
                     </View>
                     <View style={styles.radioOption}>
                        <RadioButton
                           color={Colors.primary}
                           labelStyle={styles.radioLabel}
                           label="Puerpera"
                           value="P"
                        />
                     </View>
                  </RadioGroup>
               </View>

               <View style={[styles.inputGroup, femaleAditional === 'G' ? {} : styles.hidden]} >
                  <Text style={styles.label}>Tiempo de Gestación</Text>
                  <RadioGroup
                     onValueChange={(v: string) => {
                        if (v === '1' || v === '2' || v === '3') setGestationTime(v);
                     }}
                     initialValue={gestationTime || '1'}
                  >
                     <View style={styles.radioOption}>
                        <RadioButton
                           color={Colors.primary}
                           labelStyle={styles.radioLabel}
                           label="1er Trimestre"
                           value="1"
                        />
                     </View>
                     <View style={styles.radioOption}>
                        <RadioButton
                           color={Colors.primary}
                           labelStyle={styles.radioLabel}
                           label="2do Trimestre"
                           value="2"
                        />
                     </View>
                     <View style={styles.radioOption}>
                        <RadioButton
                           color={Colors.primary}
                           labelStyle={styles.radioLabel}
                           label="3er Trimestre"
                           value="3"
                        />
                     </View>
                  </RadioGroup>
               </View>

               <Button
                  label="Registrar"
                  disabled={!isValid()}
                  onPress={handleSubmit}
                  style={[styles.submitButton, !isValid() && styles.disabledButton]}
                  labelStyle={styles.submitButtonLabel}
                  backgroundColor={Colors.primary}
               />
            </View>
         </ScrollView>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: AppColors.background.secondary,
      justifyContent: 'center'
   },
   title: {
      fontSize: 24,
      fontWeight: '700',
      color: AppColors.primary,
      textAlign: 'center',
      marginBottom: 24,
      marginTop: 10,
   },
   formContainer: {
      backgroundColor: AppColors.background.primary,
      borderRadius: 16,
      padding: 20,
      shadowColor: AppColors.shadow,
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
   },
   inputGroup: {
      marginBottom: 20,
   },
   label: {
      fontSize: 16,
      fontWeight: '600',
      color: AppColors.text.primary,
      marginBottom: 8,
   },
   textInput: {
      borderWidth: 1,
      borderColor: AppColors.border.medium,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      backgroundColor: AppColors.background.tertiary,
   },
   datePickerButton: {
      // Estilo ya aplicado a través del textInput
   },
   radioOption: {
      marginVertical: 6,
      padding: 8,
      borderRadius: 8,
      backgroundColor: AppColors.background.tertiary,
   },
   radioLabel: {
      fontSize: 16,
      color: AppColors.text.primary,
   },
   hidden: {
      display: 'none',
   },
   submitButton: {
      height: 50,
      borderRadius: 12,
      marginTop: 10,
      shadowColor: AppColors.primary,
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
   },
   disabledButton: {
      backgroundColor: AppColors.disabled,
   },
   submitButtonLabel: {
      fontSize: 16,
      fontWeight: '600',
   },
});