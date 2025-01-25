import express from 'express'
import authRoutes from "./routes/auth.routes.js"
const app = express()
import dotenv from "dotenv"

dotenv.config()

app.use("/api/auth", authRoutes)

app.listen(8000, () => {
    console.log("server is runnign on port 8000")
})