# 🔐 Configuración de Autenticación - Frontend Mobile

## 📦 Dependencias Instaladas

```bash
npm install axios @tanstack/react-query zustand expo-auth-session expo-web-browser
```

## 🏗️ Estructura Implementada

```
presentatation/
├── stores/
│   └── authStore.ts              # Store de Zustand con persistencia segura
├── services/
│   ├── apiClient.ts              # Cliente Axios con interceptores
│   └── authService.ts            # Servicio de autenticación OAuth
├── config/
│   └── queryClient.ts            # Configuración React Query
├── components/
│   └── UserProfile.tsx           # Componente de perfil de usuario
├── app/
│   ├── _layout.tsx               # Layout principal con protección de rutas
│   ├── login.tsx                 # Pantalla de login
│   └── auth/
│       ├── callback.tsx          # Callback OAuth
│       └── error.tsx             # Pantalla de error
└── .env.example                  # Variables de entorno
```

## ⚙️ Configuración

### 1. Crear archivo `.env`

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

### 2. Configurar variables de entorno

Edita el archivo `.env`:

```env
EXPO_PUBLIC_API_URL="http://https://h-calculator.onrender.com"
EXPO_PUBLIC_GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
EXPO_PUBLIC_APP_SCHEME="ironsuplementcalculator"
```

**Importante:**
- `EXPO_PUBLIC_API_URL`: URL de tu backend (cambia según tu configuración)
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID`: El mismo Client ID de Google Cloud Console
- `EXPO_PUBLIC_APP_SCHEME`: Esquema de deep linking (debe coincidir con `app.json`)

### 3. Verificar `app.json`

Asegúrate de que el `scheme` en `app.json` coincida:

```json
{
  "expo": {
    "scheme": "ironsuplementcalculator"
  }
}
```

## 🚀 Características Implementadas

### ✅ Autenticación OAuth con Google
- Flujo completo de login con Google
- Apertura de navegador externo para autenticación
- Callback automático con token JWT

### ✅ Gestión de Estado con Zustand
- Store persistente usando SecureStore
- Almacenamiento seguro de tokens y datos de usuario
- Sincronización automática entre sesiones

### ✅ Cliente HTTP con Axios
- Interceptores para agregar token JWT automáticamente
- Manejo de errores 401 (token expirado)
- Logout automático en caso de token inválido

### ✅ Protección de Rutas
- Rutas protegidas que requieren autenticación
- Redirección automática a login si no está autenticado
- Navegación automática a home después de login exitoso

### ✅ Componentes de UI
- Pantalla de login con botón de Google
- Perfil de usuario con información y rol
- Indicador de rol sin asignar
- Botón de logout con confirmación

## 📱 Flujo de Autenticación

1. **Usuario abre la app**
   - Si no está autenticado → Pantalla de login
   - Si está autenticado → Home

2. **Usuario hace clic en "Iniciar sesión con Google"**
   - Se abre el navegador con la URL de OAuth del backend
   - Usuario inicia sesión en Google
   - Google redirige al backend

3. **Backend procesa la autenticación**
   - Crea/actualiza usuario en la base de datos
   - Genera token JWT
   - Redirige al frontend con token y datos de usuario

4. **Frontend recibe el callback**
   - Guarda token y usuario en SecureStore
   - Navega automáticamente al home

5. **Usuario navega por la app**
   - Todas las peticiones incluyen el token JWT
   - Si el token expira, se desloguea automáticamente

## 🔧 Uso de los Servicios

### AuthService

```typescript
import { authService } from '@/services/authService';

// Login con Google
await authService.loginWithGoogle();

// Logout
await authService.logout();

// Obtener perfil actual
const user = await authService.getCurrentUser();

// Verificar si el token es válido
const isValid = await authService.verifyToken();
```

### AuthStore

```typescript
import { useAuthStore } from '@/stores/authStore';

function MyComponent() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  // Acceder a datos del usuario
  console.log(user?.name, user?.role);

  // Verificar autenticación
  if (isAuthenticated) {
    // Usuario autenticado
  }
}
```

### API Client

```typescript
import apiClient from '@/services/apiClient';

// Todas las peticiones incluyen automáticamente el token
const response = await apiClient.get('/users/me');
const data = await apiClient.post('/patients', patientData);
```

## 🧪 Probar la Autenticación

### En Expo Go (Desarrollo)

1. Inicia el backend:
```bash
cd backend/apps/backend
pnpm run start:dev
```

2. Inicia el frontend:
```bash
cd presentatation
npm start
```

3. Escanea el QR con Expo Go

4. Haz clic en "Iniciar sesión con Google"

### En Emulador/Dispositivo

Para producción o builds standalone, necesitarás:

1. **Android**: Configurar un Android Client ID en Google Cloud Console
2. **iOS**: Configurar un iOS Client ID en Google Cloud Console
3. Actualizar `app.json` con los identificadores correspondientes

## ⚠️ Notas Importantes

### Deep Linking

El deep linking ya está configurado con el scheme `ironsuplementcalculator://`. El backend debe redirigir a:

```
ironsuplementcalculator://auth/callback?token=xxx&user=xxx
```

### Seguridad

- ✅ Tokens almacenados en SecureStore (encriptado)
- ✅ Validación automática de tokens
- ✅ Logout automático si el token expira
- ✅ HTTPS requerido en producción

### Roles

El componente `UserProfile` muestra:
- ✅ Información del usuario (nombre, email, foto)
- ✅ Rol asignado (Doctor/Enfermera)
- ⚠️ Advertencia si el rol aún no está asignado

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Verifica que `EXPO_PUBLIC_API_URL` esté correcta
- Asegúrate de que el backend esté corriendo
- En Android, usa `http://10.0.2.2:3000` para emulador

### "OAuth redirect not working"
- Verifica que el `scheme` coincida entre `app.json` y backend
- Revisa que la URL de callback en Google Cloud Console sea correcta

### "Token expired immediately"
- Verifica que `AUTH_SECRET` sea el mismo en backend
- Revisa que `JWT_EXPIRATION_TIME` esté configurado correctamente

---

✅ **La autenticación está completamente integrada y lista para usar.**
