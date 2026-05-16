const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const clientConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
};

// Para pruebas locales con DynamoDB Local
if (process.env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
  clientConfig.credentials = {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  };
}

const client = new DynamoDBClient(clientConfig);

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const ORDERS_TABLE = process.env.ORDERS_TABLE || 'PizzetosOrders';

module.exports = { docClient, ORDERS_TABLE };
