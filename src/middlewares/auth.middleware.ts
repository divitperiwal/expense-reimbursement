import { ApiError } from "@/utils/constants/api-error.js";
import { verifyAccessToken } from "@/utils/helper/jwt.js";
import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express";
import { AuthCache } from "@/cache/auth.cache.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw new ApiError("Unauthorized", 401);

        const payload = verifyAccessToken(token);
        const activeToken = await AuthCache.getSessionToken(payload.id);
        if (!activeToken || activeToken !== token) throw new ApiError("Session expired. Please login again.", 401);

        req.user = payload
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) throw new ApiError("Invalid Token", 401);
        if (error instanceof jwt.TokenExpiredError) throw new ApiError("Token Expired", 401);
        throw new ApiError("Unauthorized", 401);
    }
}