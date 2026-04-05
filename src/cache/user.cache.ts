import redis from "@/config/redis.config.js";

const USER_ME_TTL_SECONDS = 5 * 60;

export const UserCache = {
    getUser: async (userId: string) => {
        return redis.get(`user:me:${userId}`);
    },
    saveUser: async (userId: string, user: string) => {
        await redis.set(`user:me:${userId}`, user, 'EX', USER_ME_TTL_SECONDS);
    },
    clearUser: async (userId: string) => {
        await redis.del(`user:me:${userId}`);
    },
};
