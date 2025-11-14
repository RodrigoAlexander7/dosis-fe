/*
a _layout -> contains shared UI in all the child routes  
*/
import { Stack } from "expo-router";
// the layout inside app contains the RootLayout (the entry point)
export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="credits" options={{ headerTitle: 'Creditos' }} />
      <Stack.Screen name="legal" options={{ headerTitle: 'Aviso Legal' }} />
    </Stack>
  );
}
