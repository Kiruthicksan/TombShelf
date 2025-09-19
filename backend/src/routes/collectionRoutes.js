import express from "express";
import { CreateCollection } from "../controllers/collectionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/collections", protect, CreateCollection);

export default router;
