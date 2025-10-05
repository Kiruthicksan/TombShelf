import express from "express";
import {forgotPassword, getProfile, LoginUser, LogOutUser, RegisterUser, resetPassword, updateUserProfile} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Authenciation and user's endpoints
router.post("/auth/register", RegisterUser);
router.post("/auth/login", LoginUser)
router.post("/auth/logout" , LogOutUser)
router.get("/users/profile", protect, getProfile)
router.put("/users/profile", protect , updateUserProfile)
router.post("/auth/reset", forgotPassword )
router.post("/auth/reset-password", resetPassword)

export default router;
