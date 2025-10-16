import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import path from "path";


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tomeshelf",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });
export default upload;
