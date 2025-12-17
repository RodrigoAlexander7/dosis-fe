import { useLocationData } from '@/modules/location/hooks/useLocationData';
import { getPatientInfo } from '@/modules/patient/services/patient.service';
import { calculateDiagnostic, getPatientData } from '@/modules/patient/services/patientDiagnostic.service';
import { usePatientStore } from '@/modules/patient/store/patientStore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Colors, Picker, TextField } from 'react-native-ui-lib';
import { AppColors } from '@/utils/styles/colors';

export function LocationPicker() {
   const isValid = () => {
      return (hb != '' && isValidLocation())
   }

   const {
      location, setLocation,
      onLocationChange,
      departmentItems,
      provinceItems,
      districtItems,
      townItems,
      isValidLocation,
   } = useLocationData()


   const [hb, setHb] = useState<string>('')

   // global patient data -> we import just the methods or const that we want to use
   const { patient, setPatientLocation,
      setHbFixed, setHbObserved,
      setDiagnostic
   } = usePatientStore()

   const handleSubmit = () => {
      const hbNum = Number(hb);
      const adjustHBNum = parseFloat(String(location.adjustHB).replace(',', '.')) || 0;
      const data = getPatientData(patient)
      const diagnosis = (calculateDiagnostic(
         data.dateBirth,
         data.gender || 'M',
         data.isGestant,
         data.isPuerper,
         data.gestationTime || '0',
         hb,
         location.adjustHB
      ))
      setPatientLocation(location)
      setHbFixed(hbNum)
      setHbObserved(adjustHBNum)
      setDiagnostic(diagnosis || 'No diagnostic data')
   }

   useEffect(() => {
      console.log(JSON.stringify(patient))
   }, [patient])

   return (
      <ScrollView contentContainerStyle={styles.container}>
         <View style={styles.formContainer}>
            <Text style={styles.title}>Datos de Diagnóstico</Text>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>HB Observada (g/dL)</Text>
               <TextField
                  style={styles.textInput}
                  onChangeText={setHb}
                  value={hb}
                  keyboardType="decimal-pad"
                  placeholder="Ej: 12.5"
                  placeholderTextColor={AppColors.text.placeholder}
                  underlineColorAndroid="transparent"
               />
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Ubicación del Paciente</Text>

               <View style={styles.pickerGroup}>
                  <Text style={styles.pickerLabel}>Departamento</Text>
                  <Picker
                     style={styles.picker}
                     showSearch
                     preset='outline'
                     placeholder='Selecciona Departamento'
                     placeholderTextColor={AppColors.text.placeholder}
                     items={departmentItems}
                     value={location.department}
                     onChange={onLocationChange('department')}
                     fieldStyle={styles.pickerField}
                  />
               </View>

               <View style={styles.pickerGroup}>
                  <Text style={styles.pickerLabel}>Provincia</Text>
                  <Picker
                     style={styles.picker}
                     showSearch
                     preset='outline'
                     placeholder='Selecciona Provincia'
                     placeholderTextColor={AppColors.text.placeholder}
                     editable={location.department !== ''}
                     items={provinceItems}
                     value={location.province}
                     onChange={onLocationChange('province')}
                     fieldStyle={styles.pickerField}
                  />
               </View>

               <View style={styles.pickerGroup}>
                  <Text style={styles.pickerLabel}>Distrito</Text>
                  <Picker
                     style={styles.picker}
                     showSearch
                     preset='outline'
                     placeholder='Selecciona Distrito'
                     placeholderTextColor={AppColors.text.placeholder}
                     editable={location.province !== ''}
                     items={districtItems}
                     value={location.district}
                     onChange={onLocationChange('district')}
                     fieldStyle={styles.pickerField}
                  />
               </View>

               <View style={styles.pickerGroup}>
                  <Text style={styles.pickerLabel}>Centro Poblado</Text>
                  <Picker
                     style={styles.picker}
                     showSearch
                     preset='outline'
                     placeholder='Selecciona Centro Poblado'
                     placeholderTextColor={AppColors.text.placeholder}
                     editable={location.district !== ''}
                     items={townItems}
                     value={location.town}
                     onChange={onLocationChange('town')}
                     fieldStyle={styles.pickerField}
                  />
               </View>
            </View>

            <Button
               label="Calcular Diagnóstico"
               onPress={handleSubmit}
               style={styles.submitButton}
               labelStyle={styles.submitButtonLabel}
               backgroundColor={Colors.primary}
               disabled={!isValid()}
            />

            {patient.diagnostic && (
               <View style={styles.resultContainer}>
                  <Text style={styles.resultTitle}>Resultados del Diagnóstico</Text>
                  <View style={styles.resultBox}>
                     <Text style={styles.diagnosticText}>{patient.diagnostic}</Text>
                     <Text style={styles.patientInfo}>{getPatientInfo(patient)}</Text>
                  </View>
               </View>
            )}
         </View>
      </ScrollView>
   )
}

const styles = StyleSheet.create({
   container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: AppColors.background.secondary,
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
   title: {
      fontSize: 22,
      fontWeight: '700',
      color: AppColors.primary,
      textAlign: 'center',
      marginBottom: 20,
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
   section: {
      marginBottom: 20,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: AppColors.primary,
      marginBottom: 15,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: AppColors.border.medium,
   },
   pickerGroup: {
      marginBottom: 15,
   },
   pickerLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: AppColors.text.primary,
      marginBottom: 6,
   },
   picker: {
      borderRadius: 12,
   },
   pickerField: {
      borderWidth: 1,
      borderColor: AppColors.border.medium,
      borderRadius: 12,
      padding: 12,
      backgroundColor: AppColors.background.tertiary,
   },
   submitButton: {
      height: 50,
      borderRadius: 12,
      marginTop: 10,
      marginBottom: 20,
      shadowColor: AppColors.primary,
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
   },
   submitButtonLabel: {
      fontSize: 16,
      fontWeight: '600',
   },
   resultContainer: {
      marginTop: 15,
   },
   resultTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: AppColors.text.primary,
      marginBottom: 10,
      textAlign: 'center',
   },
   resultBox: {
      backgroundColor: AppColors.background.info,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: AppColors.info,
   },
   diagnosticText: {
      fontSize: 16,
      fontWeight: '700',
      color: AppColors.info,
      marginBottom: 8,
      textAlign: 'center',
   },
   patientInfo: {
      fontSize: 14,
      color: AppColors.text.secondary,
      lineHeight: 20,
   },
});