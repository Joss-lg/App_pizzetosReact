const { createOrderService, getOrdersByCustomerId } = require('../services/orderService');

const createOrder = async (req, res, next) => {
  try {
    const { items, total, deliveryData } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'items array is required and must not be empty',
      });
    }

    if (total === undefined || total === null) {
      return res.status(400).json({
        success: false,
        message: 'total is required',
      });
    }

    if (!deliveryData || typeof deliveryData !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'deliveryData is required',
      });
    }

    const normalizedDeliveryData = {
      nombreCompleto: String(deliveryData.nombreCompleto || '').trim(),
      email: String(deliveryData.email || '').trim(),
      telefonoContacto: String(deliveryData.telefonoContacto || '').trim(),
      direccion: String(deliveryData.direccion || '').trim(),
      apartamento: String(deliveryData.apartamento || '').trim(),
      referencias: String(deliveryData.referencias || '').trim(),
    };

    if (!normalizedDeliveryData.direccion) {
      return res.status(400).json({
        success: false,
        message: 'deliveryData.direccion is required',
      });
    }

    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user',
      });
    }

    const createdOrder = await createOrderService({
      items,
      total,
      deliveryData: normalizedDeliveryData,
      customerId: req.user.uid,
      customerName: req.user.name || req.user.email || 'Usuario',
    });

    return res.status(201).json({
      success: true,
      data: createdOrder,
    });
  } catch (error) {
    return next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user',
      });
    }

    const orders = await getOrdersByCustomerId(req.user.uid);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
};
