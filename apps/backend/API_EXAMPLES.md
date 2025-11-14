# Ejemplos de Uso de la API

Este archivo contiene ejemplos prácticos de cómo usar cada endpoint de la API del sistema de gestión médica.

## Autenticación

Todos los endpoints requieren autenticación mediante JWT. Primero debes obtener un token:

```bash
# Login con Google OAuth (usar el flujo web existente)
# El token JWT se retorna en la respuesta
```

Luego incluye el token en todas las requests:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints de Pacientes

### 1. Crear Nuevo Paciente con Primera Visita (Doctor)

**Endpoint**: `POST /api/patients`  
**Rol requerido**: DOCTOR

```bash
curl -X POST http://localhost:3001/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "name": "María García López",
    "birthDate": "1985-03-15",
    "gender": "FEMALE",
    "departmentId": "15",
    "provinceId": "1501",
    "districtId": "150101",
    "townId": "15010101",
    "firstVisit": {
      "visitDate": "2024-01-20",
      "weight": 65.5,
      "hbObserved": 12.5,
      "hbAdjusted": 11.8,
      "anemiaSeverity": "MILD",
      "femaleAdditional": "PREGNANT",
      "gestationTrimester": "SECOND"
    }
  }'
```

**Respuesta**:
```json
{
  "id": "uuid-patient-id",
  "dni": "12345678",
  "name": "María García López",
  "birthDate": "1985-03-15T00:00:00.000Z",
  "gender": "FEMALE",
  "isActive": true,
  "createdById": "uuid-doctor-id",
  "department": {
    "id": "15",
    "name": "Lima"
  },
  "visits": [
    {
      "id": 1,
      "visitDate": "2024-01-20T00:00:00.000Z",
      "weight": 65.5,
      "hbObserved": 12.5,
      "hbAdjusted": 11.8,
      "anemiaSeverity": "MILD",
      "femaleAdditional": "PREGNANT",
      "gestationTrimester": "SECOND"
    }
  ]
}
```

### 2. Buscar Pacientes (Doctor/Enfermera)

**Endpoint**: `GET /api/patients/search`  
**Rol requerido**: DOCTOR o NURSE

```bash
# Buscar por DNI
curl -X GET "http://localhost:3001/api/patients/search?dni=12345678" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Buscar por año de nacimiento
curl -X GET "http://localhost:3001/api/patients/search?birthYear=1985&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Buscar pacientes con anemia severa
curl -X GET "http://localhost:3001/api/patients/search?anemiaSeverity=SEVERE" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Buscar con múltiples filtros
curl -X GET "http://localhost:3001/api/patients/search?birthYear=1985&anemiaSeverity=MILD&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
{
  "data": [
    {
      "id": "uuid-patient-id",
      "dni": "12345678",
      "name": "María García López",
      "birthDate": "1985-03-15T00:00:00.000Z",
      "gender": "FEMALE",
      "isActive": true,
      "department": {
        "id": "15",
        "name": "Lima"
      },
      "visits": [...]
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### 3. Obtener Paciente por DNI (Doctor/Enfermera)

**Endpoint**: `GET /api/patients/:dni`  
**Rol requerido**: DOCTOR o NURSE

```bash
curl -X GET http://localhost:3001/api/patients/12345678 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
{
  "id": "uuid-patient-id",
  "dni": "12345678",
  "name": "María García López",
  "birthDate": "1985-03-15T00:00:00.000Z",
  "gender": "FEMALE",
  "isActive": true,
  "createdAt": "2024-01-20T10:30:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z",
  "createdById": "uuid-doctor-id",
  "updatedById": "uuid-doctor-id",
  "department": {
    "id": "15",
    "name": "Lima"
  },
  "province": {
    "id": "1501",
    "name": "Lima"
  },
  "district": {
    "id": "150101",
    "name": "Lima"
  },
  "town": {
    "id": "15010101",
    "name": "Cercado de Lima",
    "altitud": 154
  },
  "visits": [
    {
      "id": 1,
      "visitDate": "2024-01-20T00:00:00.000Z",
      "weight": 65.5,
      "hbObserved": 12.5,
      "hbAdjusted": 11.8,
      "anemiaSeverity": "MILD",
      "createdBy": {
        "id": "uuid-doctor-id",
        "name": "Dr. Juan Pérez",
        "role": "DOCTOR"
      }
    }
  ],
  "createdBy": {
    "id": "uuid-doctor-id",
    "name": "Dr. Juan Pérez",
    "email": "doctor@example.com",
    "role": "DOCTOR"
  }
}
```

### 4. Actualizar Paciente (Doctor)

**Endpoint**: `PATCH /api/patients/:dni`  
**Rol requerido**: DOCTOR

```bash
curl -X PATCH http://localhost:3001/api/patients/12345678 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García de Rodríguez",
    "townId": "15010102"
  }'
```

### 5. Eliminar Paciente (Doctor)

**Endpoint**: `DELETE /api/patients/:dni`  
**Rol requerido**: DOCTOR

```bash
curl -X DELETE http://localhost:3001/api/patients/12345678 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
{
  "message": "Patient deleted successfully"
}
```

### 6. Obtener Estadísticas de Pacientes (Doctor/Enfermera)

**Endpoint**: `GET /api/patients/statistics`  
**Rol requerido**: DOCTOR o NURSE

```bash
curl -X GET http://localhost:3001/api/patients/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
{
  "totalPatients": 234,
  "activePatients": 220,
  "inactivePatients": 14,
  "totalVisits": 1456,
  "byGender": {
    "MALE": 98,
    "FEMALE": 136
  },
  "byAnemiaSeverity": {
    "NONE": 150,
    "MILD": 45,
    "MODERATE": 30,
    "SEVERE": 9
  }
}
```

## Endpoints de Visitas

### 1. Crear Nueva Visita para Paciente Existente (Doctor/Enfermera)

**Endpoint**: `POST /api/visits`  
**Rol requerido**: DOCTOR o NURSE

```bash
curl -X POST http://localhost:3001/api/visits \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientDni": "12345678",
    "visitDate": "2024-03-15",
    "weight": 66.2,
    "hbObserved": 13.1,
    "hbAdjusted": 12.4,
    "anemiaSeverity": "MILD",
    "femaleAdditional": "PREGNANT",
    "gestationTrimester": "THIRD"
  }'
```

**Respuesta**:
```json
{
  "id": 45,
  "patientId": "uuid-patient-id",
  "visitDate": "2024-03-15T00:00:00.000Z",
  "weight": 66.2,
  "hbObserved": 13.1,
  "hbAdjusted": 12.4,
  "anemiaSeverity": "MILD",
  "femaleAdditional": "PREGNANT",
  "gestationTrimester": "THIRD",
  "createdById": "uuid-nurse-id",
  "createdAt": "2024-03-15T14:20:00.000Z"
}
```

### 2. Buscar Visitas (Doctor/Enfermera)

**Endpoint**: `GET /api/visits/search`  
**Rol requerido**: DOCTOR o NURSE

```bash
# Buscar por rango de fechas
curl -X GET "http://localhost:3001/api/visits/search?startDate=2024-01-01&endDate=2024-03-31" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Buscar por DNI de paciente
curl -X GET "http://localhost:3001/api/visits/search?patientDni=12345678" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Buscar por severidad de anemia
curl -X GET "http://localhost:3001/api/visits/search?anemiaSeverity=SEVERE" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Buscar con múltiples filtros
curl -X GET "http://localhost:3001/api/visits/search?startDate=2024-01-01&anemiaSeverity=MODERATE&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
{
  "data": [
    {
      "id": 45,
      "visitDate": "2024-03-15T00:00:00.000Z",
      "weight": 66.2,
      "hbObserved": 13.1,
      "hbAdjusted": 12.4,
      "anemiaSeverity": "MILD",
      "patient": {
        "dni": "12345678",
        "name": "María García López"
      },
      "createdBy": {
        "name": "Enf. Ana Torres",
        "role": "NURSE"
      }
    }
  ],
  "total": 87,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### 3. Obtener Todas las Visitas de un Paciente (Doctor/Enfermera)

**Endpoint**: `GET /api/visits/patient/:dni`  
**Rol requerido**: DOCTOR o NURSE

```bash
curl -X GET http://localhost:3001/api/visits/patient/12345678 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
[
  {
    "id": 1,
    "visitDate": "2024-01-20T00:00:00.000Z",
    "weight": 65.5,
    "hbObserved": 12.5,
    "hbAdjusted": 11.8,
    "anemiaSeverity": "MILD",
    "createdBy": {
      "name": "Dr. Juan Pérez",
      "role": "DOCTOR"
    }
  },
  {
    "id": 45,
    "visitDate": "2024-03-15T00:00:00.000Z",
    "weight": 66.2,
    "hbObserved": 13.1,
    "hbAdjusted": 12.4,
    "anemiaSeverity": "MILD",
    "createdBy": {
      "name": "Enf. Ana Torres",
      "role": "NURSE"
    }
  }
]
```

### 4. Obtener Visita por ID (Doctor/Enfermera)

**Endpoint**: `GET /api/visits/:id`  
**Rol requerido**: DOCTOR o NURSE

```bash
curl -X GET http://localhost:3001/api/visits/45 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Actualizar Visita (Creador o Doctor)

**Endpoint**: `PATCH /api/visits/:id`  
**Rol requerido**: DOCTOR (cualquiera) o NURSE (solo creador)

```bash
curl -X PATCH http://localhost:3001/api/visits/45 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 66.5,
    "hbAdjusted": 12.5,
    "anemiaSeverity": "NONE"
  }'
```

**Nota**: Si una enfermera intenta actualizar una visita que no creó ella, recibirá error 403.

### 6. Eliminar Visita (Doctor)

**Endpoint**: `DELETE /api/visits/:id`  
**Rol requerido**: DOCTOR

```bash
curl -X DELETE http://localhost:3001/api/visits/45 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
{
  "message": "Visit deleted successfully"
}
```

### 7. Obtener Estadísticas de Visitas (Doctor/Enfermera)

**Endpoint**: `GET /api/visits/statistics`  
**Rol requerido**: DOCTOR o NURSE

```bash
curl -X GET http://localhost:3001/api/visits/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
{
  "totalVisits": 1456,
  "bySeverity": {
    "NONE": 800,
    "MILD": 420,
    "MODERATE": 180,
    "SEVERE": 56
  },
  "averageWeight": 67.3,
  "averageHbObserved": 13.2,
  "averageHbAdjusted": 12.8
}
```

## Endpoints de Administración

### 1. Listar Todos los Usuarios (Admin)

**Endpoint**: `GET /api/admin/users`  
**Rol requerido**: ADMIN (email en ADMIN_EMAIL)

```bash
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
[
  {
    "id": "uuid-user-1",
    "email": "doctor@example.com",
    "name": "Dr. Juan Pérez",
    "role": "DOCTOR",
    "isActive": true,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "accounts": [
      {
        "provider": "google",
        "providerAccountId": "google-id-123"
      }
    ]
  },
  {
    "id": "uuid-user-2",
    "email": "nurse@example.com",
    "name": "Enf. Ana Torres",
    "role": "NURSE",
    "isActive": true,
    "createdAt": "2024-01-15T09:30:00.000Z",
    "accounts": [...]
  }
]
```

### 2. Listar Personal Médico Activo (Admin)

**Endpoint**: `GET /api/admin/users/medical-staff`  
**Rol requerido**: ADMIN

```bash
curl -X GET http://localhost:3001/api/admin/users/medical-staff \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta**:
```json
[
  {
    "id": "uuid-user-1",
    "email": "doctor@example.com",
    "name": "Dr. Juan Pérez",
    "role": "DOCTOR",
    "isActive": true
  },
  {
    "id": "uuid-user-2",
    "email": "nurse@example.com",
    "name": "Enf. Ana Torres",
    "role": "NURSE",
    "isActive": true
  }
]
```

### 3. Asignar Rol a Usuario (Admin)

**Endpoint**: `PATCH /api/admin/users/:id/role`  
**Rol requerido**: ADMIN

```bash
# Asignar rol de doctor
curl -X PATCH http://localhost:3001/api/admin/users/uuid-user-3/role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "DOCTOR"
  }'

# Asignar rol de enfermera
curl -X PATCH http://localhost:3001/api/admin/users/uuid-user-4/role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "NURSE"
  }'
```

**Roles disponibles**: `DOCTOR`, `NURSE`, `PATIENT`

**Respuesta**:
```json
{
  "id": "uuid-user-3",
  "email": "newdoctor@example.com",
  "name": "Dr. Carlos Ramírez",
  "role": "DOCTOR",
  "isActive": true,
  "updatedAt": "2024-03-20T15:45:00.000Z"
}
```

### 4. Activar/Desactivar Usuario (Admin)

**Endpoint**: `PATCH /api/admin/users/:id/status`  
**Rol requerido**: ADMIN

```bash
# Desactivar usuario
curl -X PATCH http://localhost:3001/api/admin/users/uuid-user-5/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'

# Reactivar usuario
curl -X PATCH http://localhost:3001/api/admin/users/uuid-user-5/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": true
  }'
```

**Respuesta**:
```json
{
  "id": "uuid-user-5",
  "email": "inactive@example.com",
  "name": "Usuario Inactivo",
  "role": "PATIENT",
  "isActive": false,
  "updatedAt": "2024-03-20T16:00:00.000Z"
}
```

## Códigos de Error Comunes

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "dni must be exactly 8 digits",
    "weight must be a positive number"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden - Only doctors can perform this action"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Patient with DNI 12345678 not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Patient with DNI 12345678 already exists"
}
```

## Notas de Uso

1. **Formato de fechas**: Usar formato ISO 8601 (YYYY-MM-DD) para todas las fechas
2. **Paginación**: Por defecto 20 resultados, máximo 100 por página
3. **Tokens JWT**: Los tokens expiran en 7 días
4. **Roles**: Los roles solo pueden ser asignados por administradores
5. **Eliminación**: La eliminación de pacientes elimina también todas sus visitas asociadas
6. **Auditoría**: Todos los cambios registran quién y cuándo se realizaron

## Testing con Postman

Puedes importar estos ejemplos en Postman siguiendo estos pasos:

1. Crear una colección llamada "H-Calculator API"
2. Crear variable de entorno `{{baseUrl}}` con valor `http://localhost:3001`
3. Crear variable de entorno `{{token}}` con tu JWT
4. Agregar header global: `Authorization: Bearer {{token}}`
5. Importar los endpoints desde este documento

## Swagger UI

Para una documentación interactiva completa, accede a:

```
http://localhost:3001/api
```

(Solo disponible en modo desarrollo)
