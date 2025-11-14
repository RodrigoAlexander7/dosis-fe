# Frontend Implementation - Guía de Completación

## ✅ Archivos Creados

### Servicios y Tipos
- ✅ `services/types/patient.types.ts` - Tipos y DTOs de pacientes
- ✅ `services/types/visit.types.ts` - Tipos y DTOs de visitas
- ✅ `services/types/admin.types.ts` - Tipos de administración
- ✅ `services/api/patients.api.ts` - Cliente API de pacientes
- ✅ `services/api/visits.api.ts` - Cliente API de visitas
- ✅ `services/api/admin.api.ts` - Cliente API de admin
- ✅ `stores/authStore.ts` - Actualizado con roles y permisos

### Componentes
- ✅ `components/PatientCard.tsx` - Tarjeta de paciente
- ✅ `components/VisitCard.tsx` - Tarjeta de visita

### Pantallas
- ✅ `app/(home)/patients/index.tsx` - Lista y búsqueda de pacientes
- ✅ `app/(home)/patients/[dni].tsx` - Detalles del paciente

## ⏳ Archivos Pendientes por Crear

### 1. Pantallas de Pacientes
```
app/(home)/patients/create.tsx
```
- Formulario para crear nuevo paciente con primera visita
- Incluye LocationPicker para seleccionar ubicación
- Cálculos de hemoglobina ajustada
- Solo accesible por doctores

### 2. Pantallas de Visitas
```
app/(home)/visits/create.tsx
```
- Formulario para crear nueva visita (Nuevo Caso)
- Búsqueda de paciente por DNI
- Cálculos de hemoglobina
- Accesible por doctores y enfermeras

```
app/(home)/visits/[id].tsx
```
- Detalles de una visita específica
- Opciones de editar/eliminar según permisos
- Información del paciente asociado

```
app/(home)/visits/index.tsx
```
- Lista de visitas con filtros
- Búsqueda por rango de fechas, DNI, severidad

### 3. Panel de Administración
```
app/(home)/admin/index.tsx
```
- Lista de usuarios del sistema
- Asignación de roles (DOCTOR, NURSE, PATIENT)
- Activar/desactivar usuarios
- Solo accesible por administradores

### 4. Componentes Adicionales
```
components/LoadingButton.tsx
```
- Botón con estado de carga
- Usado en formularios

```
components/ErrorMessage.tsx
```
- Mensaje de error reutilizable
- Usado en formularios y validaciones

```
components/ConfirmDialog.tsx
```
- Diálogo de confirmación
- Para acciones destructivas

### 5. Hooks Personalizados
```
hooks/usePatientForm.ts
```
- Lógica de formulario de pacientes
- Validaciones
- Manejo de estado

```
hooks/useVisitForm.ts
```
- Lógica de formulario de visitas
- Cálculos de hemoglobina
- Validaciones

```
hooks/useHemoglobinCalculations.ts
```
- Cálculos de ajuste por altitud
- Determinación de severidad de anemia
- Reutilizable en ambos formularios

## 📋 Pasos para Completar

### Paso 1: Cálculos de Hemoglobina
Crear `hooks/useHemoglobinCalculations.ts`:
```typescript
export const useHemoglobinCalculations = (altitude: number) => {
  // Cálculo del ajuste por altitud
  const getAltitudeAdjustment = () => {
    if (altitude < 1000) return 0;
    if (altitude < 2000) return 0.2;
    if (altitude < 3000) return 0.5;
    if (altitude < 4000) return 0.8;
    return 1.0;
  };

  // Calcular HB ajustada
  const calculateAdjustedHb = (hbObserved: number) => {
    const adjustment = getAltitudeAdjustment();
    return hbObserved - adjustment;
  };

  // Determinar severidad
  const getAnemiaSeverity = (hbAdjusted: number, age: number, gender: string, isPregnant: boolean) => {
    // Lógica según normas médicas peruanas
    // ... implementar según criterios médicos
  };

  return { calculateAdjustedHb, getAnemiaSeverity };
};
```

### Paso 2: Formulario de Nuevo Paciente
En `app/(home)/patients/create.tsx`:
- Usar componentes existentes: PatientForm, LocationPicker
- Integrar cálculos de hemoglobina
- Llamar a `patientsApi.create()`
- Navegar a detalles del paciente creado

### Paso 3: Formulario de Nueva Visita
En `app/(home)/visits/create.tsx`:
- Input para DNI del paciente
- Formulario similar al de primera visita
- Usar `visitsApi.create()`
- Navegar al paciente después de crear

### Paso 4: Panel de Administración
En `app/(home)/admin/index.tsx`:
- Lista de usuarios con `adminApi.getAllUsers()`
- Picker para cambiar roles
- Switch para activar/desactivar
- Solo visible si `canManageUsers(user)`

### Paso 5: Navegación
Actualizar `app/(home)/_layout.tsx` para incluir tabs:
```typescript
<Tabs>
  <Tabs.Screen name="index" options={{ title: "Inicio" }} />
  <Tabs.Screen name="patients" options={{ title: "Pacientes" }} />
  <Tabs.Screen name="visits" options={{ title: "Visitas" }} />
  {canManageUsers(user) && (
    <Tabs.Screen name="admin" options={{ title: "Admin" }} />
  )}
</Tabs>
```

## 🔧 Configuración Necesaria

### 1. Actualizar apiClient.ts
Asegurarse que incluye interceptor para token:
```typescript
apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. Variables de Entorno
En `.env` o configuración:
```
API_URL=http://localhost:3001/api
```

## 🧪 Testing
Una vez completado:
1. Probar flujo completo de creación de paciente
2. Probar creación de visitas
3. Verificar permisos (doctor vs enfermera)
4. Probar panel de administración
5. Verificar cálculos de hemoglobina

## 📝 Notas Importantes

1. **Cálculos Frontend**: Los cálculos de `hbAdjusted` y `anemiaSeverity` DEBEN hacerse en el frontend antes de enviar al backend.

2. **Permisos**: Usar siempre los helpers de `authStore`:
   - `canCreatePatient(user)` - Solo doctores
   - `canDeleteRecords(user)` - Solo doctores
   - `isMedicalStaff(user)` - Doctores y enfermeras
   - `canManageUsers(user)` - Solo admins

3. **Validaciones**: 
   - DNI: 8 dígitos numéricos
   - Peso: número positivo
   - Hemoglobina: valores realistas (6-20 g/dL)
   - Fechas: no futuras

4. **UX**: 
   - Mostrar mensajes de éxito/error claros
   - Deshabilitar botones durante operaciones
   - Confirmar acciones destructivas
   - Feedback visual en todas las acciones

## 🚀 Estado Actual

**Backend**: ✅ 100% Completado
**Frontend**: 🟡 40% Completado

Falta:
- Formularios de creación/edición
- Pantallas de visitas
- Panel de administración
- Hooks de cálculos
- Integración final con navegación

## 📞 Próximo Paso

Continuar con la creación de los formularios y hooks de cálculos, que son la parte más crítica del frontend.
