import express from 'express'
import { CreateOrder, GetOrderById, GetOrders } from '../controllers/orderController.js'

import protect from '../middleware/authMiddleware.js'


const router = express.Router()


router.post('/orders', protect, CreateOrder)
router.get('/orders', protect, GetOrders)
router.get('/orders/:id', protect, GetOrderById)

export default router