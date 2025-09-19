import Collection from "../models/collectionSchema.js";

export const CreateCollection = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ messge: "Name is required" });
    }

    const newCollection = await Collection.create({
      name,
      description,
      user: userId,
      books: [],
      isPublic: isPublic || false,
    });

    res.status(201).json({
      message: "Collection Created Successfully",
      collection: newCollection,
    });
  } catch (error) {
    console.error("Create Collection Error:", error)

    if (error.code === 11000){
        return res.status(400).json({message : "You already have a collection with this name"})
    }

    res.status(500).json({message : "Server Error creating Collection"})
  }
};
