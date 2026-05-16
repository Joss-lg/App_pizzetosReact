# 🛠️ Herramientas Usadas - Pizzetos App

Documento completo de todas las herramientas, librerías y versiones necesarias para ejecutar el proyecto Pizzetos (Frontend React Native + Backend Serverless).

**Última actualización:** 15 de mayo de 2026  
**Versión del proyecto:** 1.0.0

---

## 📋 Tabla de Contenidos
1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Frontend - React Native](#frontend---react-native)
3. [Backend - Serverless API](#backend---serverless-api)
4. [Herramientas de Desarrollo](#herramientas-de-desarrollo)
5. [Servicios Externos](#servicios-externos)
6. [Comandos de Setup](#comandos-de-setup)

---

## 🖥️ Requisitos del Sistema

| Herramienta | Versión Mínima | Versión Recomendada | Descripción |
|-------------|-----------------|-------------------|-------------|
| **Node.js** | `>=20.0.0` | `20.x LTS` | Runtime de JavaScript |
| **npm** | `9.0.0+` | `10.x+` | Package manager para Node |
| **Java JDK** | `11+` | `17 LTS` | Requerido para Android |
| **Android SDK** | API 24 | API 36 | Compilación de APK |
| **Android Build Tools** | 34.0.0 | `36.0.0` | Herramientas de compilación |
| **Android NDK** | 25.x | `27.1.12297006` | Native Development Kit |
| **Gradle** | 7.x | 8.x | Build system Android |
| **Docker** | 20.x | `24.x+` | Contenedorización (opcional, para DynamoDB local) |
| **Git** | 2.x | `2.45+` | Control de versiones |

---

## 🎨 Frontend - React Native (App_pizzetosReact-main)

### Versiones Principales

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| **react** | `19.2.0` | Framework UI |
| **react-native** | `0.83.1` | Framework mobile cross-platform |
| **typescript** | `^5.8.3` | Tipado estático para JavaScript |
| **expo** (implícito) | `~51.x` | Plataforma para desarrollo RN |

### Dependencias de Navegación

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| `@react-navigation/native` | `^7.1.28` | Navegación base |
| `@react-navigation/bottom-tabs` | `^7.10.1` | Navegación por tabs inferior |
| `@react-navigation/native-stack` | `^7.0.0` | Navegación de stack nativo |
| `react-native-screens` | `^4.20.0` | Optimización de pantallas |
| `react-native-safe-area-context` | `^5.6.2` | Manejo de safe areas (notches) |

### Dependencias de Autenticación

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| `@react-native-firebase/app` | `^24.0.0` | Firebase core |
| `@react-native-firebase/auth` | `^24.0.0` | Firebase Authentication |
| `@react-native-google-signin/google-signin` | `^12.0.0` | Google Sign-In integration |
| `@react-native-async-storage/async-storage` | `^2.2.0` | Almacenamiento local persistente |

### Dependencias de Red y HTTP

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| `axios` | `^1.16.0` | Cliente HTTP |
| `react-native-config` | `^1.6.1` | Variables de entorno |

### DevDependencies - Frontend

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| `@babel/core` | `^7.25.2` | Transpilador JavaScript |
| `@babel/preset-env` | `^7.25.3` | Preset de Babel para Node |
| `@babel/runtime` | `^7.25.0` | Runtime de Babel |
| `@react-native/babel-preset` | `0.83.1` | Preset Babel para RN |
| `@react-native/metro-config` | `0.83.1` | Configuración de Metro bundler |
| `@react-native-community/cli` | `20.0.0` | CLI de React Native |
| `@react-native-community/cli-platform-android` | `20.0.0` | Plugin Android para CLI |
| `@react-native-community/cli-platform-ios` | `20.0.0` | Plugin iOS para CLI |
| `@react-native/eslint-config` | `0.83.1` | Configuración de ESLint |
| `@react-native/typescript-config` | `0.83.1` | Configuración de TypeScript |
| `@types/react` | `^19.2.0` | Tipos TypeScript para React |
| `@types/jest` | `^29.5.13` | Tipos para Jest |
| `@types/react-test-renderer` | `^19.1.0` | Tipos para test renderer |
| `eslint` | `^8.19.0` | Linter JavaScript |
| `jest` | `^29.6.3` | Framework de testing |
| `prettier` | `2.8.8` | Code formatter |
| `react-test-renderer` | `19.2.0` | Renderizador para testing |

### Configuración Android (gradle.properties)

| Propiedad | Valor | Descripción |
|-----------|-------|-------------|
| **buildToolsVersion** | `36.0.0` | Versión de Android Build Tools |
| **minSdkVersion** | `24` | Versión mínima Android (7.0) |
| **compileSdkVersion** | `36` | Versión compilación Android |
| **targetSdkVersion** | `36` | Versión objetivo Android |
| **ndkVersion** | `27.1.12297006` | Versión Android NDK |
| **kotlinVersion** | `2.1.20` | Versión de Kotlin |
| **reactNativeArchitectures** | `arm64-v8a,x86_64` | Arquitecturas soportadas |

### Gradle Dependencies - Android

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| `com.android.tools.build:gradle` | (Latest) | Plugin Gradle de Android |
| `com.facebook.react:react-native-gradle-plugin` | (Latest) | Plugin Gradle de RN |
| `org.jetbrains.kotlin:kotlin-gradle-plugin` | `2.1.20` | Plugin Kotlin |
| `com.google.gms:google-services` | `4.4.2` | Plugin Google Services (Firebase) |

### App Config (app.json)

```json
{
  "name": "PizzetosApp",
  "displayName": "PizzetosApp"
}
```

### TypeScript Config

- Extiende: `@react-native/typescript-config`
- Target: ES2020
- Módulo: ES2020
- Strict mode: Activo

---

## 🔌 Backend - Serverless API (backend_p)

### Versiones Principales

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| **Node.js Runtime** | `16.x` | Especificado en serverless.yml |
| **Serverless Framework** | `^3.39.0` | Framework para AWS Lambda |
| **serverless-offline** | `8.8.1` | Emulador local de Serverless |

### Dependencias de Backend

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| `express` | `^5.2.1` | Framework web HTTP |
| `serverless-http` | `^4.0.0` | Adaptador Express a Lambda |
| `firebase-admin` | `^13.8.0` | Admin SDK de Firebase |

### Dependencias de Base de Datos

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| `@aws-sdk/client-dynamodb` | `^3.600.0` | Cliente AWS DynamoDB |
| `@aws-sdk/lib-dynamodb` | `^3.600.0` | Librería de document client DynamoDB |

### Dependencias de Configuración

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| `dotenv` | `^17.4.2` | Carga variables de entorno |

### DevDependencies - Backend

| Dependencia | Versión | Descripción |
|-------------|---------|-------------|
| `serverless` | `^3.39.0` | CLI de Serverless Framework |
| `serverless-offline` | `8.8.1` | Plugin para ejecutar offline |

### Configuración Serverless (serverless.yml)

| Configuración | Valor | Descripción |
|---------------|-------|-------------|
| **Framework Version** | `^3.0.0` | Versión compatible de Serverless |
| **AWS Provider** | `aws` | Proveedor cloud |
| **Runtime** | `nodejs16.x` | Runtime Node.js en Lambda |
| **Stage** | `dev` | Entorno de desarrollo |
| **Region** | `us-east-1` | Región AWS |
| **Module System** | `commonjs` | Sistema de módulos Node |

### Tablas DynamoDB

| Tabla | Configuración |
|-------|---------------|
| **PizzetosOrders** | Partition Key: `customerId` (String) <br> Sort Key: `createdAt` (String) <br> Billing: `PAY_PER_REQUEST` |

---

## 🐳 Infraestructura Local (Docker Compose)

### DynamoDB Local

| Configuración | Valor | Descripción |
|---------------|-------|-------------|
| **Imagen Docker** | `amazon/dynamodb-local:latest` | Contenedor DynamoDB |
| **Versión Base** | Latest | Última versión disponible |
| **Puerto** | `8000` | Mapeo localhost:8000 |
| **Modo** | `-sharedDb -inMemory` | En memoria, base de datos compartida |

---

## 🛠️ Herramientas de Desarrollo

### Build & Development Tools

| Herramienta | Versión | Descripción |
|-------------|---------|-------------|
| **Metro Bundler** | `0.83.1` | Bundler para React Native |
| **Babel** | `7.25.2` | Transpilador ES6+ |
| **ESLint** | `8.19.0` | Linter JavaScript |
| **Prettier** | `2.8.8` | Code formatter |
| **Jest** | `29.6.3` | Testing framework |

### IDE Recomendado

| Herramienta | Versión | Descripción |
|-------------|---------|-------------|
| **Visual Studio Code** | `1.90+` | Editor de código |
| **Android Studio** | `2024.1+` | IDE para desarrollo Android |
| **Xcode** | `15.0+` | IDE para desarrollo iOS (solo macOS) |

### CLI Tools

| Herramienta | Versión | Descripción |
|-------------|---------|-------------|
| **React Native CLI** | `20.0.0` | CLI de RN |
| **Android CLI** | (Latest) | CLI de Android SDK |
| **Gradle Wrapper** | `8.x` | Gradle incluido en proyecto |

---

## 🔐 Servicios Externos

### Firebase

| Servicio | Configuración | Descripción |
|----------|---------------|-------------|
| **Firebase Authentication** | v9+ | Autenticación con Google |
| **Firebase Realtime Database** | (Optional) | Sincronización datos en tiempo real |
| **Google Cloud Project** | `pizzetos-123ef` | Proyecto en Google Cloud |

### Google Cloud / IAM

| Configuración | Descripción |
|---------------|-------------|
| **Service Account** | `firebase-adminsdk-fbsvc@pizzetos-123ef.iam.gserviceaccount.com` |
| **OAuth 2.0 Client ID** | Web client para Google Sign-In |
| **App Signing Key SHA-1** | Fingerprint para Android |

### AWS Services

| Servicio | Configuración |
|----------|---------------|
| **AWS Lambda** | Node.js 16.x runtime |
| **AWS DynamoDB** | On-demand billing |
| **AWS IAM** | Permisos: PutItem, GetItem, Query, UpdateItem, DeleteItem |

### WhatsApp Business API

| Configuración | Descripción |
|---------------|-------------|
| **Integración** | Enlace directo en cliente |
| **Número Teléfono** | Configurable en `CarritoScreen.tsx` |

---

## 📦 Dependencias Opcionales (No Usadas Actualmente)

Si en el futuro necesita integrar:

```
- redux / zustand     → Para state management global avanzado
- react-query        → Para caching de datos
- socket.io          → Para notificaciones en tiempo real
- stripe / mercadopago → Para pagos online
- sentry            → Para error tracking
- bugsnag           → Para crash reporting
```

---

## ⚙️ Comandos de Setup

### Frontend Setup

```bash
# Instalar dependencias
cd App_pizzetosReact-main
npm install

# Levantar Metro bundler
npm start

# Ejecutar en Android (emulador o dispositivo)
npm run android

# Ejecutar en iOS (solo macOS)
npm run ios

# Ejecutar linter
npm run lint

# Ejecutar tests
npm test
```

### Backend Setup

```bash
# Instalar dependencias
cd backend_p
npm install

# Descargar DynamoDB Local
npm run dynamo:install

# Levantar contenedor DynamoDB
npm run dynamo:up

# Crear tabla DynamoDB
npm run dynamo:setup

# Ejecutar API local (serverless offline)
npm run offline

# O todo junto
npm run local

# Deploy a AWS (requiere credenciales)
npm run deploy
```

---

## 🔍 Verificación de Versiones

Ejecutar estos comandos para verificar instalaciones:

```bash
# Node y npm
node --version     # Debe ser >=20.0.0
npm --version      # Debe ser >=9.0.0

# Java
java -version      # Verificar JDK instalado

# Android SDK
sdkmanager --list | grep "build-tools"  # Verificar 36.0.0

# Docker (si usa DynamoDB local)
docker --version

# Git
git --version
```

---

## 📝 Notas Importantes

### ⚠️ Incompatibilidades Conocidas

1. **Serverless v4+**: No compatible con `serverless-offline 8.8.1`. Usar `serverless ^3.39.0`.
2. **Node.js 18**: Requiere `serverless-offline 10+`. Usar Node.js `20 LTS` para estabilidad.
3. **React Native 0.84+**: Cambios mayores en arquitectura. Proyecto bloqueado en `0.83.1`.
4. **Firebase Auth v10+**: Cambios en metodología. Proyecto usa `^24.0.0` (compatible).

### 🔐 Variables de Entorno Requeridas

**Frontend (.env)**
```
GOOGLE_WEB_CLIENT_ID=268906549476-5t0r1jq0f83fnmk41upug4ihofaagesi.apps.googleusercontent.com
API_BASE_URL=http://10.0.2.2:3000
```

**Backend (.env)**
```
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
DYNAMODB_ENDPOINT=http://localhost:8000
ORDERS_TABLE=PizzetosOrders
AWS_REGION=us-east-1
```

### 🔒 Seguridad

- **firebase-service-account.json**: NO debe versionarse (incluido en .gitignore)
- **API Keys**: Mantener en variables de entorno, nunca en código fuente
- **Google Web Client ID**: Es públicamente seguro (diseñado para uso frontend)

### 📊 Tamaños Esperados

| Componente | Tamaño Aproximado |
|------------|------------------|
| node_modules (Frontend) | ~800 MB |
| node_modules (Backend) | ~300 MB |
| Android APK (Release) | ~50-100 MB |
| iOS App Bundle | ~60-120 MB |

---

## 📞 Soporte

Para problemas de versiones:
1. Verificar que `node --version` sea `>=20.0.0`
2. Eliminar `node_modules` y `package-lock.json`, luego `npm install`
3. Limpiar cache: `npm cache clean --force`
4. Para Android: `cd android && ./gradlew clean && cd ..`
5. Para iOS: `cd ios && pod install && cd ..`

---

**Documento generado:** 15 de mayo de 2026  
**Proyecto:** Pizzetos App v1.0.0  
**Revisor Recomendado:** Ingeniero de DevOps / Tech Lead
