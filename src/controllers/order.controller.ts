import { Request, Response, NextFunction } from 'express';
import Order from '../models/order.model';
import { io } from '../index'; //

// Get all available orders for delivery (paid or packing)
export const getAvailableOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find({ status: { $in: ['paid', 'packing','cancelled'] } });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Delivery person Accept order
export const acceptOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { deliveryPersonId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.status !== 'paid' && order.status !== 'packing' && order.status !== 'cancelled'&& order.status !== 'delivering') {
      res.status(400).json({ message: 'Order is not ready for delivery' });
      return;
    }
    order.deliveryPersonId = deliveryPersonId;
    order.status = 'delivering';
    await order.save();

    // Emit real-time update
    io.to(orderId).emit("order_status_update", {
      orderId: orderId,
      status: order.status,
      updatedAt: order.updatedAt,
      timestamp: order.timestamp
    });

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Mark as delivered
export const markOrderDelivered = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { deliveryPersonId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.status !== 'delivering') {
      res.status(400).json({ message: 'Order is not currently delivering' });
      return;
    }
    order.deliveryPersonId = deliveryPersonId;
    order.status = 'delivered';
    await order.save();

    // Emit real-time update
    io.to(orderId).emit("order_status_update", {
      orderId: orderId,
      status: order.status,
      updatedAt: order.updatedAt,
      timestamp: order.timestamp
    });

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { deliveryPersonId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    order.deliveryPersonId = deliveryPersonId;
    order.status = 'cancelled';
    await order.save();

    // Emit real-time update
    io.to(orderId).emit("order_status_update", {
      orderId: orderId,
      status: order.status,
      updatedAt: order.updatedAt,
      timestamp: order.timestamp
    });

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Get an order with delivery person details populated
// Get all orders by delivery person ID
export const getOrdersByDeliveryPerson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { deliveryPersonId } = req.params;

    // Find all orders for this delivery person with status delivering or delivered
    const orders = await Order.find({ 
      deliveryPersonId: deliveryPersonId,
      status: { $in: ['delivering', 'delivered'] } 
    });
    
    if (!orders || orders.length === 0) {
      res.status(404).json({ message: 'No orders found for this delivery person' });
      return;
    }

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Get all orders by user ID
export const getOrdersByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;

    // Find all orders for this user
    const orders = await Order.find({ 
      userId: userId
    }).sort({ createdAt: -1 }); // Sort by creation date, newest first
    
    if (!orders || orders.length === 0) {
      res.status(404).json({ message: 'No orders found for this user' });
      return;
    }

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

