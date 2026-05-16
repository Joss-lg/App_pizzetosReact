# Backend Pizzetos — Fase 1: Integración con DynamoDB

## Objetivo

Migrar la persistencia de pedidos de Firestore a **Amazon DynamoDB**, manteniendo la autenticación con Firebase y exponiendo la API como funciones Lambda mediante Serverless Framework.

---

## Arquitectura

```
Cliente (React Native)
        │
        │  Bearer Token (Firebase Auth)
        ▼
┌─────────────────────────┐
│   serverless-offline    │  (local) / API Gateway (AWS)
│   Express + Lambda      │
├─────────────────────────┤
│   authMiddleware.js     │  Verifica token con Firebase Admin SDK
│   orderController.js   │  Valida request y llama al servicio
│   orderService.js       │  Operaciones CRUD sobre DynamoDB
│   dynamoDB.js           │  Cliente DynamoDB (local o AWS)
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│      DynamoDB           │  Tabla: PizzetosOrders
│  PK: customerId (S)     │
│  SK: createdAt  (S)     │
└─────────────────────────┘
```

---

## Tabla DynamoDB: `PizzetosOrders`

| Atributo      | Tipo   | Rol         | Descripción                          |
|---------------|--------|-------------|--------------------------------------|
| `customerId`  | String | Partition Key | UID del usuario (Firebase)         |
| `createdAt`   | String | Sort Key      | Fecha ISO 8601                     |
| `orderId`     | String | —             | ID único generado (`ord_<timestamp>`) |
| `customerName`| String | —             | Nombre del usuario                  |
| `items`       | List   | —             | Array de productos del pedido       |
| `total`       | Number | —             | Monto total del pedido              |
| `status`      | String | —             | Estado inicial: `CREATED`           |

---

## Estructura de archivos

```
backend_p/
├── .env.example                  # Plantilla de variables de entorno
├── docker-compose.yml            # DynamoDB Local vía Docker (alternativa)
├── serverless.yml                # Definición de funciones, tabla y permisos IAM
├── scripts/
│   ├── downloadDynamo.js         # Descarga el JAR de DynamoDB Local desde AWS
│   ├── createTable.js            # Crea la tabla PizzetosOrders en DynamoDB Local
│   └── startLocal.js            # Orquestador: JAR + tabla + serverless offline
└── src/
    ├── config/
    │   ├── dynamoDB.js           # Cliente DynamoDB (cambia entre local y AWS con .env)
    │   └── firebaseAdmin.js      # Inicialización Firebase Admin SDK
    ├── controllers/
    │   └── orderController.js    # Validación de requests y respuestas HTTP
    ├── services/
    │   └── orderService.js       # Lógica de negocio: createOrder, getOrders
    ├── middleware/
    │   └── authMiddleware.js     # Verificación de token Firebase
    ├── routes/
    │   └── orderRoutes.js        # Rutas: GET /orders, POST /orders
    └── app.js                    # App Express + handler Lambda
```

---

## Configuración

### Variables de entorno

Copia `.env.example` a `.env` y ajusta si es necesario:

```bash
cp .env.example .env
```

| Variable                       | Valor por defecto                  | Descripción                                      |
|--------------------------------|------------------------------------|--------------------------------------------------|
| `AWS_REGION`                   | `us-east-1`                        | Región de AWS                                    |
| `DYNAMODB_ENDPOINT`            | `http://localhost:8000`            | Solo para local. Comentar para usar DynamoDB real |
| `ORDERS_TABLE`                 | `PizzetosOrders`                   | Nombre de la tabla                               |
| `FIREBASE_SERVICE_ACCOUNT_PATH`| `./firebase-service-account.json`  | Ruta al service account de Firebase Admin SDK   |

### Firebase Service Account

1. Ir a [Firebase Console](https://console.firebase.google.com) → tu proyecto → Configuración del proyecto → Cuentas de servicio
2. Generar nueva clave privada → descargar el JSON
3. Colocar el archivo en `backend_p/` con el nombre `firebase-service-account.json`

> Este archivo está en `.gitignore` y **nunca debe subirse al repositorio**.

---

## Pruebas locales

### Prerequisitos

- **Node.js 20+**
- **Java 11+** (requerido por DynamoDB Local)
  - Verifica con: `java -version`
  - Si no está instalado: [Amazon Corretto 17](https://corretto.aws/downloads/latest/amazon-corretto-17-x64-windows-jdk.msi)
- Archivo `firebase-service-account.json` en la raíz del proyecto

### Instalar dependencias

```bash
npm install
```

### Levantar el entorno local

```bash
npm run local
```

Este comando ejecuta `scripts/startLocal.js` que:
1. Descarga el JAR de DynamoDB Local desde AWS CloudFront *(solo la primera vez, ~30 MB)*
2. Inicia DynamoDB Local en `http://localhost:8000` (en memoria)
3. Espera a que esté listo y crea la tabla `PizzetosOrders`
4. Inicia `serverless offline` en `http://localhost:3000`

### Scripts disponibles

| Script                  | Descripción                                              |
|-------------------------|----------------------------------------------------------|
| `npm run local`         | Inicia todo el entorno local (recomendado)               |
| `npm run dynamo:install`| Solo descarga el JAR de DynamoDB Local                   |
| `npm run dynamo:setup`  | Solo crea la tabla en DynamoDB Local (debe estar corriendo) |
| `npm run offline`       | Solo inicia serverless-offline (DynamoDB debe estar corriendo) |
| `npm run deploy`        | Despliega en AWS                                         |

---

## Endpoints

Base URL local: `http://localhost:3000/dev`

### `GET /health`
Verifica que la API esté corriendo.

**Respuesta:**
```json
{ "ok": true, "message": "API running" }
```

---

### `POST /orders`
Crea un nuevo pedido para el usuario autenticado.

**Headers:**
```
Authorization: Bearer <token_firebase>
Content-Type: application/json
```

**Body:**
```json
{
  "items": [
    { "name": "Pizzeta Margherita", "qty": 2, "price": 8.50 }
  ],
  "total": 17.00
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_1715700000000",
    "customerId": "uid_firebase",
    "customerName": "Juan",
    "items": [...],
    "total": 17,
    "status": "CREATED",
    "createdAt": "2026-05-14T18:30:00.000Z"
  }
}
```

---

### `GET /orders`
Obtiene todos los pedidos del usuario autenticado, ordenados del más reciente al más antiguo.

**Headers:**
```
Authorization: Bearer <token_firebase>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [ ...pedidos ]
}
```

---

## Ejemplo con curl (PowerShell)

```powershell
# Health check
curl http://localhost:3000/dev/health

# Crear pedido
curl -X POST http://localhost:3000/dev/orders `
  -H "Authorization: Bearer <token_firebase>" `
  -H "Content-Type: application/json" `
  -d '{"items":[{"name":"Pizzeta","qty":1,"price":8.50}],"total":8.50}'

# Obtener pedidos
curl http://localhost:3000/dev/orders `
  -H "Authorization: Bearer <token_firebase>"
```

---

## Despliegue en AWS

```bash
npm run deploy
```

Serverless Framework crea automáticamente:
- La tabla `PizzetosOrders` en DynamoDB (modo `PAY_PER_REQUEST`)
- La función Lambda con los permisos IAM necesarios
- El API Gateway con las rutas configuradas

---

## Cambios respecto a la versión anterior (Firestore)

| Aspecto               | Antes (Firestore)                  | Ahora (DynamoDB)                          |
|-----------------------|------------------------------------|-------------------------------------------|
| Base de datos         | Cloud Firestore                    | Amazon DynamoDB                           |
| SDK                   | `firebase-admin` (Firestore)       | `@aws-sdk/client-dynamodb` + `lib-dynamodb` |
| Autenticación DB      | Service Account Firebase           | IAM Role (en AWS) / credenciales locales  |
| Consulta por usuario  | `.where('customerId', '==', uid)`  | `QueryCommand` con `KeyConditionExpression` |
| Ordenamiento          | `.orderBy('createdAt', 'desc')`    | `ScanIndexForward: false`                 |
| Entorno local         | Emulador de Firebase               | DynamoDB Local JAR                        |
