import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.route.js";
import { connectDB } from './config/db.js';
import { ERROR } from './utils/httpStatusText.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));

app.use("/api/auth", authRouter)
app.use("/api/messages", messageRouter)

app.all("*name", (req, res, next) => {
  res.status(404).json({status: ERROR, message: "Resource not found!"});
})

app.use((error, req, res, next) => {
  res.status(error.statusCode || 400).json({
    status: error.statusText || ERROR,
    message: error.message || "Something went wrong!",
    data: null,
    code: error.statusCode || 400
  })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on: http://localhost:' + PORT);
  connectDB();
});