import mongoose, { Document, mongo } from "mongoose";

interface ProgressType extends Document {
	user: mongoose.Schema.Types.ObjectId;
	days: number;
	createdAt: Date;
	updatedAt: Date;
}

const schema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		days: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

export const Progress =
	mongoose.models.Progress || mongoose.model<ProgressType>("Progress", schema);
