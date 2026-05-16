const { PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, ORDERS_TABLE } = require('../config/dynamoDB');

const createOrderService = async ({
  items,
  total,
  customerName,
  customerId,
  deliveryData,
}) => {
  const orderId = `ord_${Date.now()}`;
  const createdAt = new Date().toISOString();

  const order = {
    orderId,
    customerId,
    customerName,
    items,
    total: Number(total),
    status: 'CREATED',
    createdAt,
    deliveryData,
  };

  await docClient.send(
    new PutCommand({
      TableName: ORDERS_TABLE,
      Item: order,
    })
  );

  return order;
};

const getOrdersByCustomerId = async (customerId) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: ORDERS_TABLE,
      KeyConditionExpression: 'customerId = :cid',
      ExpressionAttributeValues: {
        ':cid': customerId,
      },
      ScanIndexForward: false, // más reciente primero
    })
  );

  return result.Items || [];
};

module.exports = {
  createOrderService,
  getOrdersByCustomerId,
};



