// routes/cartRoutes.js
import express from "express";
import {
  AddToCart,
  ClearCart,
  GetCarts,
  RemoveFromCart,
  UpdateCartItem,
  CheckoutCart,
} from "../controllers/cartController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

//  Get user active cart
router.get("/cart", protect, GetCarts);

//  Add item to cart
router.post("/items", protect, AddToCart);

//  Update quantity of an item
router.put("/items/:bookId", protect, UpdateCartItem);

//  Remove single item
router.delete("/items/:bookId", protect, RemoveFromCart);

//  Clear all items
router.delete("/items", protect, ClearCart);

//  Checkout cart
router.post("/checkout", protect, CheckoutCart);

export default router;
