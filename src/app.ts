import express from 'express';
import cors from 'cors';
import { corsOptions } from './constants.js';


const app = express();
app.disable('x-powered-by');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Health Routes
app.get('/', (req, res) => {
    
})

app.get('/health', (req, res) => {
      
})

export default app;