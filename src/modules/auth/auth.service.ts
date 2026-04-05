import { ApiError } from "@/utils/constants/api-error.js"
import { AuthDatabase } from "./auth.database.js";
import { comparePassword, hashPassword } from "@/utils/helper/hashing.js";
import { signAccessToken } from "@/utils/helper/jwt.js";
import { AuthCache } from "@/cache/auth.cache.js";

export const AuthService = {
    register: async (name: string, email: string, password: string) => {
        if (!name || !email || !password) throw new ApiError("Name, email and password are required", 400);
        const existingUser = await AuthDatabase.getUserByEmail(email);
        if (existingUser) throw new ApiError("User with this email already exists", 400);

        //Hash Password
        const hashedPassword = await hashPassword(password);

        const user = await AuthDatabase.createUser(name, email, hashedPassword);
        if (!user) throw new ApiError("Failed to create user", 500);

        //Generate JWT
        const userObj = { id: user.id, name: user.name, role: user.role };
        const accessToken = signAccessToken(userObj);
        await AuthCache.saveSession(user.id, accessToken);

        return { userId: user.id, accessToken };

    },

    login: async (email: string, password: string) => {
        if (!email || !password) throw new ApiError("Email and password are required", 400);
        const user = await AuthDatabase.getUserWithPassword(email);
        if (!user) throw new ApiError("User not found", 401);

        //Check user's password
        const isPasswordValid = comparePassword(password, user.password);
        if (!isPasswordValid) throw new ApiError("Invalid password", 401);

        const userObj = { id: user.id, name: user.name, role: user.role };
        //Create JWT token and return it to the user
        const accessToken = signAccessToken(userObj);
        await AuthCache.saveSession(user.id, accessToken);

        return { userId: user.id, accessToken };

    },
    logout: async (userId: string) => {
        if (!userId) throw new ApiError("User ID is required", 400);
        await AuthCache.clearSession(userId);
        return;
    }
}