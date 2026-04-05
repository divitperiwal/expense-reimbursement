import express from 'express';
import cors from 'cors';
import { corsOptions } from './constants.js';
import { sendSuccess } from './utils/constants/response.js';
import helmet from 'helmet';
import authRoutes from "./modules/auth/auth.route.js"
import userRoutes from "./modules/users/user.route.js"
import claimsRoute from "./modules/claims/claims.route.js"
import dashboardRoute from "./modules/dashboard/dashboard.route.js"
import { apiRateLimiter } from './middlewares/rate-limit.middleware.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));

//Health Routes
app.get('/', (req, res) => {
    sendSuccess(res, 200, "Welcome to the API");
});

app.get('/health', (req, res) => {
    sendSuccess(res, 200, "Server is healthy", { timestamp: Date.now() });
});

app.use('/api/', apiRateLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/claims', claimsRoute);
app.use('/api/v1/dashboard', dashboardRoute);

app.use(errorHandler);
app.use(notFound);

export default app;