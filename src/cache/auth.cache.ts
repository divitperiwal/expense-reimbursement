import redis from "@/config/redis.config.js";

const SESSION_TTL_SECONDS = 12 * 60 * 60;

export const AuthCache = {
	saveSession: async (userId: string, token: string) => {
		await redis.set(`session:${userId}`, token, 'EX', SESSION_TTL_SECONDS);
	},
	getSessionToken: async (userId: string) => {
		return redis.get(`session:${userId}`);
	},
	clearSession: async (userId: string) => {
		await redis.del(`session:${userId}`);
	}
}
