import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';

// ✅ Add debug logging for environment variables
console.log('🔍 Multer Config - Environment:', process.env.NODE_ENV);
console.log('🔍 Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');

// ✅ Initialize Cloudinary with error handling
try {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured successfully');
} catch (error) {
  console.error('❌ Cloudinary config failed:', error.message);
}

// ✅ Improved Cloudinary Storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'tomeshelf',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => {
      const uniqueId = Date.now().toString();
      console.log('📸 Cloudinary upload - Public ID:', uniqueId);
      return uniqueId;
    },
  },
});

// ✅ Local storage for development
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    console.log('💻 Local storage - Filename:', filename);
    cb(null, filename);
  }
});

// ✅ Choose storage with fallback
let storage;
if (process.env.NODE_ENV === 'production') {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    storage = cloudinaryStorage;
    console.log('🚀 Using Cloudinary storage for production');
  } else {
    console.error('❌ Cloudinary credentials missing, falling back to local storage');
    storage = localStorage;
  }
} else {
  storage = localStorage;
  console.log('💻 Using local storage for development');
}

const fileFilter = (req, file, cb) => {
  console.log('📁 File filter - Mime type:', file.mimetype);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only Image Allowed"), false);
  }
}

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

// ✅ Add file upload event logging
upload.single('image')._middleware = function(req, res, next) {
  console.log('🔄 Multer middleware called for file upload');
  this(req, res, function(err) {
    if (err) {
      console.error('❌ Multer error:', err);
    } else if (req.file) {
      console.log('✅ File processed by Multer:', {
        storage: process.env.NODE_ENV === 'production' ? 'Cloudinary' : 'Local',
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      });
    }
    next(err);
  });
};

export default upload;