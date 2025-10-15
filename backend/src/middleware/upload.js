import multer from 'multer';
import path from 'path';
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
      params: async (req, file) => {
        return {
          folder: 'tomeshelf',
          format: 'jpg', 
          public_id: Date.now().toString(), 
        };
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/')
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
      }
    });

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  } else {
    cb(new Error("Only Image Allowed"), false)
  }
}

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

export default upload;