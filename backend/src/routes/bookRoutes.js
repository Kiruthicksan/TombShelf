import express from 'express'
import protect from '../middleware/authMiddleware.js'
import authorize from '../middleware/authorize.js'
import { CreateNovel, getBooks } from '../controllers/bookController.js'

const router = express.Router()

router.post('/books', protect ,authorize('admin', 'publisher'), CreateNovel)
router.get('/books' , getBooks)

export default router