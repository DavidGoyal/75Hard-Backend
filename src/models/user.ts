import bcrypt from "bcrypt";
import mongoose, { Document } from "mongoose";
import validator from "validator";

interface UserModel extends Document {
	_id: string;
	name: string;
	email: string;
	avatar: {
		_id: string;
		url: string;
	};
	password: string;
	createdAt: string;
	updatedAt: string;
}

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please Enter Name"],
		},
		avatar: {
			_id: {
				type: String,
				required: [true, "Please add Image"],
			},
			url: {
				type: String,
				required: [true, "Please add Image"],
			},
		},
		email: {
			type: String,
			unique: [true, "Email already exists"],
			required: [true, "Please Enter Email"],
			validate: validator.default.isEmail,
		},
		password: {
			type: String,
			required: [true, "Please Enter Password"],
			select: false,
			minLength: [8, "Password must be of minimum 8 characters"],
		},
	},
	{ timestamps: true }
);

schema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

export const User =
	mongoose.models.User || mongoose.model<UserModel>("User", schema);
