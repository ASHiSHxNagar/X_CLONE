import express from 'express'
import authRoutes from "./routes/auth.routes.js"
const app = express()
import dotenv from "dotenv"
import connectMongoDB from './db/connectMongoDB.js'

dotenv.config()

app.use("/api/auth", authRoutes)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("server is runnign on port 5000")
    connectMongoDB()
})