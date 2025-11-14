import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors, Picker } from "react-native-ui-lib";
import { suplementImages } from "../constants/suplementImages";
import { useSuplementPicker } from "../hooks/useSuplementPicker";
import { getInfoToString } from "../services/suplement.service";

export function SuplementPicker() {
   const {
      idSuplement, setIdSuplement,
      suplement,
      suplementItems
   } = useSuplementPicker()

   return (
      <ScrollView contentContainerStyle={styles.container}>
         <View style={styles.formContainer}>
            <Text style={styles.title}>Selección de Suplemento</Text>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>Tipo de Sulfato Ferroso</Text>
               <Picker
                  style={styles.picker}
                  preset='outline'
                  placeholder='Seleccionar tipo de suplementación'
                  placeholderTextColor="#A0AEC0"
                  spellCheck={false}
                  showSearch
                  searchPlaceholder="Buscar suplemento..."
                  searchStyle={styles.searchStyle}
                  items={suplementItems}
                  value={idSuplement}
                  onChange={(val) => {
                     if (typeof val === 'string') {
                        setIdSuplement(val)
                        console.log(suplement)
                     }
                  }}
                  fieldStyle={styles.pickerField}
               />
            </View>

            {idSuplement && suplement && (
               <View style={styles.infoContainer}>
                  <Text style={styles.infoTitle}>Información del Suplemento</Text>

                  <Image
                     source={suplementImages[idSuplement]}
                     style={styles.suplementImage}
                     resizeMode="contain"
                  />

                  <View style={styles.infoBox}>
                     <Text style={styles.infoText}>
                        {getInfoToString(suplement)}
                     </Text>
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
   searchStyle: {
      color: '#2D3748',
   },
   infoContainer: {
      marginTop: 15,
      alignItems: "center",
   },
   infoTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#2D3748',
      marginBottom: 10,
      textAlign: 'center',
   },
   suplementImage: {
      width: 120,
      height: 120,
      marginBottom: 16,
      borderRadius: 12, // 🔹 esquinas redondeadas para mejor estética
   },
   infoBox: {
      backgroundColor: '#F0FFF4',
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#38A169',
      width: "100%",
   },
   infoText: {
      fontSize: 14,
      color: '#2F855A',
      lineHeight: 20,
      textAlign: 'center',
   },
});