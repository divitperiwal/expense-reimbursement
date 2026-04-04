import { ApiError } from "@/utils/constants/api-error.js";
import { cloudinary } from "@/config/cloudinary.config.js";

export const uploadClaimImageToCloudinary = async (file: Express.Multer.File, userId: string) => {
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "");

    return await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "bills",
                resource_type: "image",
                public_id: `${safeUserId}/${Date.now()}`,
                overwrite: false,
            },
            (error, result) => {
                if (error) {
                    reject(new ApiError(`Failed to upload bill image: ${error.message}`, 500));
                    return;
                }

                if (!result?.secure_url) {
                    reject(new ApiError("Failed to retrieve uploaded bill URL", 500));
                    return;
                }

                resolve(result.secure_url);
            }
        );

        uploadStream.end(file.buffer);
    });
};

const extractCloudinaryPublicId = (billUrl: string) => {
    const uploadSegment = "/upload/";
    const uploadIndex = billUrl.indexOf(uploadSegment);

    if (uploadIndex === -1) return null;

    const pathAfterUpload = billUrl.slice(uploadIndex + uploadSegment.length);
    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
    const withoutQuery = withoutVersion.split("?")[0];
    const withoutExtension = withoutQuery.replace(/\.[a-zA-Z0-9]+$/, "");

    return withoutExtension || null;
};

export const deleteClaimImageFromCloudinary = async (billUrl: string) => {
    const publicId = extractCloudinaryPublicId(billUrl);

    if (!publicId) {
        return;
    }

    const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
        throw new ApiError(`Failed to delete bill image: ${result.result}`, 500);
    }
};