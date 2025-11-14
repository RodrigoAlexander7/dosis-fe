import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function HomeLayout() {

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="heightAdjust/index" options={{ headerShown: true, headerTitle: 'Valores Ajuste por Altura' }} />
        <Stack.Screen name="normalValues/index" options={{ headerShown: true, headerTitle: 'Tabla de Valores Normales' }} />
        <Stack.Screen name="suplementsInfo/index" options={{ headerShown: true, headerTitle: 'Informacion de Suplementos' }} />
        <Stack.Screen name="timeControlGuide/index" options={{ headerShown: true, headerTitle: 'Cronograma de Control de HB' }} />
        {/* Using explicit routes (work with short directions too butt with warnings)  */}
      </Stack>
    </SafeAreaProvider>
  );
}