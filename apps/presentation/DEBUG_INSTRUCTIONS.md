# Debug Instructions - Diagnóstico "Sin Anemia" en UI

## Problema Reportado
Paciente nacido en noviembre con HB ajustada de 3.20 g/dL sale como "Sin Anemia" en la interfaz móvil.

## Console Logs Agregados

He agregado logs de debug en dos archivos clave para rastrear el flujo de datos:

### 1. `apps/presentation/app/(home)/patients/create.tsx`
- 🔍 Muestra los parámetros enviados al cálculo
- ✅ Muestra el resultado del cálculo

### 2. `apps/presentation/hooks/useHemoglobinCalculations.ts`
- 📊 Muestra paso a paso todo el proceso de cálculo
- Incluye HB ajustada, mapeo de parámetros y resultado final

## Cómo Probar

1. **Abre la aplicación móvil:**
   ```bash
   cd apps/presentation
   npx expo start
   ```

2. **Abre React Native Debugger o Metro logs**

3. **Crea un nuevo paciente con estos datos:**
   - DNI: 12345678
   - Fecha de nacimiento: Noviembre 2025 (ejemplo: 15/11/2025)
   - Peso: 5 kg
   - HB Observada: 3.20 g/dL
   - Ubicación: Cualquiera (el ajuste de altitud afectará el valor final)

4. **Busca en los logs:**
   ```
   🔍 [CREATE] Calculating diagnosis with:
   📊 [HOOK] Starting calculation with params:
   📊 [HOOK] HB Adjusted:
   📊 [HOOK] Calling calculateDiagnostic with:
   📊 [HOOK] Diagnostic string:
   📊 [HOOK] Final severity:
   ✅ [CREATE] Diagnosis result:
   ```

## Qué Revisar en los Logs

### Valores Esperados:
- **Edad:** ~30-45 días (noviembre a diciembre)
- **HB Observada:** 3.20
- **Ajuste Altitud:** Depende de la ubicación (0 - 4.0)
- **HB Ajustada:** 3.20 - ajuste (probablemente 1.8-3.20)
- **Diagnóstico esperado:** "Anemia Severa" o "Anemia"
- **Severity esperada:** SEVERE o MILD/MODERATE (nunca NONE)

### Posibles Causas del Bug:

1. **`location.adjustHB` es 0:**
   - Verificar si se seleccionó la ubicación correctamente
   - Verificar el valor en el log: `altitudeAdjustment: ?`

2. **Parámetros no llegan correctamente:**
   - Verificar valores en `🔍 [CREATE] Calculating diagnosis with:`
   - Todos los valores deben ser números/enums válidos

3. **La función `calculateDiagnostic` retorna undefined:**
   - Verificar el log `📊 [HOOK] Diagnostic string:`
   - No debe ser `undefined` ni `null`

4. **El mapeo a severity falla:**
   - Verificar el log `📊 [HOOK] Final severity:`
   - Si es `NONE`, hay un problema en el mapeo

## Fixes Aplicados

### 1. Dependencias de useMemo
**Antes:**
```typescript
}, [weight, hbObserved, birthDate, location.adjustHB, gender, femaleAditional, gestationTime]);
```

**Después:**
```typescript
}, [weight, hbObserved, birthDate, location.adjustHB, gender, femaleAditional, gestationTime, calculate, mapExistingToBackend]);
```

Se agregaron `calculate` y `mapExistingToBackend` a las dependencias para asegurar que use las versiones más recientes.

## Próximos Pasos

1. **Ejecuta la app y crea un paciente de prueba**
2. **Copia los logs de la consola**
3. **Compártelos para análisis**

Basado en los logs, podré identificar exactamente dónde se pierde el valor correcto del diagnóstico.

## Posibles Soluciones Según el Log

### Si `location.adjustHB` es 0:
- Problema: Usuario no seleccionó ubicación
- Fix: Validar que se seleccione ubicación completa

### Si `calculateDiagnostic` retorna undefined:
- Problema: La fecha de nacimiento no coincide con ninguna regla
- Fix: Revisar las reglas en patientDiagnostic.service.ts

### Si severity es NONE pero diagnostic tiene valor:
- Problema: El mapeo de texto a enum falla
- Fix: Revisar la función `mapDiagnosticToSeverity`
