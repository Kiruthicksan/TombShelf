import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [CartItemSchema],

  totalAmount: {
    type : Number,
    required : true,
    min: 0
  },

   status: {
    type: String,
    enum: ["active", "checkedOut"],
    default: "active" 
  },
}, {timestamps : true});


const Cart = mongoose.model('Cart', cartSchema)

export default Cart