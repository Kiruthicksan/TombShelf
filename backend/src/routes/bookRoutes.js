import express from 'express'
import protect from '../middleware/authMiddleware.js'
import authorize from '../middleware/authorize.js'
import { CreateNovel, GetBookById, GetBooks } from '../controllers/bookController.js'

const router = express.Router()

router.post('/books', protect ,authorize('admin', 'publisher'), CreateNovel)
router.get('/books' , GetBooks)
router.get('/books/:id', GetBookById)

export default router