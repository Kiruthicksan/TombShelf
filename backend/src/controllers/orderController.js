import mongoose from "mongoose";
import Book from "../models/bookSchema.js";
import Order from "../models/orderSchema.js";

export const CreateOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!items || !shippingAddress || items.length === 0) {
      return res.status(400).json({
        message: "Order items and shipping address are required",
      });
    }

    // Initialize variables for calculation
    let totalAmount = 0;
    const orderItems = [];

    // Looping through each item
    for (const item of items) {
      // Check if book exists
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({
          message: `Book not found: ${item.bookId}`,
        });
      }

      // Calculate total price for this item

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

export const GetOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.bookId", "title author image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Order fetched Successfully",
      count: orders.count,
      order: orders,
    });
  } catch (error) {
    console.error("Get User Orders Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const GetOrderById = async (req, res) => {
  try {

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).json({message : "Invalid Order Id format"})
    }
    const order = await Order.findById(req.params.id)
      .populate("items.bookId", "title author image")
      .populate("user", "userName email");
    
    if (!order){
      return res.status(404).json({message : "Order not found"})
    }
      if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin'){
          return res.status(400).json({message :"Not Authorized"})
      }

      res.status(200).json({
        message : "Order fetched Successfully",
        order : order

      })
  } catch (error) {
    console.error("Error while fetching:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
