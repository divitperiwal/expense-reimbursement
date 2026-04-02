import { ApiError } from "@/utils/constants/api-error.js";
import { verifyAccessToken } from "@/utils/helper/jwt.js";
import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw new ApiError("Unauthorized", 401);

        const payload = verifyAccessToken(token);
        req.user = payload 
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) throw new ApiError("Invalid Token", 401);
        if (error instanceof jwt.TokenExpiredError) throw new ApiError("Token Expired", 401);
    }
}