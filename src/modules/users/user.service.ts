import type { Role, User } from "@/types/common.js";
import { ApiError } from "@/utils/constants/api-error.js";
import { UserDatabase } from "./user.database.js";
import { UserCache } from "@/cache/user.cache.js";

export const UserService = {
    getUser: async (userId: string) => {
        // if (requester.role !== 'admin' && requester.id !== userId) throw new ApiError('Forbidden', 403);
        const cached = await UserCache.getUser(userId);
        if (cached) return cached;

        const user = await UserDatabase.getUserById(userId);
        if (!user) throw new ApiError('User not found', 404);

        UserCache.saveUser(userId, JSON.stringify(user))
        return user;
    },

    getAllUsers: async (page: number) => {
        const PAGE_SIZE = 10;
        const offset = (page - 1) * PAGE_SIZE;
        const { user: users, total } = await UserDatabase.getAllUsers(offset, PAGE_SIZE);
        if (users.length === 0) throw new ApiError('No users found', 404);
        return { users, meta: { currentPage: page, totalPages: Math.ceil(total / PAGE_SIZE) } };
    },
    updateUserRole: async (userId: string, role: Role) => {
        const user = await UserDatabase.getUserById(userId);
        if (!user) throw new ApiError('User not found', 404);

        await UserDatabase.updateUserRole(userId, role);
        UserCache.clearUser(userId)
        return;
    },
    updateUserStatus: async (userId: string, status: 'active' | 'inactive') => {
        const user = await UserDatabase.getUserById(userId);
        if (!user) throw new ApiError('User not found', 404);

        await UserDatabase.updateUserStatus(userId, status);
        UserCache.clearUser(userId)
        return;
    }
}