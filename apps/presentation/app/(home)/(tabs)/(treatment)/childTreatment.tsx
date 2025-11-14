import { SuplementPicker } from "@/modules/suplement/components/suplementPicker";
import { TreatmentButton } from "@/modules/suplement/components/treatmentButton";
import { ScrollView } from "react-native";

export default function ChildTreatmentScreen() {
   return (
      <ScrollView
         contentContainerStyle={{
            flexGrow: 1,
            padding: 5, // espacio general
         }}
         showsVerticalScrollIndicator={true} // barra de scroll
      >
         <SuplementPicker />
         <TreatmentButton />
      </ScrollView>
   );
}