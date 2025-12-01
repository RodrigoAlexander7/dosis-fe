import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppColors } from '@/utils/styles/colors';

export default function HomeScreen() {
   const blurhash =
      "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

   return (
      <ScrollView>
         <View style={styles.container}>
            <Text style={styles.title}>Descargo de responsabilidad</Text>
            <Text style={styles.subtitle}>
               Esta aplicación está diseñada exclusivamente como herramienta de apoyo para profesionales de la salud. La información, cálculos y recomendaciones que se presentan tienen fines educativos y de referencia, y no sustituyen el juicio clínico, la experiencia profesional ni las guías oficiales vigentes.
               El desarrollador y sus colaboradores no garantizan la exactitud, integridad o actualidad de la información contenida en la aplicación y no se hacen responsables de cualquier daño, pérdida o consecuencia derivada del uso de la misma.
               El usuario reconoce que es plenamente responsable de verificar la información y de tomar las decisiones clínicas correspondientes, así como de cumplir con la normativa y protocolos aplicables en su jurisdicción.
               Si la aplicación se utiliza en el contexto de atención a pacientes, el profesional debe confirmar todos los datos y resultados antes de aplicarlos en la práctica clínica.
            </Text>
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: AppColors.background.secondary,
      alignItems: "center",
      padding: 20,
      textAlign: 'center',
      justifyContent: 'center'
   },
   title: {
      fontSize: 26,
      fontWeight: "700",
      color: AppColors.text.primary,
      marginBottom: 10,
      textAlign: "center",
   },
   subtitle: {
      fontSize: 16,
      color: AppColors.text.secondary,
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 22,
   },
});
