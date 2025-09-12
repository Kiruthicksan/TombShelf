import express from "express";
import {getProfile, LoginUser, LogOutUser, RegisterUser} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/register", RegisterUser);
router.post("/auth/login", LoginUser)
router.post("/auth/logout" , LogOutUser)
router.get("/users/profile", protect, getProfile)

export default router;
