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
