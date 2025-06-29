import jwt from 'jsonwebtoken'
import AppError from '../utils/AppError.js'
import dotenv from 'dotenv'

dotenv.config()

export const verifyToken = (req,res,next)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return next(new AppError('No token provided', 401));
    };

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError('Invalid or expired token', 401));
    }
}

export const checkRole = (...role)=>{
    return (req,res,next)=>{
        if(!req.user){
            return next(new AppError('Unauthorized',401));
        };

        if(!role.includes(req.user.role)){
            return next(new AppError('Forbidden: You do not have permission', 403));
        }
        next();
    }
}