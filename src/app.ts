import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middleware/error.js";
import { connectDB } from "./utils/features.js";

import photoRoutes from "./routes/photo.js";
import progressRoutes from "./routes/progress.js";
import userRoutes from "./routes/user.js";

dotenv.config({ path: ".env" });

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5174",
			process.env.FRONTEND_URL!,
		],
		credentials: true,
	})
);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 4000;

connectDB();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/photo", photoRoutes);
app.use("/api/v1/progress", progressRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
