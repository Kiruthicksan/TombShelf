import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import genrateToken from "../utils/genrateToken.js";
import setAuthCookie from "../utils/setAuthCookie.js";


export const RegisterUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // checking all feild are filled
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All feild are required" });
    }

    //  checking existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is Already Registered" });
    }

    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = genrateToken(newUser._id);
    setAuthCookie(res, token);

    res.status(201).json({
      message: "Registration Sucessful",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role : newUser.role
      },
    });
  } catch (error) {
    console.error("Registration error :", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email is already Registered" });
    }

    res.status(500).json({ message: "Internal Server error" });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if feild is empty
    if (!email || !password) {
      return res.status(400).json({ message: "All feild are required" });
    }
    // checking existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Email Not Registered" });
    }

    // comparing Password

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = genrateToken(existingUser._id);
    setAuthCookie(res, token);

    res.status(200).json({
      message: "Login Successful",
      user: {
        id: existingUser._id,
        userName: existingUser.userName,
        email: existingUser.email,
        role : existingUser.role
      },
    });
  } catch (error) {
    console.error("Login Error", error);
  }
};

export const LogOutUser = (req, res) => {

   try {
       res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.Node_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({message : "Logout Successful"})
   } catch (error) {
      console.error("Logout Error", error)
      res.status(500).json({message  : "Internal Error during Logout"})
   }
 
};

export const getProfile = (req, res) => {
  try {
      const user = req.user

      res.status(200).json({
        message : "Profile fetchecd Succsfully",
        user : {
          id : user._id,
         userName : user.userName,
         email : user.email,
         role : user.role
        }
         
      })
  } catch (error) {
      res.status(500).json({message : "Server Error"})
  }

}


export const updateUserProfile = async (req,res) => {
  try {
    const user = await User.findById(req.user.id)

    if(!user){
      return res.status(404).json({message : "User not found"})
    }

    const {userName, email} = req.body

    // creating object to store updatedInfo
    const updatedData = {}
    if(userName !== undefined) updatedData.userName = userName
    if (email !== undefined) updatedData.email = email 

    // checking if email id is already taken by another user
    if (email && email !== user.email){
      const existingUser = await User.findOne({email})
      if (existingUser){
        return res.status(400).json({message : "Email is already in use"})
      }
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      updatedData,
      {new : true, runValidators: true}
    ).select('-password')

    res.status(200).json({
      message : "profile update successfully",
      user:{
        id : updateUser._id,
        userName : updateUser.userName,
        email : updateUser.email,
        role : updateUser.role
      }
    })
  } catch (error) {
    
  }
}