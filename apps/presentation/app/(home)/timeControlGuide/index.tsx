import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Row, Rows, Table } from "react-native-table-component";
import { AppColors } from '@/utils/styles/colors';

export default function ExampleOne() {
   const [tableHead] = useState([
      "Grupo de edad / Condición",
      "Control de hemoglobina",
   ]);

   const [tableData] = useState([
      [
         "Recién nacido con bajo peso al nacer / Prematuro",
         "Manejo hospitalario",
      ],
      [
         "Niño < 6 meses nacido a término con adecuado peso al nacer",
         "Al mes de iniciado tratamiento.\nAl segundo, tercer y sexto mes de iniciado tratamiento",
      ],
      [
         "6 meses a 35 meses",
         "Al mes de iniciado el tratamiento.\nAl tercer y sexto mes del tratamiento",
      ],
      [
         "36 meses a 11 años",
         "Al mes de iniciado el tratamiento.\nAl tercer y sexto mes del tratamiento",
      ],
      [
         "Adolescente, mujer en edad fértil",
         "Al mes de iniciado el tratamiento.\nAl tercer y sexto mes del tratamiento",
      ],
      [
         "Gestante",
         "Cada 4 semanas hasta que la hemoglobina alcance el valor normal",
      ],
   ]);


   return (
      <ScrollView horizontal={true}>
         <View style={styles.container}>
            <Table borderStyle={{ borderWidth: 2, borderColor: AppColors.info }}>
               <Row data={tableHead} style={styles.head} textStyle={styles.text} widthArr={[180, 180]} />
               <Rows data={tableData} textStyle={styles.text} widthArr={[180, 180]} />
            </Table>
         </View>
      </ScrollView>
   );
}


const styles = StyleSheet.create({
   container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: AppColors.background.primary },
   head: { minHeight: 60, backgroundColor: AppColors.background.info },
   textHead: {
      margin: 6,
      textAlign: "center",
      fontWeight: "bold",
      flexWrap: "wrap",
   },
   text: {
      margin: 6,
      textAlign: "center",
      flexWrap: "wrap",
      color: AppColors.text.primary
   },
});