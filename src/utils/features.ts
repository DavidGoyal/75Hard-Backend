import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserType } from "../types/types.js";

export const connectDB = (): void => {
	mongoose
		.connect(process.env.MONGODB_URI as string, {
			dbName: "75Hard",
		})
		.then((c) => console.log(`Database connected with ${c.connection.host}`))
		.catch((e) => console.log(e));
};

export const sendToken = (
	res: Response,
	statusCode: number,
	message: string,
	user: UserType
) => {
	const token = jwt.sign(
		{ _id: user._id },
		process.env.JWT_SECRET_KEY as string
	);

	const options: CookieOptions = {
		maxAge: 10 * 24 * 60 * 60 * 1000,
		sameSite: "none",
		httpOnly: true,
		secure: true,
	};

	res.status(statusCode).cookie("hardchallengecookie", token, options).json({
		success: true,
		message,
		user,
	});
};

export const getBase64 = (file: Express.Multer.File) =>
	`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
