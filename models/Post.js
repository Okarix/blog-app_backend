import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
			unique: true,
		},
		tags: {
			type: Array,
			default: [],
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		viewedBy: {
			type: [mongoose.Schema.Types.ObjectId],
			default: [],
			unique: true,
		},
		user: {
			// по ID будем ссылаться на пользователя
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageUrl: String,
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Post', PostSchema);
