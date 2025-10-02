import express from 'express'
import { CreateOrder, GetAllOrders, GetOrderById, GetOrders, UpdateOrderStatus } from '../controllers/orderController.js'
import authorize from '../middleware/authorize.js'
import protect from '../middleware/authMiddleware.js'


const router = express.Router()


router.post('/orders', protect, CreateOrder)
router.get('/orders', protect, GetOrders)
router.get('/orders/:id', protect, GetOrderById)
router.get("/admin/orders", protect, authorize('admin'), GetAllOrders)
router.put("/admin/orders/:orderId/status", protect, authorize('admin'), UpdateOrderStatus);

export default router