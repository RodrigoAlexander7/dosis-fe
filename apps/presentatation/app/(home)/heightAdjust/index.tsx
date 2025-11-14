import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Row, Rows, Table } from "react-native-table-component";

export default function HeightAdjustTable() {
   const [tableHead] = useState([
      "Rango de elevación (msnm)",
      "Ajuste en Hb (g/dL)",
   ]);

   const [tableData] = useState([
      ["1 - 499", "0"],
      ["500 - 999", "0.4"],
      ["1000 - 1499", "0.8"],
      ["1500 - 1999", "1.1"],
      ["2000 - 2499", "1.4"],
      ["2500 - 2999", "1.8"],
      ["3000 - 3499", "2.1"],
      ["3500 - 3999", "2.5"],
      ["4000 - 4499", "2.9"],
      ["4500 - 4999", "3.3"],
      ["5000 - 5500", "4.0"],
   ]);


   return (
      <ScrollView >
         <View style={styles.container}>
            <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
               <Row data={tableHead} style={styles.head} textStyle={styles.text} />
               <Rows data={tableData} textStyle={styles.text} />
            </Table>
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
   head: { height: 60, backgroundColor: "#f1f8ff" },
   text: { margin: 6, textAlign: "center", color: 'black' },
});
