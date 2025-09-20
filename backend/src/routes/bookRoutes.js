import express from 'express'
import protect from '../middleware/authMiddleware.js'
import authorize from '../middleware/authorize.js'
import { CreateNovel, DeleteBook, GetBookById, GetBooks, UpdateBooks } from '../controllers/bookController.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.post('/books', protect ,authorize('admin', 'publisher'), upload.single("image") , CreateNovel)
router.get('/books' , GetBooks)
router.get('/books/:id', GetBookById)
router.put('/books/:id', protect , authorize ('admin', 'publisher'), UpdateBooks)
router.delete('/books/:id', protect , authorize('admin'), DeleteBook)

export default router