import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";

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
app.get("/api/v1/health", (_, res)=> {
    res.status(200).json({
        status: "active",
        service: "Job Listing Backend",
        time: new Date(),
    })
})

//Importing Routers
import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/job.routes.js";

//Declaring Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);

//Error Handler Middleware
app.use(errorHandler)

export default app;