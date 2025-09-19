import Book from "../models/bookSchema.js";
import Cart from "../models/cartSchema.js";

export const CreateCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Items are required",
      });
    }

    // Check if cart exists for user
    let cart = await Cart.findOne({ user: userId });

    let totalAmount = 0;
    const cartItems = [];

    // Loop through new items
    for (const item of items) {
      const book = await Book.findById(item.bookId);

      if (!book) {
        return res.status(404).json({
          message: `Book not found with id ${item.bookId}`,
        });
      }

      const itemTotal = book.price * item.quantity;
      totalAmount += itemTotal;

      cartItems.push({
        bookId: item.bookId,
        quantity: item.quantity,
        price: book.price,
      });
    }

    if (!cart) {
      // create new cart if none exists
      cart = await Cart.create({
        user: userId,
        items: cartItems,
        totalAmount,
      });
    } else {
      // update existing cart
      cart.items = cartItems;
      cart.totalAmount = totalAmount;
      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id)
      .populate("user", "userName email")
      .populate("items.bookId", "title author image");

    res.status(201).json({
      message: "Cart created/updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error creating cart: ", error);
    res.status(500).json({ message: "Server error creating cart" });
  }
};

export const GetCarts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({user : userId })
      .populate("items.bookId", "title author image price")
      .sort({ createdAt: -1 });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      message: "cart fetched successfully",
      cart,
    });
  } catch (error) {
    console.error("Get User cart Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const UpdateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookId } = req.params;
    const { quantity } = req.body;

   
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.bookId.toString() === bookId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update Cart Item Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

