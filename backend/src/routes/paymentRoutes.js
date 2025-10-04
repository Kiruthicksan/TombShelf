import express from 'express'
import { confirmOrder, payment } from '../controllers/paymentController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/checkout/payment', protect , payment)
router.post('/checkout/confirm-order', protect ,  confirmOrder)

export default router

