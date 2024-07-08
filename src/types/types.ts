import { NextFunction, Request, Response } from "express";

export type ControllerType = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface UserType {
	_id: string;
	name: string;
	email: string;
	avatar: {
		_id: string;
		url: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

export type NewUserType = {
	name: string;
	email: string;
	password: string;
};

export type LoginUserType = {
	email: string;
	password: string;
};
