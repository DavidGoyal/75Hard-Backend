import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import { Photo } from "../models/photo.js";
import { getBase64 } from "../utils/features.js";
import ErrorHandler from "../utils/utility.js";

export const newPhoto = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const photo = req.file;

		if (!photo) {
			return next(new ErrorHandler(404, "Photo not found"));
		}

		const result = await cloudinary.v2.uploader.upload(getBase64(photo), {
			folder: "hard",
		});

		await Photo.create({
			user: req.user,
			image: {
				_id: result.public_id,
				url: result.secure_url,
			},
		});

		return res.status(201).json({
			success: true,
			message: "Photo uploaded successfully",
		});
	}
);

export const getAllPhotos = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const photos = await Photo.find({ user: req.user }).sort({ createdAt: 1 });
		return res.status(200).json({
			success: true,
			photos,
		});
	}
);

export const deleteAllPhotos = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const photos = await Photo.find({ user: req.user });

		photos.map(async (photo) => {
			await cloudinary.v2.uploader.destroy(photo.image._id);
		});

		await Photo.deleteMany({ user: req.user });
		return res.status(200).json({
			success: true,
			message: "All photos deleted successfully",
		});
	}
);
