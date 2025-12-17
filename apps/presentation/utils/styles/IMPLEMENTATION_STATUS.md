# 🎨 Sistema de Colores Centralizado - H-Calculator

## ✅ Estado de Implementación

### Archivos Core Completados ✓

- ✅ `utils/styles/colors.ts` - Paleta de colores centralizada
- ✅ `utils/styles/themes.tsx` - Integración con react-native-ui-lib
- ✅ `utils/styles/styles.tsx` - Estilos globales actualizados
- ✅ `utils/styles/index.ts` - Export centralizado
- ✅ `utils/styles/README.md` - Documentación completa
- ✅ `utils/styles/MIGRATION_GUIDE.ts` - Guía de migración
- ✅ `scripts/find-hardcoded-colors.js` - Script de detección

### Componentes Actualizados ✓

- ✅ `app/(home)/visits/create.tsx` - Formulario de visitas (3 colores restantes)
- ✅ `components/PatientCard.tsx` - Tarjeta de paciente (totalmente migrado)
- ⚠️ `components/VisitCard.tsx` - Tarjeta de visita (18 colores pendientes)

### 📊 Estado Actual (25 archivos con colores hardcodeados)

**Total: 335 colores hardcodeados pendientes**

Ejecuta `node apps/presentation/scripts/find-hardcoded-colors.js` para ver el reporte actualizado.

#### 🔴 Alta Prioridad (más de 20 colores)

- `app/(home)/visits/[id].tsx` - 54 colores
- `app/(home)/admin/index.tsx` - 39 colores
- `app/(home)/patients/[dni].tsx` - 30 colores
- `app/(home)/patients/index.tsx` - 24 colores
- `app/(home)/visits/index.tsx` - 22 colores
- `modules/location/components/LocationPicker.tsx` - 22 colores

#### 🟡 Media Prioridad (10-20 colores)

- `app/(home)/patients/create.tsx` - 18 colores
- `components/VisitCard.tsx` - 18 colores
- `components/UserProfile.tsx` - 16 colores
- `modules/patient/components/PatientForm.tsx` - 15 colores
- `app/login.tsx` - 13 colores
- `app/(home)/(tabs)/(treatment)/adultTreatment.tsx` - 12 colores
- `app/(home)/index.tsx` - 12 colores
- `modules/suplement/components/suplementPicker.tsx` - 12 colores

#### 🟢 Baja Prioridad (menos de 10 colores)

- `app/(home)/(aditionals)/credits.tsx` - 9 colores
- `modules/suplement/components/treatmentButton.tsx` - 8 colores
- `app/auth/error.tsx` - 6 colores
- `app/(home)/(aditionals)/legal.tsx` - 3 colores
- Varios archivos con 3 colores o menos (tablas de referencia)

## 🚀 Cómo Usar

### 1. En Nuevos Componentes

```typescript
import { AppColors, getAnemiaSeverityColor } from "@/utils/styles/colors";

const MyComponent = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Título</Text>
    <Ionicons name="check" color={AppColors.success} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background.primary,
    borderColor: AppColors.border.light,
  },
  title: {
    color: AppColors.text.primary,
  },
});
```

### 2. Migrar Componentes Existentes

#### Paso 1: Agregar Import

```typescript
import { AppColors, getAnemiaSeverityColor } from "@/utils/styles/colors";
```

#### Paso 2: Reemplazar Funciones Locales

```typescript
// ANTES
const getSeverityColor = (severity) => {
  switch (severity) {
    case "NONE":
      return "#4CAF50";
    // ...
  }
};

// DESPUÉS - Eliminar función y usar:
getAnemiaSeverityColor(severity);
```

#### Paso 3: Actualizar Colores en JSX

```typescript
// ANTES
<Ionicons name="check" color="#4CAF50" />

// DESPUÉS
<Ionicons name="check" color={AppColors.success} />
```

#### Paso 4: Actualizar StyleSheet

```typescript
// ANTES
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F7FC",
    borderColor: "#E0E0E0",
  },
  text: {
    color: "#212121",
  },
});

// DESPUÉS
const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background.tertiary,
    borderColor: AppColors.border.light,
  },
  text: {
    color: AppColors.text.primary,
  },
});
```

## 📊 Mapeo de Colores

### Colores Más Comunes

| Hex                | AppColors                       | Uso                                        |
| ------------------ | ------------------------------- | ------------------------------------------ |
| `#2196F3`          | `AppColors.primary`             | Color principal, links, acciones primarias |
| `#4CAF50`          | `AppColors.success`             | Éxito, confirmaciones                      |
| `#F44336`          | `AppColors.error`               | Errores, alertas críticas                  |
| `#FF9800`          | `AppColors.warning`             | Advertencias                               |
| `#212121`          | `AppColors.text.primary`        | Texto principal                            |
| `#666` / `#666666` | `AppColors.text.secondary`      | Texto secundario, íconos                   |
| `#999`             | `AppColors.text.tertiary`       | Texto terciario                            |
| `#fff` / `#FFFFFF` | `AppColors.white`               | Fondos blancos                             |
| `#F4F7FC`          | `AppColors.background.tertiary` | Fondo de pantallas                         |
| `#E0E0E0`          | `AppColors.border.light`        | Bordes                                     |
| `#000`             | `AppColors.shadow`              | Sombras                                    |

### Anemia Severity Colors

| Severity | Hex       | AppColors                   | Helper                               |
| -------- | --------- | --------------------------- | ------------------------------------ |
| NONE     | `#4CAF50` | `AppColors.anemia.none`     | `getAnemiaSeverityColor('NONE')`     |
| MILD     | `#FFC107` | `AppColors.anemia.mild`     | `getAnemiaSeverityColor('MILD')`     |
| MODERATE | `#FF9800` | `AppColors.anemia.moderate` | `getAnemiaSeverityColor('MODERATE')` |
| SEVERE   | `#F44336` | `AppColors.anemia.severe`   | `getAnemiaSeverityColor('SEVERE')`   |

## 🔧 Herramientas

### Script de Detección

Ejecuta este script para encontrar archivos con colores hardcodeados:

```bash
# Desde la raíz del proyecto (W:\PROFESIONAL\H-Calculator)
node apps/presentation/scripts/find-hardcoded-colors.js

# O si estás en apps/presentation
node scripts/find-hardcoded-colors.js
```

**Resultado actual: 25 archivos con 335 colores hardcodeados**

### Buscar y Reemplazar en VSCode

1. Abrir búsqueda global: `Ctrl+Shift+F` (Windows) o `Cmd+Shift+F` (Mac)
2. Habilitar regex: Click en `.*` en la barra de búsqueda
3. Buscar: `color[=:]\s*["']#[0-9A-Fa-f]{6}["']`
4. Revisar cada ocurrencia y reemplazar con `AppColors.*`

### Patrones de Búsqueda Útiles

```regex
# Buscar colores en props de componentes
color="#[0-9A-Fa-f]{6}"

# Buscar colores en StyleSheet
color:\s*['"]#[0-9A-Fa-f]{6}['"]

# Buscar backgroundColor
backgroundColor:\s*['"]#[0-9A-Fa-f]{6}['"]

# Buscar borderColor
borderColor:\s*['"]#[0-9A-Fa-f]{6}['"]
```

## 🎯 Beneficios

✅ **Mantenibilidad**: Cambiar un color en un solo lugar actualiza toda la app
✅ **Consistencia**: Mismos colores en todos los componentes
✅ **Semántica**: Nombres descriptivos en lugar de hex codes
✅ **Temas**: Fácil implementar modo oscuro en el futuro
✅ **Escalabilidad**: Agregar variantes sin cambiar componentes
✅ **TypeScript**: Autocompletado y validación de tipos

## 📝 Cambiar la Paleta Global

Para cambiar el esquema de colores de toda la aplicación:

1. Editar `utils/styles/colors.ts`
2. Modificar valores en `ColorPalette`:
   ```typescript
   export const ColorPalette = {
     blue: {
       500: "#TU_NUEVO_COLOR", // Cambia aquí
     },
   };
   ```
3. Los cambios se reflejan automáticamente en toda la app

## 🔄 Próximos Pasos

1. [ ] Migrar componentes de alta prioridad
2. [ ] Ejecutar script de detección
3. [ ] Revisar componentes con más de 10 colores hardcodeados
4. [ ] Agregar tests para verificar que no hay hex en JSX
5. [ ] Considerar implementar modo oscuro usando la misma base

## 💡 Tips

- Usa `AppColors.text.secondary` en lugar de `#666` para íconos y texto secundario
- Para sombras siempre usa `AppColors.shadow`
- Los colores de anemia tienen su propia función helper
- Si necesitas un color con opacidad: `AppColors.primary + '20'` (20 en hex = ~12% opacidad)
- Mantén `getSeverityLabel` pero elimina `getSeverityColor` (usa el helper importado)

## 📚 Referencias

- [README.md](./README.md) - Documentación detallada
- [MIGRATION_GUIDE.ts](./MIGRATION_GUIDE.ts) - Mapeos de colores
- [colors.ts](./colors.ts) - Archivo fuente de colores
- [React Native Colors](https://reactnative.dev/docs/colors)
