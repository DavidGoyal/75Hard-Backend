import mongoose from "mongoose";

interface PhotoType extends Document {
	_id: string;
	image: {
		_id: string;
		url: string;
	};
	user: string;
	createdAt: Date;
	updatedAt: Date;
}

const schema = new mongoose.Schema(
	{
		image: {
			_id: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

export const Photo =
	mongoose.models.Photo || mongoose.model<PhotoType>("Photo", schema);
