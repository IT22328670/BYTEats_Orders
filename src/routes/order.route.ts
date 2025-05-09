import express from 'express';
import * as OrderController from '../controllers/order.controller';

const router = express.Router();

router.get('/available', OrderController.getAvailableOrders);
router.post('/:orderId/accept', OrderController.acceptOrder);
router.put('/:orderId/delivered', OrderController.markOrderDelivered);
router.put('/:orderId/cancel', OrderController.cancelOrder);
router.get('/delivery-person/:deliveryPersonId', OrderController.getOrdersByDeliveryPerson);
router.get('/user/:userId', OrderController.getOrdersByUser);



export default router;
