// ✅ SIMPLE VERSION - Remove all the custom middleware
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = process.env.NODE_ENV === 'production' 
  ? new CloudinaryStorage({
      cloudinary: cloudinary.v2,
      params: {
        folder: 'tomeshelf',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
    })
  : multer.diskStorage({
      destination: 'uploads/',
      filename: (req, file, cb) => {
        cb(null, Date.now() + require('path').extname(file.originalname));
      }
    });

const upload = multer({ storage });

export default upload;