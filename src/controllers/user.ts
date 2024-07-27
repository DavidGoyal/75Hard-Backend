import { compare } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import { Progress } from "../models/progress.js";
import { User } from "../models/user.js";
import { LoginUserType, NewUserType } from "../types/types.js";
import { getBase64, sendToken } from "../utils/features.js";
import ErrorHandler from "../utils/utility.js";
import cloudinary from "cloudinary";

export const newUser = TryCatch(
	async (
		req: Request<{}, {}, NewUserType>,
		res: Response,
		next: NextFunction
	) => {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return next(new ErrorHandler(400, "All fields are required"));
		}

		let user = await User.findOne({ email });

		if (user) {
			return next(new ErrorHandler(400, "Email Already Exists"));
		}

		const photo = req.file;

		if (!photo) {
			return next(new ErrorHandler(404, "Photo not found"));
		}

		const result = await cloudinary.v2.uploader.upload(getBase64(photo), {
			folder: "avatar",
		});

		user = await User.create({
			name,
			email,
			password,
			avatar: {
				_id: result.public_id,
				url: result.secure_url,
			},
		});

		await Progress.create({
			user: user._id,
		});

		sendToken(res, 201, "User registered successfully", user);
	}
);

export const loginUser = TryCatch(
	async (
		req: Request<{}, {}, LoginUserType>,
		res: Response,
		next: NextFunction
	) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return next(new ErrorHandler(400, "All fields are required"));
		}

		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return next(new ErrorHandler(400, "Invalid Email or Password"));
		}

		const isMatch = await compare(password, user.password);

		if (!isMatch) {
			return next(new ErrorHandler(400, "Invalid Email or Password"));
		}

		sendToken(res, 200, `Welcome back ${user.name}`, user);
	}
);

export const logoutUser = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		res.cookie("hardchallengecookie", null, {
			maxAge: 0,
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		res.status(200).json({
			success: true,
			message: "Logged Out",
		});
	}
);

export const myProfile = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findById(req.user);

		if (!user) {
			return next(new ErrorHandler(404, "User not found"));
		}

		return res.status(200).json({
			success: true,
			user,
		});
	}
);
