import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import genrateToken from "../utils/genrateToken.js";
import setAuthCookie from "../utils/setAuthCookie.js";
import jwt from "jsonwebtoken";
import transporter from "../utils/emailService.js";

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
        role: newUser.role,
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
        role: existingUser.role,
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

    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.error("Logout Error", error);
    res.status(500).json({ message: "Internal Error during Logout" });
  }
};

export const getProfile = (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      message: "Profile fetchecd Succsfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { userName, email } = req.body;

    // creating object to store updatedInfo
    const updatedData = {};
    if (userName !== undefined) updatedData.userName = userName;
    if (email !== undefined) updatedData.email = email;

    // checking if email id is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    const updateUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      message: "profile update successfully",
      user: {
        id: updateUser._id,
        userName: updateUser.userName,
        email: updateUser.email,
        role: updateUser.role,
      },
    });
  } catch (error) {}
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // validate email

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // find user by email

    const user = await User.findOne({ email });

    // not revealing a email for security purpose
    if (!user) {
      return res
        .status(200)
        .json({ message: "If email exist. We sent a reset link" });
    }

    const resetToken = jwt.sign(
      {
        id: user._id,
        purpose: "password_reset",
      },
      process.env.SECRET + user.password,
      { expiresIn: "10m" }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.frontend_url}/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Password Reset Request</h2>
        <p>Hello ${user.userName},</p>
        <p>You requested a password reset for your TomeShelf account. Click the button below to reset your password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          <strong>This link expires in 10 minutes.</strong><br/>
          If you didn't request this password reset, please ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          If the button doesn't work, copy and paste this link in your browser:<br/>
          ${resetUrl}
        </p>
      </div>
    `;

    // send email

    await transporter.sendMail({
      from: `"TomeShelf" <${process.env.transporterEmail}>`,
      to: user.email,
      subject: "Reset Your TomeShelf Password",
      html: message,
    });

    res.status(200).json({
      message: "If that email exists, we've sent a reset link to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and newPassword are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET + user.password);

      if (decoded.purpose !== "password_reset") {
        return res.status(400).json({
          message: "Invalid token purpose",
        });
      }

      if (decoded.id !== user._id.toString()) {
        return res.status(400).json({ message: "Token user misMatch" });
      }
    } catch (jwtError) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
      
    }

     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({ message: "Password Reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};
