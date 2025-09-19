import express from 'express'
import { CreateCart, GetCarts, UpdateCartItem } from '../controllers/cartController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/cart',protect, CreateCart)
router.get('/cart', protect, GetCarts)
router.put('/cart/:bookId', protect, UpdateCartItem)

export default router