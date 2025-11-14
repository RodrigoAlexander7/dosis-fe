import { useLocationData } from '@/modules/location/hooks/useLocationData';
import { getPatientInfo } from '@/modules/patient/services/patient.service';
import { calculateDiagnostic, getPatientData } from '@/modules/patient/services/patientDiagnostic.service';
import { usePatientStore } from '@/modules/patient/store/patientStore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Colors, Picker, TextField } from 'react-native-ui-lib';

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
                  placeholderTextColor="#A0AEC0"
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
                     placeholderTextColor="#A0AEC0"
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
                     placeholderTextColor="#A0AEC0"
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
                     placeholderTextColor="#A0AEC0"
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
                     placeholderTextColor="#A0AEC0"
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
      backgroundColor: '#F4F7FC',
   },
   formContainer: {
      backgroundColor: Colors.white,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
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
      color: '#1a73e8',
      textAlign: 'center',
      marginBottom: 20,
   },
   inputGroup: {
      marginBottom: 20,
   },
   label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2D3748',
      marginBottom: 8,
   },
   textInput: {
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      backgroundColor: '#F7FAFC',
   },
   section: {
      marginBottom: 20,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1a73e8',
      marginBottom: 15,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
   },
   pickerGroup: {
      marginBottom: 15,
   },
   pickerLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#2D3748',
      marginBottom: 6,
   },
   picker: {
      borderRadius: 12,
   },
   pickerField: {
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 12,
      padding: 12,
      backgroundColor: '#F7FAFC',
   },
   submitButton: {
      height: 50,
      borderRadius: 12,
      marginTop: 10,
      marginBottom: 20,
      shadowColor: "#1a73e8",
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
      color: '#2D3748',
      marginBottom: 10,
      textAlign: 'center',
   },
   resultBox: {
      backgroundColor: '#EBF8FF',
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#3182CE',
   },
   diagnosticText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#2C5282',
      marginBottom: 8,
      textAlign: 'center',
   },
   patientInfo: {
      fontSize: 14,
      color: '#4A5568',
      lineHeight: 20,
   },
});