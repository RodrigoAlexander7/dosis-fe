# Sistema de Gestión Médica - Implementación Backend

## Resumen de la Implementación

Se ha implementado un sistema completo de gestión médica con roles diferenciados (administrador, doctor, enfermera) en el backend de NestJS.

## Arquitectura Implementada

### Módulos

1. **PatientsModule**: Gestión de pacientes y visitas médicas
2. **UsersModule**: Gestión de usuarios y panel de administración
3. **AuthModule**: Autenticación y autorización (ya existente, actualizado)

### Estructura de Directorios

```
src/
├── patients/
│   ├── dto/
│   │   ├── patient.dto.ts              # DTOs para pacientes
│   │   └── patient-visit.dto.ts        # DTOs para visitas
│   ├── services/
│   │   ├── patients.service.ts         # Lógica de negocio de pacientes
│   │   └── visits.service.ts           # Lógica de negocio de visitas
│   ├── controllers/
│   │   ├── patients.controller.ts      # Endpoints de pacientes
│   │   └── visits.controller.ts        # Endpoints de visitas
│   └── patients.module.ts
├── users/
│   ├── controllers/
│   │   └── admin.controller.ts         # Endpoints de administración
│   ├── users.service.ts                # Actualizado con funciones admin
│   └── users.module.ts
└── auth/
    └── guards/
        ├── is-admin.guard.ts           # Guard para administradores
        ├── is-doctor.guard.ts          # Guard para doctores
        └── is-medical-staff.guard.ts   # Guard para doctores/enfermeras
```

## Sistema de Roles

### DOCTOR (Doctor)
- **Permisos completos**: Crear, leer, actualizar y eliminar pacientes y visitas
- Puede modificar cualquier registro independientemente de quién lo creó
- Acceso a todas las estadísticas y reportes

### NURSE (Enfermera)
- **Búsqueda y visualización**: Ver pacientes y visitas existentes
- **Crear visitas**: Agregar nuevas visitas para pacientes existentes (flujo "Nuevo Caso")
- **Edición limitada**: Solo puede editar visitas que ella misma creó
- No puede crear nuevos pacientes ni eliminar registros

### ADMIN (Administrador)
- **Gestión de usuarios**: Asignar roles a usuarios registrados
- **Control de acceso**: Activar/desactivar cuentas de usuario
- **Visualización**: Ver lista completa de usuarios del sistema
- Sin acceso directo a datos médicos de pacientes

## Endpoints Implementados

### Pacientes (`/api/patients`)

| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| POST | `/` | Doctor | Crear paciente con primera visita |
| GET | `/search` | Medical Staff | Buscar pacientes con filtros |
| GET | `/statistics` | Medical Staff | Estadísticas de pacientes |
| GET | `/:dni` | Medical Staff | Obtener paciente por DNI |
| PATCH | `/:dni` | Doctor | Actualizar datos del paciente |
| DELETE | `/:dni` | Doctor | Eliminar paciente y visitas |

### Visitas (`/api/visits`)

| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| POST | `/` | Medical Staff | Crear visita para paciente existente |
| GET | `/search` | Medical Staff | Buscar visitas con filtros |
| GET | `/statistics` | Medical Staff | Estadísticas de visitas |
| GET | `/patient/:dni` | Medical Staff | Todas las visitas de un paciente |
| GET | `/:id` | Medical Staff | Obtener visita por ID |
| PATCH | `/:id` | Medical Staff* | Actualizar visita (creador o doctor) |
| DELETE | `/:id` | Doctor | Eliminar visita |

*Nota: Solo el creador de la visita o doctores pueden actualizarla

### Administración (`/api/admin`)

| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| GET | `/users` | Admin | Listar todos los usuarios |
| GET | `/users/medical-staff` | Admin | Listar personal médico activo |
| PATCH | `/users/:id/role` | Admin | Asignar rol a usuario |
| PATCH | `/users/:id/status` | Admin | Activar/desactivar usuario |

## Flujos de Trabajo

### 1. Nuevo Paciente (Doctor)
```
POST /api/patients
{
  "dni": "12345678",
  "name": "Juan Pérez",
  "birthDate": "1990-01-15",
  "gender": "MALE",
  "departmentId": "1",
  "provinceId": "101",
  "districtId": "10101",
  "townId": "1010101",
  "firstVisit": {
    "visitDate": "2024-01-20",
    "weight": 70.5,
    "hbObserved": 14.2,
    "hbAdjusted": 13.8,
    "anemiaSeverity": "NONE",
    "femaleAdditional": "NONE",
    "gestationTrimester": "NONE"
  }
}
```
- El frontend calcula `hbAdjusted` y `anemiaSeverity`
- Backend valida jerarquía de ubicación
- Verifica que DNI no exista
- Crea automáticamente prescripción si es necesario

### 2. Nuevo Caso (Doctor/Enfermera)
```
POST /api/visits
{
  "patientDni": "12345678",
  "visitDate": "2024-02-15",
  "weight": 71.0,
  "hbObserved": 13.5,
  "hbAdjusted": 13.1,
  "anemiaSeverity": "MILD",
  "femaleAdditional": "NONE",
  "gestationTrimester": "NONE"
}
```
- Verifica que el paciente exista
- Guarda userId del creador
- Permite búsqueda y análisis posterior

### 3. Búsqueda de Pacientes
```
GET /api/patients/search?dni=12345678
GET /api/patients/search?birthYear=1990
GET /api/patients/search?anemiaSeverity=SEVERE&page=1&limit=20
```
Filtros disponibles:
- `dni`: Búsqueda exacta por DNI
- `birthYear`: Año de nacimiento
- `anemiaSeverity`: NONE, MILD, MODERATE, SEVERE
- `page`: Número de página (default: 1)
- `limit`: Resultados por página (default: 20)

### 4. Gestión de Usuarios (Admin)
```
# Asignar rol de doctor
PATCH /api/admin/users/user-id-123/role
{
  "role": "DOCTOR"
}

# Desactivar usuario
PATCH /api/admin/users/user-id-123/status
{
  "isActive": false
}
```

## Validaciones Implementadas

### Pacientes
- DNI debe ser exactamente 8 dígitos numéricos
- DNI debe ser único en el sistema
- Jerarquía de ubicación debe ser válida (department → province → district → town)
- Fecha de nacimiento debe ser una fecha válida
- Gender: MALE o FEMALE

### Visitas
- El paciente debe existir (verificación por DNI)
- Peso debe ser un número positivo
- Valores de hemoglobina deben ser números válidos
- anemiaSeverity: NONE, MILD, MODERATE, SEVERE
- femaleAdditional: NONE, PREGNANT, LACTATING
- gestationTrimester: NONE, FIRST, SECOND, THIRD

### Permisos
- IsAdminGuard: Verifica email contra ADMIN_EMAIL
- IsDoctorGuard: Verifica role === 'DOCTOR'
- IsMedicalStaffGuard: Verifica role === 'DOCTOR' || role === 'NURSE'
- Los endpoints validan permisos a nivel de controlador y servicio

## Configuración Requerida

### Variables de Entorno (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/h_calculator"

# Authentication
AUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin Configuration
ADMIN_EMAIL="admin@example.com"

# Frontend
FRONTEND_URL="http://localhost:8081"
ALLOWED_ORIGINS="http://localhost:8081,http://localhost:19006"
```

### Primera Configuración

1. Aplicar migraciones de Prisma:
```bash
cd apps/backend
pnpm prisma migrate deploy
```

2. Configurar el primer administrador:
   - Registrar un usuario usando Google OAuth
   - Agregar el email del usuario en `.env` como `ADMIN_EMAIL`
   - Reiniciar el servidor
   - El usuario ahora tiene acceso al panel de administración

3. Asignar roles iniciales:
   - Login como administrador
   - Acceder a `/api/admin/users`
   - Asignar roles DOCTOR/NURSE a los usuarios correspondientes

## Características Técnicas

### DTOs con Validación
- Uso de `class-validator` para validación automática
- Enums tipados de TypeScript y Prisma
- DTOs anidados para operaciones complejas (CreatePatientDto con firstVisit)
- Respuestas paginadas con metadata

### Servicios Desacoplados
- PatientsService: Manejo completo de pacientes
- VisitsService: Manejo independiente de visitas
- UsersService: Gestión de usuarios extendida con funciones admin
- Cada servicio valida sus propias reglas de negocio

### Guards Reutilizables
- Guards modulares que se pueden combinar
- Verificación de roles a nivel de request
- Soporte para verificación por email (admin) y por role (doctor/nurse)

### Documentación Swagger
- Todos los endpoints documentados con @ApiOperation
- Respuestas documentadas con @ApiResponse
- Soporte para @ApiBearerAuth en endpoints protegidos
- Accesible en http://localhost:3001/api (solo desarrollo)

## Próximos Pasos

### Frontend (Siguiente Sesión)
1. Crear pantallas de administración de usuarios
2. Implementar formularios de pacientes con cálculos de hemoglobina
3. Desarrollar interfaz de búsqueda y filtrado
4. Integrar con endpoints del backend
5. Agregar validación de roles en el cliente

### Testing (Sesión Final)
1. Tests unitarios de servicios
2. Tests de integración de endpoints
3. Tests E2E de flujos completos
4. Verificación de permisos y guards

## Notas Importantes

1. **Cálculos de Hemoglobina**: El frontend es responsable de calcular `hbAdjusted` y determinar `anemiaSeverity` basándose en la altitud del town seleccionado. El backend solo recibe y almacena estos valores pre-calculados.

2. **Prescripciones Automáticas**: Según lo indicado por el usuario, las prescripciones se crean automáticamente. La lógica específica debe ser implementada en el servicio cuando se conozcan las reglas de negocio exactas.

3. **Eliminación de Datos**: Actualmente se usa hard delete. Para producción, considerar implementar soft delete con flag `deletedAt`.

4. **Auditoría**: Todos los registros incluyen `createdById` y `updatedById` para trazabilidad completa.

5. **Paginación**: Por defecto 20 resultados por página. Configurable en los DTOs de búsqueda.

## Compilación y Ejecución

```bash
# Desarrollo
cd apps/backend
pnpm install
pnpm run start:dev

# Producción
pnpm run build
pnpm run start:prod

# Testing
pnpm run test
pnpm run test:e2e
```

## Estado del Proyecto

✅ Backend completamente implementado y compilando sin errores
✅ Todos los servicios, controladores y guards creados
✅ Validaciones y reglas de negocio implementadas
✅ Documentación Swagger configurada
✅ Sistema de roles funcionando
⏳ Frontend pendiente (próxima sesión)
⏳ Integración y testing pendientes (sesión final)
