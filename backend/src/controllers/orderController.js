import mongoose from "mongoose";
import Book from "../models/bookSchema.js";
import Order from "../models/orderSchema.js";
import Cart from "../models/cartSchema.js";

// Create new order
export const CreateOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!items || !shippingAddress || items.length === 0) {
      return res.status(400).json({
        message: "Order items and shipping address are required",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({
          message: `Book not found: ${item.bookId}`,
        });
      }

      const itemTotal = book.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        bookId: item.bookId,
        quantity: item.quantity,
        price: book.price,
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    // Clear cart after successful order
    await Cart.findOneAndUpdate(
      { user: userId, status: "active" },
      { $set: { items: [], totalAmount: 0 } }
    );

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "userName email")
      .populate("items.bookId", "title author image");

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error creating order" });
  }
};

// Get all orders of the logged-in user
export const GetOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.bookId", "title author image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      count: orders.length,
      orders, // plural
    });
  } catch (error) {
    console.error("Get User Orders Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single order by ID
export const GetOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Order Id format" });
    }

    const order = await Order.findById(req.params.id)
      .populate("items.bookId", "title author image")
      .populate("user", "userName email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized" });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order, // singular
    });
  } catch (error) {
    console.error("Error while fetching order:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
