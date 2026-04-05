import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '@/config/redis.config.js';

const createRedisStore = (prefix: string) =>
    new RedisStore({
        sendCommand: (...args: string[]) => redis.call(args[0], ...args.slice(1)) as Promise<any>,
        prefix,
    });

export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore('rl:api:'),
    message: {
        success: false,
        statusCode: 429,
        message: 'Too many requests, please try again later.',
    },
});

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore('rl:auth:'),
    message: {
        success: false,
        statusCode: 429,
        message: 'Too many authentication attempts, please try again later.',
    },
});
