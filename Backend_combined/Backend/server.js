import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/mongodb.js'
//import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()

//middlewares
app.use(express.json())
app.use(cors())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

//api endpoints
app.use('/api/user',userRouter)
app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port,()=>console.log("Server Started",port))