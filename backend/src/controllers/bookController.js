import mongoose from "mongoose";
import Book from "../models/bookSchema.js";

export const CreateNovel = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      category,
      genre,
      image,
      volumeNumber,
      seriesTitle,
      
    } = req.body;

    if (
      !title ||
      !author ||
      !description ||
      !price ||
      !category ||
      !genre ||
      !image 
     
      
    ) {
      return res.status(400).json({ message: "All feilds are required" });
    }

    const newBook = await Book.create ({
        title,
        author,
        description,
        price,
        category,
        genre,
        image,
        volumeNumber,
        seriesTitle,
       addedBy: req.user.id


    })

    res.status(201).json({message : "Book added successfully", 
        book : newBook})
  } catch (error) {
    console.error("Error: " , error)

    if (error.name = "ValidationError"){
        return res.status(400).json({message : "validation Error"})
    }

    res.status(500).json({error : "Something went wront"})
  }
};



export const GetBooks = async (req,res) => {
  try {
     
    const query = {}

    if (req.query.category){
      query.category = req.query.category
    }

    if (req.query.genre){
      query.genre = req.query.genre
    }

    if (req.query.seriesTitle){
      query.seriesTitle = req.query.seriesTitle
    }

    const books = await Book.find(query)

    // counting books 

    const totalBook = await Book.countDocuments(query)

    res.status(200).json({
      message : "Books fetched Successfully",
      count : totalBook,
      book : books
    })
  } catch (error) {
    console.error("Get Books Error:" ,error)
    res.status(500).json({message : " Server Error while fetching Books"})
  }
}

export const GetBookById = async (req,res) =>{
  try {
    const {id} = req.params

    // checking if id is valid mongodb objectId

    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({message : "Invalid book Id format"})
    }

    const book = await Book.findById(id)

    if (!book){
      return res.status(404).json({message : "Book not found"})
    }

    res.status(200).json({
      message : "Book fetched Successfully",
      book : book
    })
  } catch (error) {
     console.error("Get Book by ID error:", error)
     res.status(500).json({message : "Server error"})
  }
}