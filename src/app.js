import express from "express";
import cors from "cors";

const app = express();

//Using Required Middlewares

//1. CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

//2. EXPRESS
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))

//Health Api
app.get('/api/v1/health', (_, res)=> {
    res.status(200).json({
        status: "active",
        service: "Job Listing Backend",
        time: new Date(),
    })
})

export default app;