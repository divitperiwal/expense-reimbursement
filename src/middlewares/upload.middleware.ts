import multer from "multer";
import { ApiError } from "@/utils/constants/api-error.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const uploadBill = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            cb(new ApiError("Only image files are allowed for bills", 400));
            return;
        }

        cb(null, true);
    },
});