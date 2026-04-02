import db from "@/config/drizzle.config.js";
import { users } from "@/database/schema/index.js";
import { eq } from "drizzle-orm";

export const AuthDatabase = {
    getUserWithPassword: async (email: string) => {
        const [user] = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            password: users.password,
            role: users.role
        }).from(users).where(eq(users.email, email));
        return user;
    },

    getUserByEmail: async (email: string) => {
        const [user] = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role
        }).from(users).where(eq(users.email, email));
        return user;
    },

    createUser: async (name: string, email: string, password: string, role: 'employee' | 'manager' | 'finance' | 'admin' = 'employee') => {
        const [user] = await db.insert(users).values({
            name,
            email,
            password,
            role
        }).returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
        })

        return user;
    }
}