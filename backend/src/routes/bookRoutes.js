import express from 'express'
import protect from '../middleware/authMiddleware.js'
import authorize from '../middleware/authorize.js'
import { CreateNovel } from '../controllers/bookController.js'

const router = express.Router()

router.post('/books', protect ,authorize('admin', 'publisher'), CreateNovel)

export default router