import express from 'express';
import cors from 'cors';
import { corsOptions } from './constants.js';
import { sendSuccess } from './utils/constants/response.js';
import authRoutes from "./modules/auth/auth.route.js"
import { errorHandler, notFound } from './middlewares/error.middleware.js';


const app = express();
app.disable('x-powered-by');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Health Routes
app.get('/', (req, res) => {
    sendSuccess(res, 200, "Welcome to the API");
});

app.get('/health', (req, res) => {
    sendSuccess(res, 200, "Server is healthy", { timestamp: Date.now() });
});

app.use('/api/v1/auth', authRoutes);



app.use(errorHandler);
app.use(notFound);

export default app;