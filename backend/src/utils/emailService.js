import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.transporterEmail,
    pass: process.env.transporterpass,
  },
});


// checking
transporter.verify((error, success) => {
    if(error){
        console.log("Email transporter error:",error)
    }else{
        console.log("Email transporter ready", success)
    }
})

export default transporter
