import { createRefreshToken, creatToken } from "../config/jwtConfig.js";
import AppError from "../utils/AppError.js";
import jwt from 'jsonwebtoken'

export default class AuthService{
    constructor(userRepository){
        this.userRepository = userRepository
    }

    async register({name,email,password,role}){
        const existingUser = await this.userRepository.findByEmail(email);

        if(existingUser){
            throw new AppError('User already Exist',400)
        }

        const newUser = await this.userRepository.create({
            name,email,password, role
        });

        return newUser;
    }

    async login({email,password}){

        const user = await this.userRepository.findByEmail(email)
        if(!user){
            throw new AppError('Invalid credentials',401)
        }

        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            console.log(isMatch,'what is this')
            throw new AppError('Invalid credentials',401)
        }

        const payload = { userId: user._id, role : user.role}

        let token = creatToken(payload)
        let refreshToken = createRefreshToken(payload)

        return {token,refreshToken, user}

    }

}