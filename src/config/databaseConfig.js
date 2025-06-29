import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('mongodb connected')
    } catch (error) {
        console.log('database does not connected', error.message)
    }
}

export default connectDB