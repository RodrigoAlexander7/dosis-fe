import { Stack } from "expo-router";

export default function StackLayout() {
   return (
      <Stack screenOptions={{ headerShown: true }}>
         <Stack.Screen
            name="(register)"
            options={{ title: "Volver a Inicio" }}
         />
         <Stack.Screen
            name="(diagnostic)"
            options={{ title: "Volver a Registro" }}
         />
         <Stack.Screen
            name="(treatment)"
            options={{ title: "Voler a Diagnostico" }}
         />
      </Stack>
   );
}
