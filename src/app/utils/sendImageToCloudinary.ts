import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import config from "../config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// ✅ Corrected Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "meals", // Store images in 'meals' folder
    format: "png", // Optional: Set file format
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

// ✅ Create Multer Upload Middleware
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit (adjust as needed)
  },
});
