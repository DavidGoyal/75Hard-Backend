import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/types.js";
import ErrorHandler from "../utils/utility.js";

export const errorMiddleware = (
	err: ErrorHandler,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.message = err.message || "Internal Server Error";
	err.statusCode = err.statusCode || 400;

	return res.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};

export const TryCatch =
	(controller: ControllerType) =>
	(req: Request, res: Response, next: NextFunction) =>
		Promise.resolve(controller(req, res, next)).catch(next);
