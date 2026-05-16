/**
 * Script para crear la tabla PizzetosOrders en DynamoDB Local.
 * Ejecutar antes de iniciar el servidor en modo local:
 *   node scripts/createTable.js
 */

require('dotenv').config();
const { CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { docClient: _unused, ...rest } = require('../src/config/dynamoDB');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const ORDERS_TABLE = process.env.ORDERS_TABLE || 'PizzetosOrders';

const clientConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
};

if (process.env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
  clientConfig.credentials = {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  };
}

const client = new DynamoDBClient(clientConfig);

async function createTable() {
  // Verificar si la tabla ya existe
  const { TableNames } = await client.send(new ListTablesCommand({}));
  if (TableNames.includes(ORDERS_TABLE)) {
    console.log(`Tabla "${ORDERS_TABLE}" ya existe. No se requiere acción.`);
    return;
  }

  await client.send(
    new CreateTableCommand({
      TableName: ORDERS_TABLE,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [
        { AttributeName: 'customerId', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'customerId', KeyType: 'HASH' },
        { AttributeName: 'createdAt', KeyType: 'RANGE' },
      ],
    })
  );

  console.log(`Tabla "${ORDERS_TABLE}" creada correctamente en DynamoDB Local.`);
}

if (require.main === module) {
  createTable().catch((err) => {
    console.error('Error al crear la tabla:', err.message);
    process.exit(1);
  });
}

module.exports = { createTable };
