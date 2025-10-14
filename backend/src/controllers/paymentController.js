import Stripe from "stripe";
import Order from "../models/orderSchema.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPEKEY, {
  apiVersion: "2022-11-15",
});

export const payment = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User authentication required" });
    }

   
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      metadata: {
        shippingAddress: JSON.stringify(shippingAddress),
        userId: req.user.id,
        items: JSON.stringify(
          items.map((item) => ({
            bookId: item.bookId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
      success_url: `http://localhost:5173/stripe-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/cancel",
    });

  

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const confirmOrder = async (req, res) => {
  try {
    const { sessionId } = req.body;

  
    console.log("Session ID:", sessionId);

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

 
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Session metadata:", session.metadata);
    console.log("Payment status:", session.payment_status);

   
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

  
    const itemsData = JSON.parse(session.metadata.items);
    const items = itemsData.map((item) => ({
      bookId: item.bookId,
      quantity: item.quantity,
      price: item.price,
    }));

    const shippingAddress = JSON.parse(session.metadata.shippingAddress);
    const userId = session.metadata.userId;

    if (!userId) {
      console.error(
        "USER ID MISSING IN METADATA. Available metadata:",
        session.metadata
      );
      return res.status(400).json({
        error: "User information missing. Please contact support.",
        details: "User ID not found in payment session",
      });
    }

    const order = await Order.create({
      user: userId,
      items,
      totalAmount: session.amount_total / 100,
      shippingAddress,
      status: "processing",
      paymentStatus: "paid",
    });

    console.log("Order created successfully:", order._id);

    res.json({
      success: true,
      order: {
        _id: order._id,
        user: order.user,
        items: order.items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Order confirmation error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to confirm order",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
