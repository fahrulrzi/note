import express, { Request, Response } from "express";
import userRoutes from "./routes/users";
import authRoutes from "./auth/auth";
import noteRoutes from "./routes/notes";
import tagRoutes from "./routes/tags";
import imagesRoutes from "./routes/images";
import cors from "cors";
import dotenv from "dotenv";
import authMiddleware from "./middleware/authMiddleware";
import fileUpload from "express-fileupload";

// Create a new express application instance
dotenv.config();
const app = express();

// Midleware
app.use(express.json());
app.use(fileUpload());
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
app.use("/api/notes", authMiddleware, noteRoutes);
app.use("/api/tags", authMiddleware, tagRoutes);
app.use("/api/images", authMiddleware, imagesRoutes);

// Set the network port
const port = process.env.PORT || 3000;

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Fahrul's API Notes",
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
