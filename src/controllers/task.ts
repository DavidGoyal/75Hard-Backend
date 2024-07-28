import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import ErrorHandler from "../utils/utility.js";
import { Task } from "../models/task.js";

export const createTask = TryCatch(
	async (
		req: Request<{}, {}, { content: string }>,
		res: Response,
		next: NextFunction
	) => {
		const tasks = await Task.find({ user: req.user });

		if (tasks.length === 5) {
			return next(new ErrorHandler(400, "You can only make 5 tasks a day"));
		}

		const { content } = req.body;

		if (!content) {
			return next(new ErrorHandler(404, "Content is required"));
		}

		await Task.create({
			content,
			user: req.user,
		});

		res.status(201).json({
			success: true,
			message: "Task created successfully",
		});
	}
);

export const updateTask = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const taskId = req.params.id;

		if (!taskId) {
			return next(new ErrorHandler(404, "Task Id is required"));
		}

		const task = await Task.findById(taskId);

		if (!task) {
			return next(new ErrorHandler(404, "Task not found"));
		}

		task.completed = !task.completed;

		await task.save();

		res.status(200).json({
			success: true,
			message: "Task updated successfully",
		});
	}
);

export const deleteTask = TryCatch(
	async (req: Request, res: Response, next: NextFunction) => {
		const taskId = req.params.id;

		if (!taskId) {
			return next(new ErrorHandler(404, "Task Id is required"));
		}

		const task = await Task.findById(taskId);

		if (!task) {
			return next(new ErrorHandler(404, "Task not found"));
		}

		await task.deleteOne();

		res.status(200).json({
			success: true,
			message: "Task deleted successfully",
		});
	}
);

export const myTasks = TryCatch(async (req: Request, res: Response) => {
	const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
	res.status(200).json({
		success: true,
		tasks,
	});
});

export const latestTasks = TryCatch(async (req: Request, res: Response) => {
	const tasks = await Task.find({ user: req.user })
		.sort({ createdAt: -1 })
		.limit(3);
	res.status(200).json({
		success: true,
		tasks,
	});
});

export const completedTasks = TryCatch(async (req: Request, res: Response) => {
	const tasks = await Task.find({ user: req.user, completed: true });
	res.status(200).json({
		success: true,
		tasks: tasks.length,
	});
});
