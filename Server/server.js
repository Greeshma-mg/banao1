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

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS not allowed for this origin"), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.options("*", cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS not allowed for this origin"), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
