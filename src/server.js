import app from './app.js'
import connectDB from './config/databaseConfig.js'
import dotenv from 'dotenv'

dotenv.config()

connectDB()

const PORT = process.env.PORT || 5454

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})