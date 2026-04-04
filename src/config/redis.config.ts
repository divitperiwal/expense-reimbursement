import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_HOST as string);

redis.on("connect", () => console.log("Connected to Redis"));
redis.on("error", (err: Error) => console.error("Redis connection error:", err));

export default redis;