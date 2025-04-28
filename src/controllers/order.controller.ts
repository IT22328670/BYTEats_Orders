import { Request, Response, NextFunction } from 'express';
import Order from '../models/order.model';

// Get all available orders for delivery (paid or packing)
export const getAvailableOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find({ status: { $in: ['paid', 'packing'] } });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Delivery person accepts an order
export const acceptOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { deliveryPersonId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.status !== 'paid' && order.status !== 'packing') {
      res.status(400).json({ message: 'Order is not ready for delivery' });
      return;
    }

    order.deliveryPersonId = deliveryPersonId;
    order.status = 'delivering';

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Mark an order as delivered
export const markOrderDelivered = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.status !== 'delivering') {
      res.status(400).json({ message: 'Order is not currently delivering' });
      return;
    }

    order.status = 'delivered';
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Cancel an order
export const cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Get an order with delivery person details populated
export const getOrderWithDeliveryPerson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('deliveryPersonId', 'name email mobile vehicleNumber currentLocation isAvailable');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
