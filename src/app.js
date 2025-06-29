import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/authRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import bookRouter from './routes/bookRoutes.js';
import purchaseRouter from './routes/purchaseRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth',authRouter);
app.use('/api/book',bookRouter)
app.use('/api/purchase',purchaseRouter)


app.use((req,res,next)=>{
    res.status(404).json({success: false, message: 'Route not found'});
});

app.use(errorHandler);

export default app;