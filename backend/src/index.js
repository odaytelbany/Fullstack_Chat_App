import express from 'express';
import authRouter from "./routes/auth.routes.js";
import { connectDB } from '../config/db.js';

const app = express();

app.use("/api/auth", authRouter)

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is running on: http://localhost:' + PORT);
  connectDB();
});