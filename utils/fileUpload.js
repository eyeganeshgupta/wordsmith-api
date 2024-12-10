const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configuring Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Creating an instance of Cloudinary storage for handling file uploads
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"], // Restrict file formats to images only
  params: {
    folder: "wordsmith-api",
    transformation: [
      {
        width: 500,
        height: 500,
        crop: "limit",
      },
    ],
  },
});

// Export the storage instance for use in file upload configurations
module.exports = storage;
