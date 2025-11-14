import { getPatientDiagnostic, getPatientInfo } from "@/modules/patient/services/patient.service";
import { usePatientStore } from "@/modules/patient/store/patientStore";
import { getAdultTreatment } from "@/modules/suplement/services/suplement.service";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-ui-lib";

export default function AdultTreatment() {
   const { patient } = usePatientStore();
   const diagnostic = getPatientDiagnostic(patient);
   const treatment = getAdultTreatment(patient);

   return (
      <ScrollView style={styles.contentContainer}>
         <View style={styles.card}>
            {/* Title */}
            <Text style={styles.title}>Tratamiento</Text>

            {/* Patient Info */}
            <View style={styles.section}>
               <Text style={styles.label}>Datos del paciente</Text>
               <Text style={styles.patientInfo}>{getPatientInfo(patient)}</Text>
            </View>

            {/* Diagnostic */}
            <View style={styles.section}>
               <Text style={styles.label}>Diagnóstico de Anemia</Text>
               <Text style={styles.resultText}>{diagnostic}</Text>
            </View>

            {/* Suggested Treatment */}
            <View style={styles.section}>
               <Text style={styles.label}>Tratamiento sugerido</Text>
               <Text style={styles.resultText}>{treatment?.dose[0]?.doseAmount + " " + treatment?.name}</Text>
            </View>

            {/* Button */}
            <Button
               label="Nuevo Paciente"
               size={Button.sizes.large}
               backgroundColor="#1a73e8"
               borderRadius={14}
               style={styles.submitButton}
               labelStyle={styles.submitButtonLabel}
               onPress={() => router.push("/register")}
            />
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   contentContainer: {
      flexGrow: 1,
      backgroundColor: "#F4F7FC",
      padding: 16,
   },
   card: {
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
   },
   title: {
      fontSize: 24,
      fontWeight: "700",
      color: "#1a73e8",
      textAlign: "center",
      marginBottom: 24,
   },
   section: {
      marginBottom: 20,
   },
   label: {
      fontSize: 16,
      fontWeight: "600",
      color: "#2D3748",
      marginBottom: 6,
   },
   patientInfo: {
      fontSize: 14,
      color: "#4A5568",
      lineHeight: 20,
   },
   resultText: {
      fontSize: 15,
      fontWeight: "500",
      color: "#2C5282",
      backgroundColor: "#EBF8FF",
      padding: 12,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#3182CE",
   },
   submitButton: {
      marginTop: 20,
      height: 52,
      justifyContent: "center",
      shadowColor: "#1a73e8",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
   },
   submitButtonLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
   },
});
