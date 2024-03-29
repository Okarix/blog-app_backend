import CommentModel from '../models/Comment.js';
import UserModel from '../models/User.js';

export const create = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId).select(['fullName', 'avatarUrl']);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const doc = new CommentModel({
			text: req.body.text,
			user: {
				id: user._id,
				fullName: user.fullName,
				avatarUrl: user.avatarUrl,
			},
			post: req.params.id,
		});

		const comment = await doc.save();

		res.json(comment);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to create comment',
		});
	}
};

export const getCommentsByPost = async (req, res) => {
	try {
		const postId = req.params.id;

		const comments = await CommentModel.find({ post: postId });

		if (comments) {
			res.json(comments);
		} else {
			res.status(404).json({ message: 'Comments not found for this post' });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to get comments' });
	}
};
