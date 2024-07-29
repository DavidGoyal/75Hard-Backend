import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import { Progress } from "../models/progress.js";
import ErrorHandler from "../utils/utility.js";
import { Photo } from "../models/photo.js";
import cloudinary from "cloudinary";
import { getBase64 } from "../utils/features.js";
import { Task } from "../models/task.js";

export const checkProgress = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const progress = await Progress.findOne({ user: req.user });

		if (!progress) {
			return next(new ErrorHandler(404, "Progress not found"));
		}

		if (progress.days !== 0) {
			const lastDate = new Date(progress.updatedAt);
			const todayDate = new Date();

			const OddDaysMonths = [1, 3, 5, 8, 10, 12];

			let diff = 0;

			const monthDiff = (todayDate.getMonth() - lastDate.getMonth() + 12) % 12;

			if (todayDate.getFullYear() - lastDate.getFullYear() > 1) {
				diff = 2;
			} else if (todayDate.getFullYear() - lastDate.getFullYear() > 0) {
				if (monthDiff > 1 || monthDiff === 0) {
					diff = 2;
				} else if (monthDiff == 1) {
					diff = (todayDate.getDate() - lastDate.getDate() + 31) % 31;
				}
			} else {
				if (todayDate.getMonth() === lastDate.getMonth()) {
					diff = todayDate.getDate() - lastDate.getDate();
				} else if (OddDaysMonths.includes(lastDate.getMonth())) {
					diff = (todayDate.getDate() - lastDate.getDate() + 31) % 31;
				} else {
					diff = (todayDate.getDate() - lastDate.getDate() + 30) % 30;
				}
			}

			if (diff >= 2) {
				progress.days = 0;
				await progress.save();

				const photos = await Photo.find({ user: req.user });

				photos.map(async (photo) => {
					await cloudinary.v2.uploader.destroy(photo.image._id);
				});

				await Photo.deleteMany({ user: req.user });
			}
		}

		const date = new Date(Date.now());
		date.setHours(0, 0, 0, 0);

		await Task.deleteMany({ user: req.user, createdAt: { $lt: date } });

		return res.status(200).json({
			success: true,
			days: progress.days,
		});
	}
);

export const todayTaskCompleted = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const progress = await Progress.findOne({ user: req.user });

		if (!progress) {
			return next(new ErrorHandler(404, "Progress not found"));
		}

		const lastDate = new Date(progress.updatedAt);
		const todayDate = new Date();

		if (
			progress.days > 0 &&
			todayDate.getDate() === lastDate.getDate() &&
			todayDate.getMonth() === lastDate.getMonth() &&
			todayDate.getFullYear() === lastDate.getFullYear()
		) {
			return res.status(200).json({
				success: true,
			});
		} else {
			return res.status(200).json({
				success: false,
			});
		}
	}
);

export const updateProgress = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const progress = await Progress.findOne({ user: req.user });

		if (!progress) {
			return next(new ErrorHandler(404, "Progress not found"));
		}

		const tasks = await Task.find({ user: req.user, completed: true });

		if (tasks.length < 5) {
			return next(new ErrorHandler(404, "First complete all of your tasks"));
		}

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

		progress.days += 1;

		await progress.save();

		await Task.deleteMany({ user: req.user });

		return res.status(200).json({
			success: true,
			message: "Congratulations for completing today's task",
		});
	}
);

export const resetProgress = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const progress = await Progress.findOne({ user: req.user });

		if (!progress) {
			return next(new ErrorHandler(404, "Progress not found"));
		}

		progress.days = 0;
		await progress.save();

		const photos = await Photo.find({ user: req.user });

		photos.map(async (photo) => {
			await cloudinary.v2.uploader.destroy(photo.image._id);
		});

		await Photo.deleteMany({ user: req.user });

		return res.status(200).json({
			success: true,
			message: "Progress reset successfully",
		});
	}
);
