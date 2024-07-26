import express from "express";
import {
	completedTasks,
	createTask,
	deleteTask,
	latestTasks,
	myTasks,
	updateTask,
} from "../controllers/task.js";
import { isAuthenticated } from "../middleware/auth.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new", createTask);

app.get("/my", myTasks);

app.get("/complete", completedTasks);

app.get("/latest", latestTasks);

app.route("/:id").put(updateTask).delete(deleteTask);

export default app;
