# Herramientas usadas - Pizzetos

Este proyecto tiene dos partes:

- Frontend mobile en App_pizzetosReact-main con React Native.
- Backend API en backend_p con Serverless, Express y DynamoDB.

## 1. Stack principal

### Frontend

- React 19.2.0
- React Native 0.83.1
- TypeScript 5.8.3
- Firebase 24.0.0
- Google Sign-In 12.0.0
- React Navigation 7.x
- Axios 1.16.0
- AsyncStorage 2.2.0

### Backend

- Node.js runtime 16.x en Serverless
- Serverless Framework 3.39.0
- serverless-offline 8.8.1
- Express 5.2.1
- Firebase Admin 13.8.0
- AWS SDK DynamoDB 3.600.0
- dotenv 17.4.2

### Base de datos local

- DynamoDB Local con Docker
- Imagen: amazon/dynamodb-local:latest
- Puerto: 8000

## 2. Requisitos para ejecutar el proyecto

Instalar en la computadora del ingeniero:

- Node.js 20 o superior
- npm 9 o superior
- Java JDK 11 o superior
- Android Studio con Android SDK
- Android Build Tools 36.0.0
- Android SDK API 36
- Docker
- Git

Configuracion Android usada por el proyecto:

- minSdkVersion: 24
- compileSdkVersion: 36
- targetSdkVersion: 36
- ndkVersion: 27.1.12297006
- kotlinVersion: 2.1.20

## 3. Estructura del proyecto

- App_pizzetosReact-main: aplicacion React Native
- backend_p: API backend y configuracion local de DynamoDB
- herramientas_usadas.md: este resumen tecnico

## 4. Variables de entorno necesarias

### Frontend

Archivo esperado: App_pizzetosReact-main/.env

Variables:

```env
API_BASE_URL=http://10.0.2.2:3000
GOOGLE_WEB_CLIENT_ID=tu_google_web_client_id
```

Nota:

- En emulador Android, 10.0.2.2 apunta al localhost de la computadora.

### Backend

Archivo esperado: backend_p/.env

Variables:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
DYNAMODB_ENDPOINT=http://localhost:8000
ORDERS_TABLE=PizzetosOrders
AWS_REGION=us-east-1
```

Ademas, el archivo backend_p/firebase-service-account.json debe existir localmente, pero no debe subirse a GitHub.

## 5. Pasos para ejecutar la app

### Backend

Desde backend_p:

```bash
npm install
npm run dynamo:install
npm run dynamo:up
npm run dynamo:setup
npm run offline
```

Resultado esperado:

- DynamoDB Local corriendo en localhost:8000
- API backend corriendo en localhost:3000

### Frontend

Desde App_pizzetosReact-main:

```bash
npm install
npm start
```

En otra terminal, desde la misma carpeta:

```bash
npm run android
```

Resultado esperado:

- Metro Bundler corriendo
- App Android instalada en emulador o dispositivo

## 6. Flujo recomendado de arranque

Seguir este orden:

1. Levantar Docker.
2. Levantar DynamoDB Local.
3. Ejecutar el backend con npm run offline.
4. Ejecutar Metro con npm start.
5. Ejecutar la app con npm run android.

## 7. Compatibilidades importantes

- No subir Serverless a v4 en este proyecto.
- La combinacion estable usada aqui es Serverless 3.39.0 + serverless-offline 8.8.1.
- El frontend esta montado sobre React Native 0.83.1.
- El backend espera DynamoDB Local o una tabla DynamoDB llamada PizzetosOrders.

## 8. Archivos sensibles

No deben subirse a GitHub:

- .env
- backend_p/firebase-service-account.json
- node_modules
- .serverless
- .dynamodb

Si otra persona clona el proyecto, debe recrear manualmente:

- App_pizzetosReact-main/.env
- backend_p/.env
- backend_p/firebase-service-account.json

## 9. Comandos utiles de verificacion

```bash
node --version
npm --version
java -version
docker --version
git --version
```

Para validar backend:

```bash
http://localhost:3000/dev/health
```

Debe responder correctamente cuando serverless-offline este activo.

## 10. Resumen ejecutivo

El proyecto fue trabajado con React Native para la app mobile y Serverless + Express + DynamoDB para el backend. Para ejecutarlo en otra computadora, el ingeniero necesita instalar Node, Java, Android Studio y Docker; crear los archivos .env; colocar el service account de Firebase en backend_p; levantar primero el backend y luego el frontend.
