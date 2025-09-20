import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",         
  "https://banao1-1.onrender.com"   
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
