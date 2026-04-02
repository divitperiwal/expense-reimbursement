import type { User } from "./common.js"

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}

