import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies["hardchallengecookie"];

	if (!token) {
		return next(new ErrorHandler(401, "Unauthorized"));
	}

	const decodedData = jwt.verify(
		token,
		process.env.JWT_SECRET_KEY!
	) as JwtPayload;

	req.user = decodedData._id;

	next();
};
