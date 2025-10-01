// controllers/cartController.js

import Book from "../models/bookSchema.js";
import Cart from "../models/cartSchema.js";

// ----------------------------------------------------
// Helper function: recalc totals + populate cart
// ----------------------------------------------------
const finalizeCart = async (cart) => {
  cart.totalAmount = cart.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  await cart.save();
  await cart.populate("items.bookId", "title author image price");

  return cart;
};

// ----------------------------------------------------
// Add or update items in cart
// ----------------------------------------------------
export const AddToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookId, quantity = 1 } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    // Verify book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    let cart = await Cart.findOne({ user: userId, status: "active" });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: userId,
        items: [{ bookId, quantity, price: book.price }],
      });
    } else {
      // Check if item exists
      const itemIndex = cart.items.findIndex(
        (item) => item.bookId.toString() === bookId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ bookId, quantity, price: book.price });
      }
    }

    const updatedCart = await finalizeCart(cart);

    res.status(200).json({
      message: "Item added to cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Add to cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ----------------------------------------------------
// Get active cart for user
// ----------------------------------------------------
export const GetCarts = async (req, res) => {
  try {
    const userId = req.user.userId;
    let cart = await Cart.findOne({ user: userId, status: "active" })
      .populate("items.bookId", "title author image price")
      .sort({ createdAt: -1 });

    if (!cart) {
      // Return empty cart
      return res.status(200).json({
        message: "Cart fetched successfully",
        cart: { user: userId, items: [], totalAmount: 0, status: "active" },
      });
    }

    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    console.error("Get User cart Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ----------------------------------------------------
// Update quantity of item
// ----------------------------------------------------
export const UpdateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: userId, status: "active" });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.bookId.toString() === bookId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    const updatedCart = await finalizeCart(cart);

    res.status(200).json({
      message: "Cart item updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Update Cart Item Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ----------------------------------------------------
// Remove item from cart
// ----------------------------------------------------
export const RemoveFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: userId, status: "active" });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.bookId.toString() !== bookId
    );

    const updatedCart = await finalizeCart(cart);

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Remove from cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ----------------------------------------------------
// Clear all items
// ----------------------------------------------------
export const ClearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId, status: "active" });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    const updatedCart = await finalizeCart(cart);

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Clear cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ----------------------------------------------------
// Optional: Checkout (mark as checkedOut)
// ----------------------------------------------------
export const CheckoutCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId, status: "active" });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.status = "checkedOut";
    await cart.save();

    res.status(200).json({
      message: "Cart checked out successfully",
      cart,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
