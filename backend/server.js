import express from 'express'
import cookieParser from 'cookie-parser'
import connectMongoDB from './db/connectMongoDB.js'
import dotenv from "dotenv"
import { v2 as cloudinary } from 'cloudinary'

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"


const app = express()

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("server is runnign on port 5000")
    connectMongoDB()
})