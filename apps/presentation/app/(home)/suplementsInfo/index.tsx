import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Row, Rows, Table } from "react-native-table-component";
import { AppColors } from '@/utils/styles/colors';

export default function ExampleOne() {
   const [tableHead] = useState([
      "ID",
      "Nombre",
      "Tipo",
      "Presentación",
      "Notas",
      "Hierro Elemental (mg)",
      "Contenido (mL/gotas)",
      "Dosis (edad en días)",
   ]);

   const [tableData] = useState([
      [
         "1",
         "Sulfato Ferroso 75mg/5mL",
         "Sulfato Ferroso",
         "Jarabe",
         "1 ml = 3 mg hierro elemental",
         "3",
         "180",
         "180 - 4015 días → 3 mg",
      ],
      [
         "2",
         "Fer-In-Sol",
         "Sulfato Ferroso",
         "Gotas",
         "Contenido equivalente a 400 gotas",
         "1.25",
         "20",
         "180 - 1095 días → 3 mg",
      ],
      [
         "3",
         "Hierro Polimaltosa",
         "Complejo Polimaltosado",
         "Gotas",
         "20 ml equivalente a 400 gotas",
         "2.5",
         "20",
         "180 - 1095 días → 3 mg",
      ],
      [
         "4",
         "Ferrimax",
         "Complejo Polimaltosado Férrico",
         "Gotas",
         "30 ml equivalente a 600 gotas",
         "2.5",
         "30",
         "180 - 1095 días → 3 mg",
      ],
   ]);


   return (
      <ScrollView horizontal={true}>
         <View style={styles.container}>
            <Table borderStyle={{ borderWidth: 2, borderColor: AppColors.info }}>
               <Row data={tableHead} style={styles.head} textStyle={styles.text} widthArr={[70, 200, 100, 80, 120, 80, 80, 100]} />
               <Rows data={tableData} textStyle={styles.text} widthArr={[70, 200, 100, 80, 120, 80, 80, 100]} />
            </Table>
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: AppColors.background.primary },
   head: { minHeight: 60, backgroundColor: AppColors.background.info },
   text: { margin: 6, textAlign: "center", color: AppColors.text.primary },
});
