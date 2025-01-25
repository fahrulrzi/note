import express, { Request, Response } from "express";
import userRoutes from "./routes/users";
import authRoutes from "./auth/auth";
import noteRoutes from "./routes/notes";
import cors from "cors";
import dotenv from "dotenv";

// Create a new express application instance
dotenv.config();
const app = express();

// Midleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Batasi ke domain tertentu jika memungkinkan
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Set the network port
const port = process.env.PORT || 3000;

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Express + TypeScript Server! haloha test test",
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
