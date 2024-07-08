import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
	checkProgress,
	resetProgress,
	todayTaskCompleted,
	updateProgress,
} from "../controllers/progress.js";
import { singleUpload } from "../middleware/multer.js";

const app = express.Router();

app.use(isAuthenticated);

app.get("/my", checkProgress);
app.get("/today", todayTaskCompleted);
app.put("/update", singleUpload, updateProgress);
app.put("/reset", resetProgress);

export default app;
