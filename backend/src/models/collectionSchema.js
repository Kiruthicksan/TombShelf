import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    // Name of the collection

    name: {
      type: String,
      required: [true, "Please Provide a Collection Name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },

    // Description for collectioln

    description: {
      type: String,
      maxLength: [200, "Description cannot be more than 200 characters"],
    },

    // Owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // book collection
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Collection = mongoose.model("Collection", CollectionSchema);

export default Collection;
