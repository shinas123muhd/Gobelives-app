// # Cloudinary configuration
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file, folder = "") => {
  try {
    if (!file) return null;

    // Handle both file path (legacy) and buffer (new)
    let uploadOptions = {
      resource_type: "auto",
      folder: folder,
    };

    let response;
    if (typeof file === "string") {
      // Legacy: file path
      response = await cloudinary.uploader.upload(file, uploadOptions);
      // Remove locally saved temporary file
      fs.unlinkSync(file);
    } else {
      // New: buffer from multer memory storage
      response = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    // Delete the file from Cloudinary
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
