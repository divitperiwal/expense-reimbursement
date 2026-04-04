import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "@/utils/constants/api-error.js";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    throw new ApiError("Cloudinary configuration is missing", 500);
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true,
});

export { cloudinary };