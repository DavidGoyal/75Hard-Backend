import express from "express";
import {
	loginUser,
	logoutUser,
	myProfile,
	newUser,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const app = express.Router();

app.post("/new", singleUpload, newUser);
app.post("/login", loginUser);
app.get("/logout", logoutUser);

app.get("/me", isAuthenticated, myProfile);

export default app;
