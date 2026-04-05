import redis from "@/config/redis.config.js";

const USER_ME_TTL_SECONDS = 5 * 60;

export const UserCache = {
    getUser: async (userId: string) => {
        return redis.get(`user:me:${userId}`);
    },
    saveUser: async (userId: string, user: string) => {
        await redis.setex(`user:me:${userId}`, USER_ME_TTL_SECONDS, user);
    },
    clearUser: async (userId: string) => {
        await redis.del(`user:me:${userId}`);
    },
};
