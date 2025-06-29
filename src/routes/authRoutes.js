import express from 'express'
import AuthController from '../controllers/authController.js'
import UserModel from "../models/User.js";
import UserRepository from "../repositories/UserRepository.js";
import AuthService from "../services/AuthService.js";


const authRouter = express.Router()

const userRepository = new UserRepository(UserModel);
const authService = new AuthService(userRepository);

authRouter.post('/register',AuthController.register(authService))
authRouter.post('/login',AuthController.login(authService))

export default authRouter