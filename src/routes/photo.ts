import express from "express";
import {
	deleteAllPhotos,
	getAllPhotos,
	newPhoto,
} from "../controllers/photo.js";
import { isAuthenticated } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new", singleUpload, newPhoto);
app.route("/my").get(getAllPhotos).delete(deleteAllPhotos);

export default app;
