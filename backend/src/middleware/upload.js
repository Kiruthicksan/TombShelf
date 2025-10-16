import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import path from "path";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isProduction = process.env.NODE_ENV === "production";

const storage = isProduction
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "tomeshelf",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
      },
    })
  : multer.diskStorage({
      destination: "uploads/",
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

const upload = multer({ storage });

export default upload;
