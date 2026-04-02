import db from "@/config/drizzle.config.js"
import { users } from "@/database/schema/index.js";
import type { Role } from "@/types/common.js";
import { count, eq } from "drizzle-orm";

export const UserDatabase = {
    getUserById: async (userId: string) => {
        const [user] = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            status: users.status,
            createdAt: users.createdAt
        }).from(users).where(eq(users.id, userId))
        return user ?? null;
    },
    getAllUsers: async (offset: number, pageSize: number) => {
        const [user, [{ count: total }]] = await Promise.all([
            db.select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                status: users.status,
                createdAt: users.createdAt
            }).from(users).limit(pageSize).offset(offset),
            db.select({
                count: count()
            }).from(users)
        ])
        return { user, total };
    },

    updateUserRole: async (userId: string, role: Role) => {
        await db.update(users).set({ role }).where(eq(users.id, userId));
    },
    updateUserStatus: async (userId: string, status: 'active' | 'inactive') => {
        await db.update(users).set({ status }).where(eq(users.id, userId));
    }


}
