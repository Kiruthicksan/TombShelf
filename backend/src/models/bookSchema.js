import mongoose from "mongoose";
import User from "./userSchema.js";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Provide a title"],
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, "Please Provide an author / artist"],
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [2000, "Description too long"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    orginalPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["manga", "comics"],
    },
    genre: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["completed", "ongoing"],
    },

    
    language: {
      type: String,
      default: "English",
    },
    image: {
      type: String,
      default: "default-cover.jpg",
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
