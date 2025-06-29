import asyncHandler from "../middlewares/asyncHandler.js";

export default class AuthController {
    static register=(authService)=> 
        asyncHandler(async(req,res)=>{
            const { name, email, password, role } = req.body;
            const user = await authService.register({ name, email, password, role });
            res.status(201).json({ success: true, data: user });
        });
    

    static login = (authService)=> 
        asyncHandler(async(req,res)=>{
            console.log('its herer')
            const { email, password } = req.body;
            const { token, refreshToken, user } = await authService.login({ email, password });
            res.status(200).json({ success: true, token, refreshToken, data: user });
        })
    
}