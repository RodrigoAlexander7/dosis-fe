# Sistema de Colores Centralizado

Este documento explica cómo usar el sistema de colores centralizado de la aplicación H-Calculator.

## 📁 Estructura

```
utils/styles/
├── colors.ts      # Paleta de colores y funciones helper
├── themes.tsx     # Configuración de temas para react-native-ui-lib
├── styles.tsx     # Estilos globales de componentes
└── index.ts       # Export centralizado
```

## 🎨 Uso Básico

### Importar Colores

```typescript
import { AppColors } from "@/utils/styles/colors";

// O importar todo desde el index
import { AppColors, getAnemiaSeverityColor } from "@/utils/styles";
```

### Usar en Componentes

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background.primary,
  },
  title: {
    color: AppColors.text.primary,
  },
  errorText: {
    color: AppColors.error,
  },
});

// En JSX
<View style={{ backgroundColor: AppColors.white }}>
  <Text style={{ color: AppColors.text.secondary }}>Texto</Text>
  <Ionicons name="check" size={24} color={AppColors.success} />
</View>;
```

## 🎯 Colores Semánticos

En lugar de usar valores hex directamente, usa nombres semánticos:

### ✅ Correcto

```typescript
color: AppColors.primary;
color: AppColors.text.secondary;
backgroundColor: AppColors.background.tertiary;
borderColor: AppColors.border.light;
```

### ❌ Incorrecto

```typescript
color: "#2196F3";
color: "#666";
backgroundColor: "#F4F7FC";
borderColor: "#E0E0E0";
```

## 📋 Categorías de Colores

### Colores de Marca

- `AppColors.primary` - Color primario azul
- `AppColors.secondary` - Color secundario
- `AppColors.accent` - Color de acento

### Colores de Estado

- `AppColors.success` - Verde para éxito
- `AppColors.warning` - Naranja para advertencias
- `AppColors.error` - Rojo para errores

### Colores de Texto

- `AppColors.text.primary` - Texto principal (#212121)
- `AppColors.text.secondary` - Texto secundario (#666)
- `AppColors.text.tertiary` - Texto terciario (#999)
- `AppColors.text.placeholder` - Texto de placeholder
- `AppColors.text.inverse` - Texto inverso (blanco)

### Colores de Fondo

- `AppColors.background.primary` - Fondo principal (blanco)
- `AppColors.background.secondary` - Fondo secundario (gris claro)
- `AppColors.background.tertiary` - Fondo terciario
- `AppColors.background.screen` - Fondo de pantalla
- `AppColors.background.input` - Fondo de inputs

### Colores de Borde

- `AppColors.border.light` - Borde claro (#E0E0E0)
- `AppColors.border.medium` - Borde medio
- `AppColors.border.dark` - Borde oscuro

### Colores de Iconos

- `AppColors.icon.primary` - Icono primario
- `AppColors.icon.success` - Icono de éxito
- `AppColors.icon.warning` - Icono de advertencia
- `AppColors.icon.error` - Icono de error

## 🔧 Funciones Helper

### Obtener Color de Severidad de Anemia

```typescript
import { getAnemiaSeverityColor } from "@/utils/styles/colors";

const color = getAnemiaSeverityColor("MILD"); // Retorna '#FFC107'
const color = getAnemiaSeverityColor("SEVERE"); // Retorna '#F44336'
```

### Obtener Color por Rol

```typescript
import { getRoleColor } from "@/utils/styles/colors";

const color = getRoleColor("DOCTOR"); // Retorna color de doctor
const color = getRoleColor(null); // Retorna color por defecto
```

### Agregar Opacidad

```typescript
import { withOpacity } from "@/utils/styles/colors";

const transparentBlue = withOpacity(AppColors.primary, 0.2);
// O directamente en el código:
backgroundColor: AppColors.primary + "20"; // 20 es hex para 12% opacidad
```

## 🔄 Cambiar la Paleta de Colores

Para cambiar los colores en toda la aplicación:

1. Abre `utils/styles/colors.ts`
2. Modifica los valores en `ColorPalette`:

```typescript
export const ColorPalette = {
  blue: {
    500: "#2196F3", // Cambia este valor
    // ...
  },
  // ...
};
```

3. Los cambios se aplicarán automáticamente en toda la app

## 🎨 Colores de Anemia

Los colores para los niveles de anemia están predefinidos:

```typescript
AppColors.anemia.none; // Verde - Sin anemia
AppColors.anemia.mild; // Amarillo - Anemia leve
AppColors.anemia.moderate; // Naranja - Anemia moderada
AppColors.anemia.severe; // Rojo - Anemia severa
```

## 💡 Mejores Prácticas

1. **Siempre usa colores semánticos** en lugar de valores hex
2. **Usa funciones helper** para casos especiales (anemia, roles, etc.)
3. **Mantén consistencia** usando siempre los mismos colores para el mismo propósito
4. **No hardcodees colores** en los componentes
5. **Documenta nuevos colores** si agregas categorías adicionales

## 🔍 Ejemplos Completos

### Tarjeta con Estilos Centralizados

```typescript
import { AppColors } from "@/utils/styles/colors";

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.1,
    borderWidth: 1,
    borderColor: AppColors.border.light,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  errorBox: {
    backgroundColor: AppColors.errorLight,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: AppColors.errorDark,
  },
});
```

### Diagnóstico de Anemia

```typescript
import { getAnemiaSeverityColor } from "@/utils/styles/colors";

<View
  style={[styles.badge, { backgroundColor: getAnemiaSeverityColor(severity) }]}
>
  <Text style={{ color: AppColors.white }}>{getSeverityLabel(severity)}</Text>
</View>;
```

## 🚀 Migración de Código Existente

Si tienes componentes con colores hardcodeados:

### Antes

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F7FC",
  },
  title: {
    color: "#212121",
  },
  icon: {
    color: "#2196F3",
  },
});

<Ionicons name="check" color="#4CAF50" />;
```

### Después

```typescript
import { AppColors } from "@/utils/styles/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background.tertiary,
  },
  title: {
    color: AppColors.text.primary,
  },
  icon: {
    color: AppColors.primary,
  },
});

<Ionicons name="check" color={AppColors.success} />;
```

## 📝 Notas

- Los colores se sincronizan automáticamente con `react-native-ui-lib`
- El modo oscuro usa la misma paleta (puedes personalizarlo en `themes.tsx`)
- Todos los componentes de la librería UI usan estos colores automáticamente
