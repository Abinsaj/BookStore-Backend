import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const secret_key = process.env.JWT_SECRET_KEY

const creatToken = (payload) =>{
    console.log(payload,'this is the payload we got herer')
    return jwt.sign(payload,secret_key,{
        expiresIn: '10m'
    })
}

const createRefreshToken = (payload)=>{
    return jwt.sign(payload,secret_key,{
        expiresIn:"7d"
    })
}

export { creatToken, createRefreshToken }