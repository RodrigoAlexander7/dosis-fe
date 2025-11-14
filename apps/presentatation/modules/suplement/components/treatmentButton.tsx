import { usePatientStore } from "@/modules/patient/store/patientStore";
import { getBottleNumber, getDose, getUnitMeasure } from "@/modules/suplement/services/suplement.service";
import { useSuplementStore } from '@/modules/suplement/store/suplementStore';
import dayjs from "dayjs";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Button, View } from "react-native-ui-lib";

export const TreatmentButton = () => {
   const { suplementStore } = useSuplementStore();
   const { patient } = usePatientStore();
   const ageDays: number = Number(dayjs().diff(dayjs(patient.birthDate), 'day'))
   const [doseNumber, setDoseNumber] = useState<number | null>(null)

   const bottlesNumber = getBottleNumber(doseNumber ? doseNumber : 0, suplementStore)

   const handleSubmit = () => {
      router.push('/register')
   }

   return (
      <View style={styles.container}>
         <Button
            label="Calcular tratamiento"
            size={Button.sizes.large}
            backgroundColor="#1a73e8"
            borderRadius={12}
            onPress={() => {
               setDoseNumber(getDose(suplementStore, ageDays, patient.weight || 0, true))
            }}
         />

         {doseNumber !== null && (
            <View style={styles.resultBox}>
               <Text style={styles.title}>Recomendación de Dosis</Text>

               <Text style={styles.text}>
                  Diario: <Text style={styles.highlight}>{Math.ceil(doseNumber) + " " + getUnitMeasure(suplementStore)}</Text>
               </Text>

               <Text style={styles.text}>
                  Dosis mensual: <Text style={styles.highlight}>{bottlesNumber} frascos</Text>
               </Text>
               <Button
                  label="Nuevo Paciente"
                  size={Button.sizes.large}
                  backgroundColor="#1a73e8"
                  borderRadius={12}
                  onPress={handleSubmit}
               />
            </View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      marginTop: 20,
      padding: 10,
      marginBottom: 25
   },
   resultBox: {
      marginTop: 20,
      backgroundColor: "#F0FFF4",
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#38A169",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   title: {
      fontSize: 18,
      fontWeight: "700",
      color: "#2D3748",
      marginBottom: 12,
      textAlign: "center",
   },
   text: {
      fontSize: 16,
      color: "#2D3748",
      marginBottom: 6,
   },
   highlight: {
      fontWeight: "bold",
      color: "#2F855A",
   },
});