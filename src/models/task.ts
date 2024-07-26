import mongoose from "mongoose";

interface TaskType extends Document {
	_id: string;
	content: string;
	completed: boolean;
	user: string;
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
		content: {
			type: String,
			required: [true, "Please enter content"],
		},
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Task =
	mongoose.models.Task || mongoose.model<TaskType>("Task", schema);
