import mongoose from "mongoose";
import Book from "../models/bookSchema.js";

export const CreateNovel = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      orginalPrice,
      category,
      genre,
      status,
      seriesTitle,
      volumeNumber,
      totalVolumes,
      language,
      ageRating
    
     
    } = req.body;

    if (!title || !author || !description || !price ||  !category || !genre || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBook = await Book.create({
      title,       
      author,
      description,
      price,
       orginalPrice,
      category,
      genre,
      status,
       seriesTitle,
      volumeNumber,
      totalVolumes,
      language,
      ageRating,
      image: req.file ? `/uploads/${req.file.filename}` : "/uploads/default-cover.jpg",
      
      addedBy: req.user.id,
    });

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error: ", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation Error" });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
};


export const GetBooks = async (req, res) => {
  try {
    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    if (req.query.seriesTitle) {
      query.seriesTitle = req.query.seriesTitle;
    }

    if (req.query.status){
      query.status = req.query.status
    }

    const books = await Book.find(query);

    // counting books

    const totalBook = await Book.countDocuments(query);

    res.status(200).json({
      message: "Books fetched Successfully",
      count: totalBook,
      books: books,
    });
  } catch (error) {
    console.error("Get Books Error:", error);
    res.status(500).json({ message: " Server Error while fetching Books" });
  }
};

export const GetBookById = async (req, res) => {
  try {
    const { id } = req.params;

    // checking if id is valid mongodb objectId

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book Id format" });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book fetched Successfully",
      book: book,
    });
  } catch (error) {
    console.error("Get Book by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const UpdateBooks = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid bookId" });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // conditon to allow publisher to edit the book only they uploaded

    if (
      req.user.role === "publisher" &&
      book.addedBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({
          message: "Not Authorized. You can only update your own books",
        });
    }



    const {
      title,
      author,
      description,
      price,
      orginalPrice,
       status,
      category,
      genre,
      image,
      volumeNumber,
      seriesTitle,
      totalVolumes,
      language,
      ageRating,
    } = req.body;

    // build object with only provided feilds

    const updateData = {};

    
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (orginalPrice !== undefined) updateData.orginalPrice = orginalPrice
    if (category !== undefined) updateData.category = category;
    if (genre !== undefined) updateData.genre = genre;
    if (image !== undefined) updateData.image = image;
    if (volumeNumber !== undefined) updateData.volumeNumber = volumeNumber;
    if (seriesTitle !== undefined) updateData.seriesTitle = seriesTitle;
    if(totalVolumes !== undefined) updateData.totalVolumes = totalVolumes
    if (language !== undefined) updateData.language = language
    if (ageRating !== undefined) updateData.ageRating = ageRating
    if (status !== undefined) updateData.status = status

    const UpdateBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Book updated Successfully",
      book: UpdateBook,
    });
  } catch (error) {
    console.error("Update Book Error: ", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        error: error.message,
      });
    }

    res.status(500).json({ message: "Server error while updating book" });
  }
};

export const DeleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Bood Id" });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book Not found" });
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({
      message: "Book Deleted Successfully",
      deletedBookId: id,
    });
  } catch (error) {
    console.error("Delete Book Error :", error);
    res.status(500).json({ message: "Server error deleting Book" });
  }
};
