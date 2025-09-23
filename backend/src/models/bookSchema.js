import mongoose from "mongoose";
import User from "./userSchema.js";


const bookSchema = new mongoose.Schema({
    title: {
        type :String,
        required : [true, "Please Provide a title"],
        trim : true
    },
    author: {
        type : String,
        required: [true, "Please Provide an author / artist"]
    },
    description: {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true,
        min : 0
    },
    category: {
        type : String,
        required : true,
        enum : ['book', 'manga', 'comics']
    },
    genre: {
        type : String,
        required : true
    },
    status: {
        type : String,
        required : true,
        enum : ["released", "upcoming"]
    },
    image: {
        type :String,
        default : "default-cover.jpg"
    },

   
    seriesTitle: {
        type : String
    },
    addedBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref : User,
        required : true
    }
}, {timestamps: true})


const Book = mongoose.model('Book', bookSchema)

export default Book