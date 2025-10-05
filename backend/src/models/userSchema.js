import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type : String,
        required: true,
        unique : true,
        lowercase : true,
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid Email Address"]

    },
    password: {
        type: String,
        required: true,
        minLength : [8, "Password Must be 8 characters long"]
    },
    role: {
        type : String,
        enum : ['reader', 'publisher', 'admin' ],
        default : 'reader'
    },

    resetPasswordToken : String,
    resetPasswordExpire : Date

}, {timestamps : true})


const User = mongoose.model('User', UserSchema)

export default User