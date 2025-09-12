import express from "express";
import {getProfile, LoginUser, LogOutUser, RegisterUser, updateUserProfile} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Authenciation and user's endpoints
router.post("/auth/register", RegisterUser);
router.post("/auth/login", LoginUser)
router.post("/auth/logout" , LogOutUser)
router.get("/users/profile", protect, getProfile)
router.put("/users/profile", protect , updateUserProfile)

export default router;
