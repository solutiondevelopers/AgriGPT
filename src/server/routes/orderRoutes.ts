import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);

export default router;
