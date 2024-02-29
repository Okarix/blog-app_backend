import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		user: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			fullName: String,
			avatarUrl: String,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post', // Ссылка на модель поста
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Comment', CommentSchema);
