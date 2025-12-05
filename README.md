# DosisFe 🩸

> Sistema integral para el diagnóstico, tratamiento y seguimiento de la anemia.

## 📱 Descripción

**DosisFe** es una solución tecnológica completa diseñada para asistir a profesionales de la salud en el diagnóstico y tratamiento de la anemia. La plataforma combina una aplicación móvil intuitiva con un potente backend para gestionar pacientes, calcular dosis de suplementos de hierro y realizar seguimiento de tratamientos.

El sistema permite:
* Diagnóstico inmediato de anemia ajustado por altitud y condiciones del paciente.
* Cálculo preciso de dosis de suplementos (Hierro Polimaltosado, Sulfato Ferroso, etc.).
* Gestión de historias clínicas y visitas.
* Autenticación segura para profesionales de la salud.

## 🚀 Tecnologías

### Frontend (Móvil)
<div align="left">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query" />
</div>

### Backend (API)
<div align="left">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white" alt="Passport" />
</div>

## ✨ Funcionalidades Completadas

### 🔐 Seguridad y Acceso
* **Autenticación Robusta**: Implementación de **Passport** con estrategias JWT para proteger los datos sensibles.
* **Roles y Permisos**: Gestión de acceso para diferentes tipos de usuarios (Administradores, Personal de Salud).

### 👥 Gestión de Pacientes
* **Expediente Digital**: Registro completo de pacientes incluyendo DNI, fecha de nacimiento, género y ubicación.
* **Historial Clínico**: Visualización cronológica de visitas, diagnósticos y tratamientos previos.
* **Búsqueda Avanzada**: Localización rápida de pacientes por DNI.

### 🩺 Diagnóstico y Tratamiento Inteligente
* **Calculadora de Anemia**: 
  * Diagnóstico automático basado en niveles de hemoglobina.
  * **Ajuste por Altitud**: Integración con base de datos de factores de ajuste por distrito y centro poblado.
* **Calculadora de Dosis**: 
  * Algoritmo preciso para determinar la dosis de hierro elemental.
  * Soporte para múltiples tipos de suplementos (Gotas, Jarabe, Tabletas).
  * Consideración de peso, edad y condiciones especiales (Gestación, Puerperio).
* **Prescripciones**: Generación automática de indicaciones de tratamiento y duración.

## 🛠️ Instalación y Despliegue

### Prerrequisitos
* Node.js (v18+)
* PostgreSQL
* PNPM (recomendado) o NPM

### 1. Configuración del Backend

```bash
cd apps/backend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos y secretos JWT

# Inicializar base de datos
npx prisma generate
npx prisma migrate deploy

# Iniciar servidor de desarrollo
pnpm start:dev
```

### 2. Configuración del Frontend

```bash
cd apps/presentation

# Instalar dependencias
pnpm install

# Iniciar con Expo
npx expo start
```

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura moderna de monorepo:

* `apps/backend`: API RESTful construida con **NestJS**, siguiendo principios de arquitectura limpia y modular.
* `apps/presentation`: Aplicación móvil construida con **Expo**, optimizada para Android e iOS.
* `DB`: Scripts de inicialización y esquemas de base de datos.
* `utils`: Herramientas de procesamiento de datos y scripts de utilidad.

## 🤝 Contribución

Las contribuciones son bienvenidas para seguir mejorando esta herramienta vital para la salud pública.

---
© 2025 DosisFe. Todos los derechos reservados.
